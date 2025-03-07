/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

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
    "winnerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Game_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Game" ("cardsPerPlayer", "createdAt", "currentRound", "id", "name", "scores", "status", "targetScore", "updatedAt", "winnerId") SELECT "cardsPerPlayer", "createdAt", "currentRound", "id", "name", "scores", "status", "targetScore", "updatedAt", "winnerId" FROM "Game";
DROP TABLE "Game";
ALTER TABLE "new_Game" RENAME TO "Game";
CREATE TABLE "new_Hand" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "currentPlayerId" TEXT NOT NULL,
    "dealerId" TEXT NOT NULL,
    "winnerId" TEXT,
    "playersWhoDrewCard" JSONB NOT NULL,
    "playersWhoSaidUno" JSONB NOT NULL,
    "newColor" TEXT NOT NULL,
    "playingDirection" TEXT NOT NULL DEFAULT 'clockwise',
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "gameId" TEXT NOT NULL,
    "discardPile" JSONB NOT NULL,
    "drawPile" JSONB NOT NULL,
    "playerHands" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Hand_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Hand" ("createdAt", "currentPlayerId", "dealerId", "discardPile", "drawPile", "gameId", "id", "newColor", "playerHands", "playersWhoDrewCard", "playersWhoSaidUno", "playingDirection", "status", "updatedAt", "winnerId") SELECT "createdAt", "currentPlayerId", "dealerId", "discardPile", "drawPile", "gameId", "id", "newColor", "playerHands", "playersWhoDrewCard", "playersWhoSaidUno", "playingDirection", "status", "updatedAt", "winnerId" FROM "Hand";
DROP TABLE "Hand";
ALTER TABLE "new_Hand" RENAME TO "Hand";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "handId" TEXT,
    CONSTRAINT "User_handId_fkey" FOREIGN KEY ("handId") REFERENCES "Hand" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "handId", "id", "password", "updatedAt", "username") SELECT "createdAt", "handId", "id", "password", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE TABLE "new__GameUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_GameUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GameUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__GameUsers" ("A", "B") SELECT "A", "B" FROM "_GameUsers";
DROP TABLE "_GameUsers";
ALTER TABLE "new__GameUsers" RENAME TO "_GameUsers";
CREATE UNIQUE INDEX "_GameUsers_AB_unique" ON "_GameUsers"("A", "B");
CREATE INDEX "_GameUsers_B_index" ON "_GameUsers"("B");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
