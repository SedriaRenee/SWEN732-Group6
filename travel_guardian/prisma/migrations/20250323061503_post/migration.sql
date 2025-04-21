/*
  Warnings:

  - Added the required column `locationId` to the `discussions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "discussions" ADD COLUMN     "locationId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "discussions" ADD CONSTRAINT "discussions_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
