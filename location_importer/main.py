import csv
import asyncio
from prisma import Prisma

db = Prisma()

def read_csv(file_path):
    with open(file_path, mode='r') as file:
        csv_reader = csv.reader(file)
        header = next(csv_reader)
        data = [row for row in csv_reader]
    return header, data

async def create_location(name, lat="", lon="", parent=None, type="city"):
    location = await db.location.create(data={"name": name, "lat": lat, "lon": lon, "parentId": parent, "type": type})
    return location.id

countries = {}
states = {}

async def main():
    file_path = './worldcities.csv'

    await db.connect()

    header, data = read_csv(file_path)

    for row in data:
        parent = None
        name = row[0]
        lat = str(row[2])
        lon = str(row[3])
        country = row[4]
        if country not in countries:
            parent = await create_location(country, "", "", parent=None, type="country")
            countries[country] = parent
            print("Created country:", country)
        else:
            parent = countries[country]
        parent_name = row[7]
        if parent_name not in states:
            parent = await create_location(parent_name, "", "", parent=parent, type="state")
            states[parent_name] = parent
            print("Created state:", parent_name, " in ", country)
        else:
            parent = states[parent_name]
        await create_location(name, lat, lon, parent=parent)

    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())