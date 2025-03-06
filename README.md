# SWEN732-Group6

## Travel Guardian: Next.JS App
Contains the frontend and backend for the Travel Guardian web app,
with styling through Tailwind and database through Prisma.

Folder Layout:
- `/app` - Pages (views)
- `/components` - Reusable view elements
- `/lib` - Libraries, currently handles Prisma
- `/model` - Data modeling (through Prisma or custom) and querying
- `/public` - Images and icons for site
- `/__tests__` - Unit tests

#### Setup
Prerequisite: Install postgres database
1. `cd travel_guardian`
2. `npm install`
3. Create an environment file (`.env`) and database connection details:
`DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/DATABASE_NAME?schema=public"`
3. `npx prisma db pull`
4. `npx prisma generate`

##### To Run:
`npm run dev`

##### To Test:
`npm run test`

##### To View Data:
`npx prisma studio`


## Location Importer: Python DB Populator
Populates the database with locations with Python and Prisma.

#### Setup
1. `cd location_importer`
2. `pip3 install -r requirements.txt`
3. Download basic cities CSV export from https://simplemaps.com/data/world-cities and move to folder
4. `prisma db pull`
5. `prisma generate`
6. `python main.py`



Generated site favicon with https://favicon.io/favicon-generator/
