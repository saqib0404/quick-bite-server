/*
  Warnings:

  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Provider` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_userId_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_userId_fkey";

-- DropForeignKey
ALTER TABLE "Provider" DROP CONSTRAINT "Provider_userId_fkey";

-- DropForeignKey
ALTER TABLE "Restaurant" DROP CONSTRAINT "Restaurant_providerId_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "addresses" JSONB,
ADD COLUMN     "businessName" TEXT,
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Address";

-- DropTable
DROP TABLE "Customer";

-- DropTable
DROP TABLE "Provider";

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
