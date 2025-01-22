import { handleGameAction, showMessage } from "../client/src/utils/helpers";
import { colors } from "../model/deck";
import { Hand } from "../model/hand";
import { Game } from "../model/uno";

const BotService = {
  async takeTurn(currentHand: Hand | undefined, botIndex: number) {
    if (!currentHand) return;

    const botHand = currentHand.playerHand(botIndex);
    const botName = currentHand.player(botIndex);

    if (!botHand) return;

    let playableIndex = botHand.findIndex((_, index) =>
      currentHand.canPlay(index)
    );

    if (playableIndex === -1) {
      currentHand.draw();

      const newCardIndex = botHand.length - 1;
      if (currentHand.canPlay(newCardIndex)) {
        await this.wait(2000);
        playableIndex = newCardIndex;
      } else {
        return;
      }
    }

    if (botHand.length === 2) {
      this.maybeSayUno(currentHand, botIndex, botName);
    }

    const cardToPlay = botHand[playableIndex];

    if (cardToPlay.type === "WILD" || cardToPlay.type === "WILD DRAW") {
      const randomColor = this.getRandomColor();
      currentHand.play(playableIndex, randomColor);
      showMessage(`${botName} played a wild card and chose ${randomColor}`);
    } else {
      currentHand.play(playableIndex);
    }
  },

  getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  },

  async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  maybeSayUno(currentHand: Hand, botIndex: number, botName: string) {
    const willSayUno = Math.random() < 0.5;

    if (willSayUno) {
      handleGameAction(() => currentHand.sayUno(botIndex), {
        successMessage: `${botName} said UNO!`,
      });
    }
  },
};

export default BotService;
