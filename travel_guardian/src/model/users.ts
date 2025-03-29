"use server";
import prisma from "@/lib/db";
import { users } from "@prisma/client";
import bcrypt from "bcrypt";
const saltRounds = 10;

export async function createUser(
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  const existing = await findUser(username);

  if (existing) {
    return null;
  }

  const hashed = bcrypt.hashSync(password, saltRounds);

  const newUser: users = await prisma.users.create({
    data: {
      username,
      email,
      password: hashed,
      first_name: firstName,
      last_name: lastName,
      type: "travler",
    },
  });

  return newUser;
}

export async function findUser(username: string) {
  const user = await prisma.users.findFirst({ where: { username } });
  return user;
}

export async function findUserByEmail(email: string) {
  const user = await prisma.users.findFirst({ where: { email } });
  return user;
}

export async function getUser(id: number) {
  const user = await prisma.users.findUnique({ where: { id } });
  return user;
}

export async function login(username: string, password: string) {
  let user = await findUser(username);
  if (!user) {
    user = await findUserByEmail(username);
  }
  if (user) {
    const isValid = bcrypt.compareSync(password, user.password);
    console.log(isValid);
    if (isValid) {
      return user;
    }
  }
  return null;
}

export async function deleteUser(id: number) {
  const user = await getUser(id);
  if (!user) {
    return null;
  }
  return prisma.users.delete({ where: { id } });
}