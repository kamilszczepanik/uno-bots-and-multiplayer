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

  constructor({
    players = ["A", "B", "C", "D"],
    dealer = 0,
    shuffler: standardShuffler,
  }: Props) {
    this._players = players;
    this._score = 0;
    this._ended = false;
    this._dealer = dealer;
  }

  draw() {}

  play(cardNumber: number) {
    console.log("Playing card", cardNumber); // todo: implement this
    this._ended = true;
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

  get dealer() {
    return this._dealer;
  }
}

export function createHand(props: Partial<Props>): Hand {
  const defaultProps: Props = {
    players: ["A", "B"],
    dealer: 500,
    shuffler: standardShuffler,
    cardsPerPlayer: 7,
  };

  const mergedProps = { ...defaultProps, ...props };
  return new Hand(mergedProps);
}
