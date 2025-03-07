import { Shuffler } from "../utils/random_utils";

export type Color = "BLUE" | "GREEN" | "RED" | "YELLOW";
export type CardType =
  | "NUMBERED"
  | "SKIP"
  | "REVERSE"
  | "DRAW"
  | "WILD"
  | "WILD DRAW";

export interface Card {
  type: CardType;
  color?: Color;
  number?: number;
}

export const colors: Array<Color> = ["BLUE", "GREEN", "RED", "YELLOW"];

export interface Props {
  size: number;
  filter(predicate: (card: Card) => boolean): Props;
  deal(): Card | undefined;
  cards: Card[];
  shuffle(shuffler: Shuffler<Card>): void;
}

class Deck implements Props {
  cards: Card[];

  constructor(cards: Card[]) {
    this.cards = cards;
  }

  get size() {
    return this.cards.length;
  }

  filter(predicate: (card: Card) => boolean): Props {
    return new Deck(this.cards.filter(predicate));
  }

  deal(): Card | undefined {
    return this.cards.shift();
  }

  shuffle(shuffler: Shuffler<Card>): void {
    shuffler(this.cards);
  }
}

export function createInitialDeck(): Props {
  const cards: Array<Card> = [];

  for (const color of colors) {
    // 0: one card
    cards.push({ type: "NUMBERED", color, number: 0 });
    // 1–9: two each
    for (let number = 1; number <= 9; number++) {
      cards.push({ type: "NUMBERED", color, number });
      cards.push({ type: "NUMBERED", color, number });
    }
  }

  // SKIP: 2 per color
  for (const color of colors) {
    cards.push({ type: "SKIP", color });
    cards.push({ type: "SKIP", color });
  }

  // REVERSE: 2 per color
  for (const color of colors) {
    cards.push({ type: "REVERSE", color });
    cards.push({ type: "REVERSE", color });
  }

  // DRAW (Draw Two): 2 per color
  for (const color of colors) {
    cards.push({ type: "DRAW", color });
    cards.push({ type: "DRAW", color });
  }

  // WILD: 4 total
  for (let i = 0; i < 4; i++) {
    cards.push({ type: "WILD" });
  }

  // WILD DRAW (Wild Draw Four): 4 total
  for (let i = 0; i < 4; i++) {
    cards.push({ type: "WILD DRAW" });
  }

  return new Deck(cards);
}
