import { getCountries, searchLocation } from '@/model/location';
import {test, assert} from 'vitest';

test("Find Rochester", async () => {
    const roc = "Rochester";
    const state = "New York";

    const loc = await searchLocation(roc);

    assert.isArray(loc, "Location search result is not an array");
    assert(loc.length > 0, "Location search result is empty");
    const first = loc[0];
    assert(first.name == roc, "First location is not Rochester");
    assert(first.parentName == state, "First location is not in New York");

    assert(loc)
});

test("Find New York City", async () => {
    const ny = "New York";
    const loc = await searchLocation(ny);
    
    let found = false;
    for (let l of loc) {
        if (l.name == ny && l.type == "city") {
            found = true;
            break;
        }
    }
    assert(found, "New York City not found");
});

test("Get Countries", async () => {
    const countries = await getCountries();
    assert.isArray(countries, "Countries is not an array");
    assert(countries.length > 0, "Countries is empty");
    assert(countries[0].type == "country", "First item is not a country");
    assert.lengthOf(countries, 242, "Number of countries is not 242");
});