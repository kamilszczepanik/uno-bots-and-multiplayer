import {
  Randomizer,
  Shuffler,
  standardRandomizer,
  standardShuffler,
} from "./../utils/random_utils";
import { Card } from "./deck";
import { Hand } from "./hand";

export interface Props {
  players: string[];
  targetScore: number;
  randomizer: Randomizer;
  shuffler: Shuffler<Card>;
  cardsPerPlayer: number;
}

export class Game {
  private _players: string[];
  private _targetScore: number;
  private _scores: Map<number, number>;
  private _winner: string | undefined;
  private _currentHand: Hand;

  constructor({
    players,
    targetScore,
    randomizer = standardRandomizer,
    shuffler = standardShuffler,
    cardsPerPlayer,
  }: Props) {
    if (players.length < 2 || players.length > 10)
      throw new Error(
        "A game requires at least 2 players and allows at most 10 players."
      );
    if (targetScore <= 0)
      throw new Error("A game requires more than 0 target score.");

    const dealer = randomizer(players.length);

    if (dealer < 0 || dealer >= players.length) {
      throw new Error("Randomizer returned an invalid dealer index.");
    }

    this._players = players;
    this._targetScore = targetScore;
    this._scores = new Map(players.map((_, i) => [i, 0]));
    this._winner = undefined;
    this._currentHand = new Hand({
      players,
      dealer,
      cardsPerPlayer,
      shuffler,
    });
  }

  get playerCount() {
    return this._players.length;
  }

  get targetScore() {
    return this._targetScore;
  }

  winner() {
    return this._winner;
  }

  player(playerNumber: number) {
    if (playerNumber < 0 || playerNumber > this._players.length - 1)
      throw new Error("Requested player is out of bounds.");
    return this._players[playerNumber];
  }

  score(playerNumber: number) {
    if (!this._scores.has(playerNumber))
      throw new Error("Invalid player number");

    return this._scores.get(playerNumber);
  }

  currentHand() {
    return this._currentHand;
  }
}

export function createGame(props: Partial<Props>): Game {
  const defaultProps: Props = {
    players: ["A", "B"],
    targetScore: 500,
    randomizer: standardRandomizer,
    shuffler: standardShuffler,
  };

  const mergedProps = { ...defaultProps, ...props };
  console.log("mergedProps", mergedProps);
  return new Game(mergedProps);
}
