import { describe } from 'node:test';

import { beforeEach, afterEach, expect } from "vitest";
import { vi } from "vitest";
import {test} from 'vitest';
import { prismaMock } from "../__mocks__/prismaMocks";

describe("Filter Reports", () => {
    let id: number;
    let tag: string;

    beforeEach(async () => {  // Mock Report Creation
        const report = await prismaMock.report.create({
            data: { name: "Los Angelous", desc: "A sinful city.", locId: 3, tag: "HIGH-RISK" },
        });
        const report2 = await prismaMock.report.create({
            data: { name: "Dukie Land", desc: "Duck headquarters.", locId: 3, tag: "LOW-RISK" },
        });
        const report3 = await prismaMock.report.create( {
            data: {name: "Rockland", desc:" Place full of rocks.", locId: 3, tag:"NO-RISK"},
        });
//        console.log('Mock Reports1:', reportsMock);         // Debugging: Check if reports are added
    });

    afterEach(async () => {
        await prismaMock.report.delete({where :{id:1}});
        await prismaMock.report.delete({where :{id:2}});
        await prismaMock.report.delete({where: {id:3}});        
        vi.resetAllMocks();
    });
    
    test("GetFilter NO RISK", async () => {
        const keyword = "NO-RISK";
        const reports = await prismaMock.report.findManyTag({ where: { tag: keyword } });
        console.log('Generated Query: ', reports);
        expect(reports).not.toBeNull();
        expect(reports).not.toBeUndefined();
        expect(reports.length).toBeGreaterThanOrEqual(1);
    });

    test("GetFilter LOW RISK", async () => {
        const keyword = "LOW-RISK";
        const reports = await prismaMock.report.findManyTag({ where: { tag: keyword } });
        console.log('Generated Query 4 LOW RISK: ', reports);
        expect(reports).not.toBeNull();
        expect(reports).not.toBeUndefined();
        expect(reports.length).toBeGreaterThanOrEqual(1);
    });

    test("GetFilter HIGH RISK", async () => {
        const keyword = "HIGH-RISK";
        const reports = await prismaMock.report.findManyTag({where: {tag:keyword}});
        console.log('Generated Query: ', reports);
        expect(reports).toHaveLength(1); // minimum 
    });

});
