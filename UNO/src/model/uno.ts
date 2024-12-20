export interface Props {
  players: string[];
  targetScore: number;
}

export class Game {
  private _players: string[];
  private _targetScore: number;
  private _scores: Map<number, number>;
  private _winner: string | undefined;
  private _currentHand: string | undefined;

  constructor({
    players = ["a", "b", "c", "d", "e"], // Probably this constructor is never used, becuase we use createGame() intead
    targetScore = 500,
  }: Props) {
    if (players.length < 2)
      throw new Error("A game requires at least 2 players.");
    if (targetScore <= 0)
      throw new Error("A game requires more than 0 target score.");

    this._players = players;
    this._targetScore = targetScore;
    this._scores = new Map(players.map((_, i) => [i, 0]));
    this._winner = undefined;
    this._currentHand = "A";
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
  };

  const mergedProps = { ...defaultProps, ...props };
  return new Game(mergedProps);
}
