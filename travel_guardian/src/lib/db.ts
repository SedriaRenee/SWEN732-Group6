'use server';
import { PrismaClient } from '@prisma/client';

const prisma: PrismaClient = new PrismaClient();
export default prisma;
/*
let prismaClient: PrismaClient | undefined;

export async function getPrisma() {
  if (!prismaClient) {
    prismaClient = new PrismaClient();
  }

  return prismaClient;
}
*/
