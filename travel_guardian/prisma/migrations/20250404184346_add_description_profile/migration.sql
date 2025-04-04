/*
  Warnings:

  - Added the required column `description` to the `profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "profile" ADD COLUMN     "description" VARCHAR(400) NOT NULL;
