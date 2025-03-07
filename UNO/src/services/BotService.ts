import { Hand } from "../model/hand";
import { Game } from "../model/uno";

const BotService = {
  takeTurn(currentHand: Hand | undefined, botIndex: number) {
    console.log(botIndex);
    const botHand = currentHand?.playerHand(botIndex);

    if (!currentHand || !botHand) return;

    const playableIndex = botHand.findIndex((_, index) =>
      currentHand.canPlay(index)
    );

    if (playableIndex !== -1) {
      currentHand.play(playableIndex);
    } else {
      currentHand.draw();
    }
  },
};

export default BotService;
