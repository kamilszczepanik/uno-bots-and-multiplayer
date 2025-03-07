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
  private _currentPlayerIndex: number;
  private _startingPlayerIndex: number;
  private _playingDirection: "clockwise" | "counterclockwise";

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
    this._playingDirection = "clockwise";

    this._deck = deck.createInitialDeck();
    this._deck.shuffle(shuffler);
    this._playerHands = new Map(players.map((_, index) => [index, []]));

    for (let playerIndex = 0; playerIndex < players.length; playerIndex++) {
      for (let i = 0; i < cardsPerPlayer; i++) {
        const card = this._deck.deal();
        if (card) {
          this._playerHands.get(playerIndex)!.push(card);
        }
      }
    }

    const initializeDiscardPile = (): DiscardPile => {
      const topCard = this._deck.deal();
      if (!topCard) {
        throw new Error("Deck is empty; cannot initialize discard pile.");
      }

      if (topCard.type === "WILD" || topCard.type === "WILD DRAW") {
        this._deck.cards.push(topCard);
        this._deck.shuffle(shuffler);

        return initializeDiscardPile();
      }

      if (topCard.type === "DRAW") {
        const nextPlayer = (this._dealer + 1) % this._players.length;
        for (let i = 0; i < 2; i++) {
          const card = this._deck.deal();
          if (card) {
            this._playerHands.get(nextPlayer)!.push(card);
          }
        }
      }

      return new DiscardPile([topCard]);
    };

    this._discardPile = initializeDiscardPile();
    this._drawPile = new DrawPile(this._deck.cards);
    this._startingPlayerIndex = this.calculateStartingPlayer();
    this._currentPlayerIndex = this._startingPlayerIndex;
  }

  get dealer() {
    return this._dealer;
  }

  get playerCount() {
    return this._players.length;
  }

  draw() {}

  private getCurrentPlayerHand(): deck.Card[] {
    const playerHand = this._playerHands.get(this._currentPlayerIndex);
    if (!playerHand) {
      throw new Error(`Player ${this._currentPlayerIndex} has no hand.`);
    }
    return playerHand;
  }

  private validateCardIndex(cardIndex: number, playerHand: deck.Card[]): void {
    if (cardIndex < 0 || cardIndex >= playerHand.length) {
      throw new Error(
        `Invalid card index ${cardIndex} for player ${this._currentPlayerIndex}.`
      );
    }
  }

  private isCardPlayable(
    cardToPlay: deck.Card,
    topCard: deck.Card | undefined
  ): boolean {
    return (
      cardToPlay.color === topCard?.color ||
      cardToPlay.number === topCard?.number
    );
  }

  canPlay(cardIndex: number): boolean {
    const playerHand = this.getCurrentPlayerHand();
    this.validateCardIndex(cardIndex, playerHand);

    const cardToPlay = playerHand[cardIndex];
    const topCard = this._discardPile.top();
    return this.isCardPlayable(cardToPlay, topCard);
  }

  play(cardIndex: number): deck.Card {
    const playerHand = this.getCurrentPlayerHand();
    this.validateCardIndex(cardIndex, playerHand);

    if (!this.canPlay(cardIndex)) {
      const cardToPlay = playerHand[cardIndex];
      const topCard = this._discardPile.top();
      throw new Error(
        `Illegal play: card ${JSON.stringify(
          cardToPlay
        )} does not match top card ${JSON.stringify(topCard)}.`
      );
    }

    const cardToPlay = playerHand.splice(cardIndex, 1)[0]; // Remove the card from the hand
    this._discardPile.add(cardToPlay);

    if (cardToPlay.type === "DRAW") {
      const directionModifier = this._playingDirection === "clockwise" ? 1 : -1;
      const nextPlayerIndex =
        (this._currentPlayerIndex + directionModifier + this._players.length) %
        this._players.length;

      for (let i = 0; i < 2; i++) {
        const drawnCard = this._drawPile.deal();
        if (drawnCard) {
          this._playerHands.get(nextPlayerIndex)!.push(drawnCard);
        }
      }
    }

    this._currentPlayerIndex = this.calculateNextPlayer(cardToPlay);

    return cardToPlay;
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

  playerInTurn(): number {
    return this._currentPlayerIndex;
  }

  calculateNextPlayer(cardPlayed: deck.Card): number {
    if (cardPlayed.type === "REVERSE") {
      this._playingDirection =
        this._playingDirection === "clockwise"
          ? "counterclockwise"
          : "clockwise";
    }

    const directionModifier = this._playingDirection === "clockwise" ? 1 : -1;

    const baseNextPlayerIndex =
      (this._currentPlayerIndex + directionModifier + this._players.length) %
      this._players.length;

    return cardPlayed.type === "SKIP" || cardPlayed.type === "DRAW"
      ? (baseNextPlayerIndex + directionModifier + this._players.length) %
          this._players.length
      : baseNextPlayerIndex;
  }

  calculateStartingPlayer(): number {
    const topCard = this._discardPile.top();

    if (!topCard) {
      throw new Error("Discard pile is empty.");
    }

    const directionModifier = this._playingDirection === "clockwise" ? 1 : -1;

    switch (topCard.type) {
      case "REVERSE":
        this._playingDirection =
          this._playingDirection === "clockwise"
            ? "counterclockwise"
            : "clockwise";
        return (
          (this._dealer + directionModifier + this._players.length) %
          this._players.length
        );

      case "SKIP":
        return (
          (this._dealer + 2 * directionModifier + this._players.length) %
          this._players.length
        );

      default:
        return (
          (this._dealer + directionModifier + this._players.length) %
          this._players.length
        );
    }
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
  public cards: deck.Card[];

  constructor(cards: deck.Card[]) {
    this.cards = cards;
  }

  get size() {
    return this.cards.length;
  }

  top(): deck.Card | undefined {
    return this.cards[this.cards.length - 1];
  }

  add(card: deck.Card): void {
    this.cards.push(card);
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
