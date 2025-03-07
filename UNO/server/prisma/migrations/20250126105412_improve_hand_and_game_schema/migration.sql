/*
  Warnings:

  - Added the required column `currentRound` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scores` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Hand" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "currentPlayerId" INTEGER NOT NULL,
    "lastPlayerId" INTEGER NOT NULL,
    "dealerId" INTEGER NOT NULL,
    "winnerId" INTEGER,
    "playersWhoDrewCard" JSONB NOT NULL,
    "playersWhoSaidUno" JSONB NOT NULL,
    "newColor" TEXT NOT NULL,
    "playingDirection" TEXT NOT NULL DEFAULT 'clockwise',
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "gameId" TEXT NOT NULL,
    "discardPile" JSONB NOT NULL,
    "drawPile" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Hand_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    "creatorId" INTEGER NOT NULL,
    "winnerId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Game_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Game_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Game" ("cardsPerPlayer", "createdAt", "creatorId", "id", "name", "status", "targetScore", "updatedAt") SELECT "cardsPerPlayer", "createdAt", "creatorId", "id", "name", "status", "targetScore", "updatedAt" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "handId" TEXT,
    CONSTRAINT "User_handId_fkey" FOREIGN KEY ("handId") REFERENCES "Hand" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "id", "password", "updatedAt", "username") SELECT "createdAt", "id", "password", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
