-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "Hand_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Hand" ("createdAt", "currentPlayerId", "dealerId", "discardPile", "drawPile", "gameId", "id", "newColor", "playerHands", "playersWhoDrewCard", "playersWhoSaidUno", "playingDirection", "status", "updatedAt", "winnerId") SELECT "createdAt", "currentPlayerId", "dealerId", "discardPile", "drawPile", "gameId", "id", "newColor", "playerHands", "playersWhoDrewCard", "playersWhoSaidUno", "playingDirection", "status", "updatedAt", "winnerId" FROM "Hand";
DROP TABLE "Hand";
ALTER TABLE "new_Hand" RENAME TO "Hand";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
