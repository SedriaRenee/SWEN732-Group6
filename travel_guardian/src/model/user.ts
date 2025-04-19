'use server'
import { prisma } from "@/lib/db";
import { Prisma, visit } from "@prisma/client";

export interface User {
  id?: number;
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
}

/**
 * Create a new user if email or username doesn't already exist.
 */
export async function createUser(
  email: string,
  username: string,
  hashedPassword: string,
  firstName: string,
  lastName: string
) {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    throw new Error("User with given email or username already exists");
  }

  return prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    },
  });
}

/**
 * Find a user by email.
 */
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

/**
 * Find a user by username.
 */
export async function findUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
  });
}

/**
 * Get a user by their ID.
 */
export async function getUser(id: number) {
  return prisma.user.findUnique({
    where: { id },
  });
}

/**
 * Delete a user by ID, if they exist.
 */
export async function deleteUser(id: number) {
  const user = await getUser(id);
  if (!user) {
    return null;
  }

  return prisma.user.delete({
    where: { id },
  });
}

/** Methods to handle users interaction with location */
export async function hasUserVisited(
  userId: number,
  locId: number
): Promise<visit | null> {
  const visit = await prisma.visit.findFirst({
    where: {
      userId: userId,
      locationId: locId,
      past: true,
      longTerm: false
    },
  });

  return visit;
}

export async function doesUserWantToVisit(
  userId: number,
  locId: number
): Promise<visit | null> {
  const visit = await prisma.visit.findFirst({
    where: {
      userId: userId,
      locationId: locId,
      past: false,
    },
  });
  return visit;
}

export async function isUserHome(
  userId: number,
  locId: number
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return false;
  }
  console.log(user.hometownId + " == " + locId);
  return user.hometownId == locId;
}

export async function toggleUserVisit(userId: number, locId: number): Promise<visit> {
  const visit = await hasUserVisited(userId, locId);
  if (visit) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (user && user.hometownId == locId) {
      await prisma.user.update({
        where: { id: userId },
        data: { hometownId: null },
      });
    }
    return prisma.visit.delete({
      where: {
        id: visit.id,
      },
    });
  }
  return prisma.visit.create({
    data: {
      userId: userId,
      locationId: locId,
      past: true,
      longTerm: false,
    },
  });
}

export async function toggleUserWantToVisit(
  userId: number,
  locId: number
): Promise<visit> {
  const visit = await doesUserWantToVisit(userId, locId);
  if (visit) {
    return prisma.visit.delete({
      where: {
        id: visit.id,
      },
    });
  }
  return prisma.visit.create({
    data: {
      userId: userId,
      locationId: locId,
      past: false,
      longTerm: false,
    },
  });
}

export async function toggleUserHome(
  userId: number,
  locId: number
){
  const visit = await isUserHome(userId, locId);
  if (visit) {
    await prisma.user.update({where: {id: userId}, data: {hometownId: null}})
  } else {
    await prisma.user.update({where: {id: userId}, data: {hometownId: locId}})
  }
}

export type UserProfile = Prisma.userGetPayload<{
    include: {
        hometown: true;
        visits: {
          include: {
            location: true;
          };
        };
    };
}>;