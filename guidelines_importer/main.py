import json
import re
import requests
import asyncio
from prisma import Prisma



def slugify(name: str) -> str:
    name = name.lower()
    name = re.sub(r"[’']", "", name)
    name = re.sub(r"[^a-z0-9\s-]", "", name)
    name = re.sub(r"\s+", "-", name)
    name = re.sub(r"-+", "-", name)
    return name.strip("-")


def extract_links(text: str):
    """Extract all URLs from the text content"""
    url_pattern = re.compile(r'https?://[^\s<>"]+|www\.[^\s<>"]+')
    return url_pattern.findall(text)


def parse_part_content(part):
    """Parse the HTML content from a part into structured sections."""
    body = part.get("body", "")

    # Extract all links first
    links = extract_links(body)

    # Remove HTML tags and clean up content
    cleaned_content = re.sub(r'<[^>]+>', ' ', body)  # Replace tags with space
    cleaned_content = re.sub(r'\s+', ' ', cleaned_content).strip()

    return {
        "title": part.get("title", "General Information"),
        "content": cleaned_content,
        "links": links  # Removed tags field
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
        print(f"\nProcessing {location.name}...")

        data = await fetch_travel_advice(location_slug)
        if not data:
            print(f"No data found for {location.name}")
            continue

        parts = data.get("details", {}).get("parts", [])
        if not parts:
            print(f"No parts found for {location.name}")
            continue

        location_entry = await db.location.find_first(where={"name": location.name})
        if not location_entry:
            print(f"No matching location in DB for {location.name}")
            continue

        for part in parts:
            guideline_data = parse_part_content(part)

            # Print debug info
            print(f"\nCreating guideline:")
            print(f"Title: {guideline_data['title']}")
            print(f"Content length: {len(guideline_data['content'])} chars")
            print(f"Links: {len(guideline_data['links'])} found")

            await db.guideline.create(
                data={
                    "locId": location_entry.id,
                    "title": guideline_data["title"],
                    "content": guideline_data["content"],
                    "links": guideline_data["links"],
                    "tags":[]
                }
            )
            print("Guideline created successfully")

    await db.disconnect()
    print("\nAll locations processed")


if __name__ == "__main__":
    asyncio.run(main())