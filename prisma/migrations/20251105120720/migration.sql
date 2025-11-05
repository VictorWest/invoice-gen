/*
  Warnings:

  - The values [ANNUAL] on the enum `PlanStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PlanStatus_new" AS ENUM ('MONTHLY', 'ANNUALLY');
ALTER TABLE "Subscription" ALTER COLUMN "plan" TYPE "PlanStatus_new" USING ("plan"::text::"PlanStatus_new");
ALTER TYPE "PlanStatus" RENAME TO "PlanStatus_old";
ALTER TYPE "PlanStatus_new" RENAME TO "PlanStatus";
DROP TYPE "public"."PlanStatus_old";
COMMIT;
