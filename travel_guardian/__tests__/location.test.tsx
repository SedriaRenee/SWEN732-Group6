import { getCountries, getLocation, normalizeLocation, searchLocation } from '@/model/location';
import {test, assert, expect} from 'vitest';
import { render, screen,fireEvent, waitFor } from '@testing-library/react'
import Navbar from '@/components/Navbar';
import { describe } from 'node:test';
import { getPrisma } from '@/lib/db';
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

describe("Location", () => {

    // Test to make sure the database is reachable and has the correct amount of locations
    test("Database populated", async () => {
        const db = await getPrisma();
        const locations = await db.location.count();
        assert(locations > 0, "No locations in database");
        assert(locations > 50000, "Locations not populated");    
    });

    // Make sure countries are correctly loaded
    test("Get countries", async () => {
        const countries = await getCountries();
        assert.isArray(countries, "Countries is not an array");
        assert(countries.length > 0, "Countries is empty");
        assert(countries[0].type == "country", "First item is not a country");
        assert.lengthOf(countries, 242, "Number of countries is not 242");
    });

    // Search for a location by name directly with the server-side function, result is list containing location
    test("Find Rochester", async () => {

        const roc = "Rochester";
        const state = "New York";
    
        const loc = await searchLocation(roc);
    
        assert.isArray(loc, "Location search result is not an array");
        assert(loc.length > 0, "Location search result is empty");
        const first = loc[0];
        assert(first.name == roc, "First location is not Rochester");
        
        // Find correct Rochester
        let found = false;
        for (const l of loc) {
            if (l.name == roc && l.parentName == state) {
                found = true;
                break;
            }
        }
        assert(found, "Rochester, NY not found");
    });
    
    // Search for a location by name directly with the server-side function, location present in result list
    test("Find New York City", async () => {
        const ny = "New York";
        const loc = await searchLocation(ny);
        
        let found = false;
        for (const l of loc) {
            if (l.name == ny && l.type == "city") {
                found = true;
                break;
            }
        }
        assert(found, "New York City not found");
    });

    // Find location by searching through parent
    test("Find child location through parent", async () => {
        const makedonia = await getLocation(1519);
        const target = "thessaloniki";
        let found = false;

        if (!makedonia) {
            assert.fail("Parent location not found");
        }

        for (const child of makedonia.children) {
            const normalized = await normalizeLocation(child.name);
            if (normalized == target) {
                found = true;
                break;
            }
        }

        assert(found, "Child location not found");
    });

    // Find location by searching through child
    test("Find parent location through child", async () => {
        const loc = await getLocation(1520);
        const target = "greece";
        let found = false;
        
        if (loc && loc.parent && loc.parent.parentId) {
            const grandparent = await getLocation(loc.parent.parentId);
            if (!grandparent) {
                assert.fail("Grandparent location not found");
            }
            const normalized = await normalizeLocation(grandparent.name);
            if (normalized == target) {
                found = true;
            }
        }

        assert(found, "Grandparent location not found");
    });

    // Test view component for location searching
    test('Navbar location search', async () => {
        render(<Navbar />);
        const search = screen.getByTestId('search');
        const user = userEvent.setup();
    
        await user.type(search, "New York");
        
        const form = search.parentElement as HTMLFormElement;
        const button = search.nextSibling as HTMLButtonElement;
    
        const submitSpy = vi.fn();
        form.addEventListener("submit", submitSpy);
        
        await user.click(button);
    
        expect(submitSpy).toHaveBeenCalled();
    
        const results = await waitFor(() => screen.getAllByTestId('location'));
        expect(results).toBeDefined();
        expect(results.length).toBeGreaterThan(1); // 2
    
    });
    
});

