import json
import re
import requests
import asyncio
from prisma import Prisma
from datetime import datetime


def slugify(name: str) -> str:
    name = name.lower()
    name = re.sub(r"[’']", "", name)
    name = re.sub(r"[^a-z0-9\s-]", "", name)
    name = re.sub(r"\s+", "-", name)
    name = re.sub(r"-+", "-", name)
    return name.strip("-")


def parse_history_item(note):
    tag_match = re.search(r"\(([^)]+)\)", note)
    tags = []

    if tag_match:
        raw_tags = tag_match.group(1)
        tags = [tag.strip() for tag in raw_tags.replace("’", "'").split(" and ")]
        tags = [t.replace(" page", "").strip("' ") for t in tags]

    main_note = re.sub(r"\s*\([^)]+\)\s*$", "", note).strip()

    title = "General Update"
    if " - " in main_note:
        parts = main_note.split(" - ", 1)
        title = parts[0].strip()
        main_note = parts[1].strip()
    elif ":" in main_note:
        parts = main_note.split(":", 1)
        if len(parts) > 1:
            title_candidate = parts[0].strip()
            title = title_candidate if title_candidate else "General Update"
            main_note = parts[1].strip()

    return {
        "title": title,
        "note": main_note,
        "tags": tags
    }


async def fetch_travel_advice(location_slug: str):

    url = f"https://www.gov.uk/api/content/foreign-travel-advice/{location_slug}"
    response = requests.get(url)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch data for '{location_slug}' (HTTP {response.status_code})")
        return None


async def main():
    db = Prisma()
    await db.connect()

    locations = await db.location.find_many(where={"type": "country"})

    for location in locations:
        location_slug = slugify(location.name)


        print(f"Fetching data for '{location.name}' (slug: {location_slug})")
        data = await fetch_travel_advice(location_slug)

        if data is None:
            print(f" Skipping '{location.name}' - no data found.")
            continue

        data.get("details", {}).get("alert_status", [])
        history = data.get("details", {}).get("change_history", [])


        if not history:
            print(f" Skipping '{location.name}' - no change history found.")
            continue


        location_entry = await db.location.find_first(where={"name": location.name})
        if not location_entry:
            print(f"Skipping '{location.name}' - no matching location in DB.")
            continue


        for entry in history:
            parsed = parse_history_item(entry["note"])
            await db.guideline.create(
                data={
                    "locId": location_entry.id,
                    "title": parsed["title"],
                    "note": parsed["note"],
                    "tags": parsed["tags"],
                    "public_timestamp": datetime.fromisoformat(entry["public_timestamp"].replace("Z", "+00:00")),
                }
            )
            print(f"Inserted guideline: {parsed['title']}")

    await db.disconnect()


# Run the main function
if __name__ == "__main__":
    asyncio.run(main())
