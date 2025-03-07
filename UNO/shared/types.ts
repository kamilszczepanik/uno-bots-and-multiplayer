export interface User {
  id: string | null;
  username: string | null;
}

export interface Hand {
  id: string;
  gameId: string;
  dealerId: number;
  currentPlayerId: number;
  newColor: string | null;
  playersWhoDrewCard: number[];
  playersWhoSaidUno: number[];
  playingDirection: "Clockwise" | "counterclockwise";
  discardPile: string;
  drawPile: string;
  status: "in_progress" | "ended";
  playerHands: string;
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
