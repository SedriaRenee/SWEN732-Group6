import {test, assert, vi, describe, beforeEach} from 'vitest';
import { createReport, getReports } from '@/model/report';
import { createLocation, searchLocation } from '@/model/location';
import { prisma } from "@/lib/db";
import { testCity, testNewReport, testReport } from '../constants';

vi.mock("@/lib/db");

describe("Report Unit Tests", () => {

    let locationId: number;
    let reportId: number;

    beforeEach(async () => {
        vi.resetAllMocks();

        // Mock Location for Reports
        vi.spyOn(prisma.location, "create").mockResolvedValue(testCity);
        const location = await createLocation(testCity.name, "");
        locationId = location.id;

        vi.spyOn(prisma.report, "create").mockResolvedValue(testReport);
        const report = await createReport(testReport.name, testReport.desc, locationId, testReport.tag ?? "");
        reportId = report.id;
    });

    test("Get Reports", async () => {
        vi.spyOn(prisma.report, "findMany").mockResolvedValue([]);
        const reports = await getReports(locationId);
        assert.isArray(reports, "Reports is not an array");
        assert.equal(reports.length, 0, "Reports is not empty");
    }); 

    test("Create Report", async() => {
        vi.spyOn(prisma.report, "create").mockResolvedValue(testNewReport);
        const report = await createReport(testNewReport.name, testNewReport.desc, locationId, testNewReport.tag ?? "");

        assert.isObject(report, "Report not created");
        assert.equal(report.name, testNewReport.name, "Report name not correct");
        assert.equal(report.desc, testNewReport.desc, "Report description not correct");
        assert.equal(report.tag, testNewReport.tag, "Report tag not correct");
        assert.equal(report.locId, locationId, "Report location id not correct");
    });

    test("Search Report", async() => {
        vi.spyOn(prisma.report, "findMany").mockResolvedValue([testReport]);
        const reports = await prisma.report.findMany({ where: { tag: testReport.tag } });

        assert.isArray(reports, "Reports is not an array");
        assert.equal(reports.length, 1, "Reports length not correct");
        assert.equal(reports[0].name, testReport.name, "Report name not correct");

    });

    test("Delete Report", async() => {
        vi.spyOn(prisma.report, "delete").mockResolvedValue(testReport);
        const report = await prisma.report.delete({ where: { id: reportId } });

        assert.isObject(report, "Report not deleted");
        assert.equal(report.id, reportId, "Report id not correct");
    });

    
});

