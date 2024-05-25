/*
  Warnings:

  - You are about to drop the column `updateddAt` on the `Update` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Update` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Update" DROP COLUMN "updateddAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
