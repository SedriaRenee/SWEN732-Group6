"use server";
import { getPrisma } from "@/lib/db";
import { location, Prisma } from "@prisma/client";

export async function searchLocation(name: string): Promise<LocationResult[]> {
    const client = await getPrisma();
    const res = await client.location.findMany({ where: { name: { startsWith: name, mode: "insensitive" } }, include: {parent: true}, take: 10, orderBy: { name: 'asc'} });
    return res.map((loc) => ({ id: loc.id, name: loc.name, type: loc.type, parentName: loc.parent?.name ?? "" }));
}

export async function getLocation(id: number): Promise<FullLocation | null> {
    const client = await getPrisma();
    return client.location.findFirst({ where: { id }, include: { parent: true, children: true }  });
}

export async function getCountries(): Promise<location[]> {
    const client = await getPrisma();
    return client.location.findMany({ where: { type: "country" } });
}

export type LocationResult = {
    id: number;
    name: string;
    type: string;
    parentName: string;
}

export type FullLocation = Prisma.locationGetPayload<{
    include: {
        parent: true;
        children: true;
    };
}>;
