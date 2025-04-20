import { prisma } from "@/lib/db";

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
