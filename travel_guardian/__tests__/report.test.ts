import {test, assert} from 'vitest';
import { getReports } from '@/model/report';
import { searchLocation } from '@/model/location';
import { prismaMock } from './__mocks__/prismaMocks';

test("Get Reports", async () => {
    const roc = (await searchLocation("Rochester"))[0];
    const reports = await prismaMock.report.findMany({where: {locId: roc.id}});
    assert.isArray(reports, "Reports is not an array");
    assert(reports.length == 0, "Reports is not empty");
}); 
