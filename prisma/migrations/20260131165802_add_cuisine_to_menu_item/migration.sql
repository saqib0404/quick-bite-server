/*
  Warnings:

  - Added the required column `cuisine` to the `MenuItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CuisineType" AS ENUM ('MEAT', 'FISH', 'VEG', 'VEGAN');

-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "cuisine" "CuisineType" NOT NULL;
