"use server";
import { prisma } from "@/lib/db";
import { report } from "@prisma/client";

export async function getReports(locationId: number): Promise<report[]> {
  return prisma.report.findMany({ where: { locId: locationId } });
}

export async function createReport(
  name: string,
  desc: string,
  risk: string,
  locationId: number,
  userId: number
): Promise<report> {
  return prisma.report.create({
    data: { name, desc, locId: locationId, tag: risk },
  });
}

export async function searchReport(keyword: string): Promise<report[] | null> {
  return prisma.report.findMany({ where: { tag: keyword } });
}

export async function deleteReport(reportId: number) {
  return prisma.report.delete({ where: { id: reportId } });
}

export async function findByTag(tag: string) {
  return prisma.report.findMany({ where: { tag } });
}
