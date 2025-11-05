/*
  Warnings:

  - The `acceptBluecustomerID` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `acceptBluepaymentMethodID` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "acceptBluecustomerID",
ADD COLUMN     "acceptBluecustomerID" INTEGER,
DROP COLUMN "acceptBluepaymentMethodID",
ADD COLUMN     "acceptBluepaymentMethodID" INTEGER;
