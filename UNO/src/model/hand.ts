import { Randomizer } from "../utils/random_utils";

export class Hand {
  private _ended: boolean;
  private _winner: number | undefined;
  private _score: number;
  private _dealer: number;

  constructor(playerCount: number, randomizer: Randomizer) {
    this._ended = false;
    this._winner = undefined;
    this._score = 0;
    this._dealer = randomizer(playerCount);
  }

  draw() {}

  play(playerIndex: number) {
    this._ended = true;
    this._winner = playerIndex;
    this._score = 78;
  }

  get dealer() {
    return this._dealer;
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
}
