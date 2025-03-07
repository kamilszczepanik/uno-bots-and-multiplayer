export interface Player {
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
  status: "waiting" | "paused" | "in progress" | "finished";
  targetScore: number;
  cardsPerPlayer: number;
  currentRound: number;
  players: Player[];
  hands: Hand[];
  scores: Record<number, number>;
}
