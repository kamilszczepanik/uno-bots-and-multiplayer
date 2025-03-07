export interface User {
  id: string | null;
  username: string | null;
}

export interface Hand {
  id: string;
  dealerId: string;
  currentPlayerId: string;
  newColor: string | undefined;
  playersWhoDrewCard: string[];
  playersWhoSaidUno: string[];
  playingDirection: "Clockwise" | "counterclockwise";
  discardPile: string;
  drawPile: string;
  status: "in_progress" | "ended";
  playerHands: string;
  winnerId: string | null;
}

export interface Game {
  id: string;
  name: string;
  status: GameStatus;
  targetScore: number;
  cardsPerPlayer: number;
  currentRound: number;
  players: User[];
  hands: Hand[];
  scores: Record<number, number>;
}

export interface GameSpecs {
  name: string;
  players: User[];
  targetScore: number;
  cardsPerPlayer: number;
}

export type IndexedGame = Readonly<
  Omit<Game, ""> & { id: string; status: GameStatus }
>;
export type IndexedGameSpecs = Readonly<
  GameSpecs & { id: string; status: GameStatus }
>;

export type GameStatus = "waiting" | "in_progress" | "paused" | "finished";
