import { Randomizer } from "../utils/random_utils";

export class Hand {
  private _winner: number | undefined;
  private _dealer: number;

  constructor(playerCount: number, randomizer: Randomizer) {
    this._dealer = randomizer(playerCount);
  }

  draw() {}

  get dealer() {
    return this._dealer;
  }
}
