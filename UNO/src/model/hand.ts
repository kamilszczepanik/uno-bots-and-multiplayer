import { Randomizer, standardRandomizer } from "../utils/random_utils";

export interface Props {
  playerCount: number;
  randomizer: Randomizer;
}

export class Hand {
  private _winner: number | undefined;
  private _score: number;
  private _ended: boolean;
  private _dealer: number;

  constructor({ playerCount = 2, randomizer = standardRandomizer }: Props) {
    this._dealer = randomizer(playerCount);
    this._score = 0;
    this._ended = false;
  }

  draw() {}

  play() {}

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

