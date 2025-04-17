import { prisma } from "@/lib/db"; 

export async function createUser(
  email: string,
  username: string,
  hashedPassword: string,
  firstName: string,
  lastName: string
) {
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

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function findUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
  });
}
