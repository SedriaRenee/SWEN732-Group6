import { describe } from 'node:test';
import { vi } from "vitest";
import {test, assert} from 'vitest';
import { getReports, createReport } from '@/model/report';
import { searchLocation } from '@/model/location';

test("GetFilter", async () => {
    const newReport = await createReport(
        'Blobi', 
        'A city in Upper State NY.', 
        1, 
        'MEDIUM-RISK'
    );
    const roc = (await searchLocation("Blobi"))[0];
    if (!roc) {
        throw new Error("Location 'City' not found in the database.");
    }
    console.log(roc);
    const reports = await getReports(roc.id);
    const keyword = "HIGH-RISK";
    const query = `SELECT * FROM "report" WHERE "tag" = ${keyword}`;
    console.log('Generated Query: ', reports);
});
