import { Shuffler, standardShuffler } from "../utils/random_utils";
import * as deck from "./deck";

export interface Props {
  dealer: number;
  players: string[];
  cardsPerPlayer: number;
  shuffler: Shuffler<deck.Card>;
}

export class Hand {
  private _winner: number | undefined;
  private _score: number;
  private _ended: boolean;
  private _dealer: number;
  private _players: string[];
  private _deck: deck.Deck;
  private _playerHands: Map<number, deck.Card[]>;
  private _discardPile: DiscardPile;
  private _drawPile: DrawPile;

  constructor({
    players = ["A", "B", "C", "D"],
    dealer = 0,
    shuffler = standardShuffler,
    cardsPerPlayer = 7,
  }: Props) {
    if (players.length < 2 || players.length > 10) {
      throw new Error(
        "A game requires at least 2 players and allows at most 10 players."
      );
    }

    this._players = players;
    this._score = 0;
    this._ended = false;
    this._dealer = dealer;

    this._deck = deck.createInitialDeck();
    this._deck.shuffle(shuffler);

    this._playerHands = new Map(players.map((_, index) => [index, []]));

    for (let i = 0; i < cardsPerPlayer; i++) {
      for (let playerIndex = 0; playerIndex < players.length; playerIndex++) {
        const card = this._deck.deal();
        if (card) {
          this._playerHands.get(playerIndex)!.push(card);
        }
      }
    }

    //todo: implement shuffling if top card is undefined
    const topCard = this._deck.deal();
    if (!topCard) {
      throw new Error("Deck is empty; cannot initialize discard pile.");
    }
    this._discardPile = new DiscardPile([topCard]);
    this._drawPile = new DrawPile(this._deck.cards);
  }

  get dealer() {
    return this._dealer;
  }

  get playerCount() {
    return this._players.length;
  }

  draw() {}

  play(cardNumber: number) {
    console.log("Playing card", cardNumber); // todo: implement this
    this._ended = true;
  }

  player(playerNumber: number) {
    if (playerNumber < 0 || playerNumber >= this._players.length) {
      throw new Error("Requested player is out of bounds.");
    }
    return this._players[playerNumber];
  }

  playerHand(playerNumber: number): deck.Card[] {
    if (playerNumber < 0 || playerNumber >= this._players.length) {
      throw new Error("Requested player is out of bounds.");
    }
    console.log("Player hand", this._playerHands.get(playerNumber));
    return this._playerHands.get(playerNumber)!;
  }

  hasEnded() {
    return this._ended;
  }

  winner() {
    return this._winner;
  }

  score() {
    return this._score;
  }

  discardPile(): DiscardPile {
    return this._discardPile;
  }

  drawPile(): DrawPile {
    return this._drawPile;
  }
}

export function createHand(props: Partial<Props>): Hand {
  const defaultProps: Props = {
    players: ["A", "B"],
    dealer: 0,
    shuffler: standardShuffler,
    cardsPerPlayer: 7,
  };

  const mergedProps = { ...defaultProps, ...props };
  return new Hand(mergedProps);
}

class DiscardPile {
  private _cards: deck.Card[];

  constructor(cards: deck.Card[]) {
    this._cards = cards;
  }

  get size() {
    return this._cards.length;
  }

  top(): deck.Card | undefined {
    return this._cards[this._cards.length - 1];
  }
}

class DrawPile {
  private _cards: deck.Card[];

  constructor(cards: deck.Card[]) {
    this._cards = cards;
  }

  get size() {
    return this._cards.length;
  }

  deal(): deck.Card | undefined {
    return this._cards.shift();
  }
}
