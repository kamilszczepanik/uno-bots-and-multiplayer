import { shuffleBuilder } from "../../__test__/utils/shuffling";
import { Game, Props, createGame } from "../model/uno";

export type GameServiceProps = Omit<Props, "shuffler" | "randomizer">;

export const GameService = {
  initializeGame(props: GameServiceProps) {
    return createGame(props);
  },

  getPlayerCount(game: Game) {
    return game.playerCount;
  },
};
