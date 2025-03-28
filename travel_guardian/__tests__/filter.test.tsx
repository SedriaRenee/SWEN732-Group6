import { describe } from 'node:test';

import { beforeEach, afterEach, expect } from "vitest";
import { vi } from "vitest";
import {test, assert} from 'vitest';
import { getReports, createReport, searchReport } from '@/model/report';
import { prismaMock } from "./__mocks__/prismaMocks";

describe("Filter Reports", () => {
    let id: number;
    let tag: string;

    beforeEach(async () => {  // Mock Report Creation
        const report = await prismaMock.report.create({
            data: { name: "Los Angelous", desc: "A sinful city.", locId: 3, tag: "HIGH-RISK" },
        });
    });

    afterEach(async () => {
        vi.resetAllMocks();
    });
    
    test("GetFilter", async () => {
        const keyword = "HIGH-RISK";
        const reports = await searchReport(keyword);
        console.log('Generated Query: ', reports);
        expect(reports).toBe(1); // minimum 
    });
});
