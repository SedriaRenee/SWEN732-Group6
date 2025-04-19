"use server";

import { prisma } from "@/lib/db";
import { location, Prisma } from "@prisma/client";

export async function searchLocation(name: string): Promise<LocationResult[]> {
    const res = await prisma.location.findMany({ where: { name: { startsWith: name, mode: "insensitive" } }, include: {parent: true}, take: 10, orderBy: { name: 'asc'} });
    return res.map((loc) => ({ id: loc.id, name: loc.name, type: loc.type, parentName: loc.parent?.name ?? "" }));
}

export async function getLocation(id: number): Promise<FullLocation | null> {
    return prisma.location.findFirst({ where: { id }, include: { parent: true, children: true }  });
}

export async function removeLocation(id: number): Promise<location | null> {
    const loc = await prisma.location.findFirst({ where: { id } });
    if (!loc) {
        return null;
    }
    return prisma.location.delete({ where: { id } });
}

export async function getCountries(): Promise<location[]> {

    return prisma.location.findMany({ where: { type: "country" } });
}

export async function createLocation(name: string, parentName: string): Promise<location> {
    let parentId = null;
    if (parentName.length > 0) {
        
        const parent = await prisma.location.findMany({where: {name: parentName}});

        if (parent.length == 0) {
            //  Location shoudln't be creeated without a parent
            // Enabled for testing purposes

            const parent = await prisma.location.create({data: {name: parentName, type: "state", lat: "0", lon: "0", parentId: null}});
            parentId = parent.id;
        } else {
            // TODO: select correct parent
            parentId = parent[0].id;
        }
    }

    return prisma.location.create({ data: { name, type: "city", lat: "0", lon: "0", parentId: null } });

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

