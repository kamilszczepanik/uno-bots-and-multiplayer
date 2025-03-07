import type { Color } from "models/src/model/deck";

export interface User {
  id: string | null;
  username: string | null;
}

export interface Hand {
  id: string;
  dealerId: string;
  currentPlayerId: string;
  newColor: string | undefined;
  playersWhoDrewCard: string;
  playersWhoSaidUno: string;
  playingDirection: "Clockwise" | "counterclockwise";
  discardPile: string;
  drawPile: string;
  status: GameStatus;
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
  Omit<Game, ""> & {
    id: string;
    status: GameStatus;
    hands: Hand[];
    players: User[];
  }
>;
export type IndexedGameSpecs = Readonly<
  GameSpecs & { id: string; status: GameStatus }
>;

export type GameStatus = "waiting" | "in_progress" | "paused" | "finished";

type RawAction =
  | { type: "draw" }
  | { type: "play"; cardIndex: number; color: Color | undefined };
export type Action = RawAction & { gameId: string; handId: string };
