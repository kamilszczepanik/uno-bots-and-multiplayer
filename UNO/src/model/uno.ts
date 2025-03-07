export interface Props {
  players: string[];
  targetScore: number;
}

export class Game {
  private _players: string[];
  private _targetScore: number;
  private _scores: Map<number, number>;

  constructor({
    players = ["a", "b", "c", "d", "e"], // Probably this constructor is never used, becuase we use createGame() intead
    targetScore = 500,
  }: Props) {
    this._players = players;
    this._targetScore = targetScore;
    this._scores = new Map(players.map((_, i) => [i, 0]));
  }

  get playerCount() {
    return this._players.length;
  }
  get targetScore() {
    return this._targetScore;
  }

  player(playerNumber: number) {
    return this._players[playerNumber];
  }

  score(playerNumber: number) {
    if (!this._scores.has(playerNumber))
      throw new Error("Invalid player number");

    return this._scores.get(playerNumber);
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
