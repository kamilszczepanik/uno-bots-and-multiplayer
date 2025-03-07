export interface IGame {
  players: string[];
  targetScore: number;
}

export class Game {
  private _players: string[];

  constructor({
    players = ["a", "b", "c", "d", "e"],
    targetScore = 500,
  }: IGame) {
    this._players = players;
  }

  player(playerNo: number) {
    return this._players[playerNo];
  }

  start() {
    console.log(`${this._players} has started!`);
  }
}
