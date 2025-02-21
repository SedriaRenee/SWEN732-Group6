"use server";
import { Prisma, PrismaClient } from '@prisma/client'

let prismaClient: PrismaClient;

export async function getPrisma() {
   if (prismaClient) return prismaClient
    
    prismaClient = new PrismaClient();
    return prismaClient;
}