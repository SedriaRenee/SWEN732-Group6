import { describe } from 'node:test';
import { beforeEach, afterEach, expect } from "vitest";
import { vi } from "vitest";
import {test} from 'vitest';
import { testCity, testReports } from '../constants';
import { createLocation } from '@/model/location';
import { createReport, findByTag } from '@/model/report';
import prisma from '@/lib/db';

vi.mock("@/lib/db");

describe("Filter Reports", () => {
    let id: number;
    let tag: string;

    let locationId: number;

    beforeEach(async () => {  // Mock Report Creation
        vi.clearAllMocks();

        // Mock Location
        vi.spyOn(prisma.location, "create").mockResolvedValue(testCity);
        const location = await createLocation(testCity.name, "");
        locationId = location.id;
        
        // Mock Reports for Tests
        for (let report of testReports) {
            vi.spyOn(prisma.report, "create").mockResolvedValue(report);
            const r = await createReport(report.name, report.desc, locationId, report.tag ?? "");
        }
    });
    
    test("GetFilter NO RISK", async () => {
        const keyword = "NO-RISK";
        vi.spyOn(prisma.report, "findMany").mockResolvedValue([testReports[2]]);
        const reports = await findByTag(keyword);
        expect(reports).not.toBeNull();
        expect(reports).not.toBeUndefined();
        expect(reports.length).toBe(1);
    });

    test("GetFilter LOW RISK", async () => {
        const keyword = "LOW-RISK";
        vi.spyOn(prisma.report, "findMany").mockResolvedValue([testReports[1]]);
        const reports = await findByTag(keyword);
        expect(reports).not.toBeNull();
        expect(reports).not.toBeUndefined();
        expect(reports.length).toBe(1);
    });

    test("GetFilter HIGH RISK", async () => {
        const keyword = "HIGH-RISK";
        vi.spyOn(prisma.report, "findMany").mockResolvedValue([testReports[0]]);
        const reports = await findByTag(keyword);
        expect(reports).toHaveLength(1); 
    });

});
