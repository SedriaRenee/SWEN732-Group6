"use server";
import { getPrisma } from "@/lib/db";
import { report } from "@prisma/client";

export async function getReports(locationId: number): Promise<report[]> {
    const client = await getPrisma();
    return client.report.findMany({ where: { locId: locationId } });
}

export async function createReport(name: string, desc: string, locationId: number, tag: string=""): Promise<report> {
    const client = await getPrisma();
    return client.report.create({ data: { name, desc, locId: locationId, tag } });
}

export async function searchReport(keyword: string) : Promise<report[] | null> { 
    const client = await getPrisma(); 
    return client.report.findMany({where: {tag: keyword}});
}

export async function deleteReport(reportId: number) {
    const client = await getPrisma();
    return client.report.delete({where:{id:reportId}});    
}
