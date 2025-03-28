import { createLocation, getCountries, getLocation, LocationResult, normalizeLocation, searchLocation } from '@/model/location';
import {test, assert, expect} from 'vitest';
import { render, screen,fireEvent, waitFor } from '@testing-library/react'
import Navbar from '@/components/Navbar';
import { beforeEach, describe } from 'node:test';
import { vi } from "vitest";
import prisma from '@/lib/db';
import { location } from '@prisma/client';
import { testCity, testCityLocationResult, testNewCity } from '../constants';

vi.mock("@/lib/db");

describe("Location Unit Tests", () => {

    beforeEach(async () => {
        vi.clearAllMocks();
        vi.spyOn(prisma.location, "create").mockResolvedValue(testCity); // Mock result
        const newLoc = await createLocation(testCity.name, "");
    });

    test("Create Location", async () => {
        vi.spyOn(prisma.location, "create").mockResolvedValue(testNewCity)
        const newLoc = await createLocation(testNewCity.name, "");
        assert.isObject(newLoc, "Location not created");

        assert.equal(newLoc.name, testNewCity.name, "Location name not correct");
        assert.equal(newLoc.id, testNewCity.id, "Location id not correct");        
    });

    test("Find Location by Name", async() => {
        vi.spyOn(prisma.location, "findMany").mockResolvedValue([testCity]);
        const res = await searchLocation(testCity.name);

        assert.isArray(res, "Results is not an array");
        assert.deepEqual(res[0], testCityLocationResult, "Location not found")
    });
    
    test("Get Location by ID", async() => {
        vi.spyOn(prisma.location, "findFirst").mockResolvedValue(testCity);
        const res = await getLocation(testCity.id);

        assert.isObject(res, "Location not found");
        assert.equal(res?.name, testCity.name, "Location name not correct");
        assert.equal(res?.id, testCity.id, "Location id not correct");
    });

    test("Delete Location", async() => {
        vi.spyOn(prisma.location, "findFirst").mockResolvedValue(testCity);
        vi.spyOn(prisma.location, "delete").mockResolvedValue(testCity);
        const res = await prisma.location.findFirst({ where: { id: testCity.id } });
        assert.isObject(res, "Location not found");
        const deletedLoc = await prisma.location.delete({ where: { id: testCity.id } });
        assert.equal(deletedLoc?.id, testCity.id, "Location id not correct");
    });

});

