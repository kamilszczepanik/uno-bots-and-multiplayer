export interface User {
  id: number;
  username: string;
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
  status: "in progress" | "ended";
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
  players: string[];
  targetScore: number;
  cardsPerPlayer: number;
}

export type IndexedGame = Readonly<
  Omit<Game, ""> & { id: number; status: GameStatus }
>;
export type IndexedGameSpecs = Readonly<
  GameSpecs & { id: number; status: GameStatus }
>;

export type GameStatus = "waiting" | "in progress" | "paused" | "finished";
