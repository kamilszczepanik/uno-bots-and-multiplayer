/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Game` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "scores" JSONB NOT NULL,
    "targetScore" INTEGER NOT NULL,
    "cardsPerPlayer" INTEGER NOT NULL,
    "currentRound" INTEGER NOT NULL,
    "winnerId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Game_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Game" ("cardsPerPlayer", "createdAt", "currentRound", "id", "name", "scores", "status", "targetScore", "updatedAt", "winnerId") SELECT "cardsPerPlayer", "createdAt", "currentRound", "id", "name", "scores", "status", "targetScore", "updatedAt", "winnerId" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
