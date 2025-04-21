/*
  Warnings:

  - Added the required column `content` to the `discussions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "discussions" ADD COLUMN     "content" VARCHAR(400) NOT NULL;
