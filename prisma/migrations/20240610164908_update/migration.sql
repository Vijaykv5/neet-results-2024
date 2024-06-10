/*
  Warnings:

  - The `pickupTime` column on the `ApplicationNumber` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Application` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "ApplicationNumber" DROP COLUMN "pickupTime",
ADD COLUMN     "pickupTime" TIMESTAMP(3);

-- DropTable
DROP TABLE "Application";

-- CreateTable
CREATE TABLE "Result" (
    "id" SERIAL NOT NULL,
    "day" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "applicationNumber" TEXT NOT NULL,
    "candidateName" TEXT NOT NULL,
    "allIndiaRank" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);
