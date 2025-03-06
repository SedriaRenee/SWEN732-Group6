import {test, assert} from 'vitest';
import { getReports } from '@/model/report';
import { searchLocation } from '@/model/location';

test("Get Reports", async () => {
    const roc = (await searchLocation("Rochester"))[0];
    const reports = await getReports(roc.id);
    assert.isArray(reports, "Reports is not an array");
    assert(reports.length > 0, "Reports is empty");
});