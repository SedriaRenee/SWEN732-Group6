-- CreateTable
CREATE TABLE "location" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "lat" VARCHAR(15) NOT NULL,
    "lon" VARCHAR(15) NOT NULL,
    "type" VARCHAR(15) NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "location" ADD CONSTRAINT "location_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
