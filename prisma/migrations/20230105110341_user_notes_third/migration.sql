/*
  Warnings:

  - You are about to drop the `UserNotes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserNotes" DROP CONSTRAINT "UserNotes_noteId_fkey";

-- DropForeignKey
ALTER TABLE "UserNotes" DROP CONSTRAINT "UserNotes_userId_fkey";

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserNotes";

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
