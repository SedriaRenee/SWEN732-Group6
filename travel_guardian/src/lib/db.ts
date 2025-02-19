"use server";
import { Prisma, PrismaClient } from '@prisma/client'

let prismaClient: PrismaClient;

export async function getPrisma() {
   if (prismaClient) return prismaClient
    
    prismaClient = new PrismaClient();
    return prismaClient;
}

export async function getLocationByName(name: string) {
    const client = await getPrisma();
    return client.location.findFirst({ where: { name }, include: { parent: true, children: true } });
}

export type FullLocation = Prisma.locationGetPayload<{
    include: {
        parent: true;
        children: true;
    };
}>;
