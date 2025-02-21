# SWEN732-Group6

## Travel Guardian: Next.JS App
Contains the frontend and backend for the Travel Guardian web app,
with database implementation through Prisma.

#### Setup
Prerequisite: Install postgres database
1. `cd travel_guardian`
2. `npm install`
3. Create an environment file (`touch .env`) and your database connection details:
`DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/DATABASE_NAME?schema=public"`
3. `npx prisma migrate dev`
4. `npx prisma generate`
5. `npm run dev`


## Location Importer: Python DB Populator
Populates the database with locations with Python and Prisma.

#### Setup
1. `cd location_importer`
2. `pip3 install -r requirements.txt`
3. Download basic cities CSV export from https://simplemaps.com/data/world-cities and move to folder
4. `prisma migrate dev`
5. `prisma generate`
6. `python main.py`