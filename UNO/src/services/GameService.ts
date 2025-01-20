import { shuffleBuilder } from "../../__test__/utils/shuffling";
import { Game, Props, createGame } from "../model/uno";

const firstShuffle = shuffleBuilder({ players: 4, cardsPerPlayer: 1 })
  .discard()
  .is({ type: "NUMBERED", color: "BLUE", number: 8 })
  .hand(0)
  .is({ color: "GREEN", type: "DRAW" })
  .hand(1)
  .is({ number: 8 })
  .hand(2)
  .is({ type: "WILD DRAW" })
  .hand(3)
  .is({ number: 3 })
  .drawPile()
  .is({ color: "GREEN", number: 5 })
  .build();

export const GameService = {
  initializeGame() {
    const props = {
      players: ["a", "b", "c", "d"],
      targetScore: 200,
      randomizer: () => 3,
      shuffler: firstShuffle,
      cardsPerPlayer: 1,
    };

    const game = createGame(props);
    const hand = game.currentHand()!;

    return game;
  },

  getPlayerCount(game: Game) {
    return game.playerCount;
  },
};
