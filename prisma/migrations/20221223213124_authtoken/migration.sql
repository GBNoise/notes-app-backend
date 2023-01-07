-- CreateTable
CREATE TABLE "AuthToken" (
    "id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthToken_id_key" ON "AuthToken"("id");
