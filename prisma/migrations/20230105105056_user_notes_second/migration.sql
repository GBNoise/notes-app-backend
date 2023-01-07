/*
  Warnings:

  - Added the required column `content` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateDate` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateDate" TIMESTAMP(3) NOT NULL;
