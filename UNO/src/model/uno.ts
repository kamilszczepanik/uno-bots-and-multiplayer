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
  private _winner: number | undefined = undefined;
  private _currentHand: Hand | undefined;
  private _dealer: number;
  private _cardsPerPlayer: number;
  private _currentRound: number = 1;
  private _shuffler: Shuffler<Card>;
  private _previusHand: Hand | undefined;

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

    this._dealer = dealer;
    this._cardsPerPlayer = cardsPerPlayer;
    this._shuffler = shuffler;

    this.startNewHand();
  }

  get playerCount() {
    return this._players.length;
  }

  get targetScore() {
    return this._targetScore;
  }

  get previousHand() {
    return this._previusHand;
  }

  get currentRound() {
    return this._currentRound;
  }

  winner() {
    return this._winner;
  }

  player(playerNumber: number) {
    if (playerNumber < 0 || playerNumber > this._players.length - 1)
      throw new Error("Requested player is out of bounds.");
    return this._players[playerNumber];
  }

  get players() {
    return this._players;
  }

  get scores() {
    return this._scores;
  }

  score(playerNumber: number) {
    if (!this._scores.has(playerNumber))
      throw new Error("Invalid player number");

    return this._scores.get(playerNumber);
  }

  currentHand() {
    return this._currentHand;
  }

  endHand(): void {
    if (!this._currentHand) {
      throw new Error("Cannot end a hand that has not started.");
    }

    if (!this._currentHand.hasEnded()) {
      throw new Error("Cannot end the hand while it is still in progress.");
    }

    const handWinner = this._currentHand.winner();
    const handScore = this._currentHand.score();

    if (handWinner === undefined || handScore === undefined) {
      throw new Error("Cannot update score: Hand has no winner or score.");
    }

    const currentScore = this._scores.get(handWinner) ?? 0;
    this._scores.set(handWinner, currentScore + handScore);

    if (this._scores.get(handWinner)! >= this._targetScore) {
      this._winner = handWinner;
      this._currentHand = undefined;

      return;
    }

    // todo: change dealer for next hand, if needed
    // this._dealer = this.calculateNextDealer(this._dealer);
    this._currentRound++;
    this.startNewHand();
  }

  private calculateNextDealer(currentDealer: number): number {
    return (currentDealer + 1) % this._players.length;
  }

  private startNewHand(): void {
    this._previusHand = this._currentHand;
    this._currentHand = new Hand({
      players: this._players,
      dealer: this._dealer,
      cardsPerPlayer: this._cardsPerPlayer,
      shuffler: this._shuffler,
    });
    this._currentHand.onEnd(() => this.endHand());
  }
}

export function createGame(props: Partial<Props>): Game {
  const defaultProps: Props = {
    players: ["A", "B"],
    targetScore: 500,
    randomizer: standardRandomizer,
    shuffler: standardShuffler,
    cardsPerPlayer: 7,
  };

  const mergedProps = { ...defaultProps, ...props };
  return new Game(mergedProps);
}
