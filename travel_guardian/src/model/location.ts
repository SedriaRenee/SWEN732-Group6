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

export async function createLocation(name: string, parentName: string): Promise<location> {
    const client = await getPrisma();

    let parentId = null;
    if (parentName.length > 0) {
        
        const parent = await client.location.findMany({where: {name: parentName}});

        if (parent.length == 0) {
            //  Location shoudln't be creeated without a parent
            // Enabled for testing purposes

            const parent = await client.location.create({data: {name: parentName, type: "state", lat: "0", lon: "0", parentId: null}});
            parentId = parent.id;
        } else {
            // TODO: select correct parent
            parentId = parent[0].id;
        }
    }

    return client.location.create({ data: { name, type: "city", lat: "0", lon: "0", parentId } });
}

// Location model that includes only the immediate parent name, and basic location info. Used for searching
export type LocationResult = {
    id: number;
    name: string;
    type: string;
    parentName: string;
}

// Location model that includes the immediate parent and ALL children
export type FullLocation = Prisma.locationGetPayload<{
    include: {
        parent: true;
        children: true;
    };
}>;

// Function for comparing location names 
export async function normalizeLocation(name: string): Promise<string> {
    return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}