/*
  Warnings:

  - Made the column `cardsPerPlayer` on table `Game` required. This step will fail if there are existing NULL values in that column.
  - Made the column `targetScore` on table `Game` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "creatorId" INTEGER NOT NULL,
    "targetScore" INTEGER NOT NULL,
    "cardsPerPlayer" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Game_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Game" ("cardsPerPlayer", "createdAt", "creatorId", "id", "name", "status", "targetScore", "updatedAt") SELECT "cardsPerPlayer", "createdAt", "creatorId", "id", "name", "status", "targetScore", "updatedAt" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
