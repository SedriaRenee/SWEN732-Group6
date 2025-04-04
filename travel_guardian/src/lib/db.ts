'use server';
import { PrismaClient } from '@prisma/client';

let prismaClient: PrismaClient | undefined;

export async function getPrisma() {
  if (!prismaClient) {
    prismaClient = new PrismaClient();
  }
  return prismaClient;
}
