import prisma from "@/lib/db";


export interface User {
  id?: number;
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
}

export async function createUser(
  email: string,
  username: string,
  hashedPassword: string,
  firstName: string,
  lastName: string
) {
  // Check if the user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username },
      ],
    },
  });
  if (existingUser) {
    return null;
  }

  return prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
    },
  });
}

export async function searchUserEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUser(id: number) {
  return await prisma.user.findUnique({ where: { id } });
}

export async function searchUsername(username: string) {
  return prisma.user.findUnique({ where: { username } });
}

export async function deleteUser(id: number) {
  const user = await getUser(id);
  if (!user) {
    return null;
  }
  return prisma.user.delete({ where: { id } });
}