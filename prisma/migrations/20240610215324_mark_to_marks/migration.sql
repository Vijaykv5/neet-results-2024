/*
  Warnings:

  - You are about to drop the column `mark` on the `Result` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Result" DROP COLUMN "mark",
ADD COLUMN     "marks" TEXT;
