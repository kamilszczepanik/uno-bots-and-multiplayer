import { handleGameAction, showMessage } from "../client/src/utils/helpers";
import { colors } from "../model/deck";
import { Hand } from "../model/hand";
import { Game } from "../model/uno";

const CHANCE_TO_CATCH_UNO_FAILURE = Math.random() < 0.33;
const CHANCE_TO_SAY_UNO = Math.random() < 0.4;
const DELAY_TO_SAY_UNO_MS = 2000;
const DELAY_TO_ATTEMPT_CATCH_MS = 2000;
export const DELAY_TO_MAKE_MOVE_MS = 2000;

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
        await this.wait(DELAY_TO_MAKE_MOVE_MS);
        playableIndex = newCardIndex;
      } else {
        return;
      }
    }

    if (botHand.length === 2) {
      this.maybeSayUno(currentHand, botIndex, botName);
    }

    const lastPlayerIndex = currentHand.lastPlayerIndex;

    if (lastPlayerIndex !== undefined) {
      const lastPlayerHand = currentHand.playerHand(lastPlayerIndex);
      const lastPlayerFailedToSayUno =
        lastPlayerHand.length === 1 &&
        !currentHand.playersThatSaidUno.has(lastPlayerIndex);

      if (lastPlayerFailedToSayUno) {
        await this.maybeAttemptCatchUnoFailures({
          currentHand,
          accuser: botIndex,
          accused: lastPlayerIndex,
        });
      }
    }

    const cardToPlay = botHand[playableIndex];

    if (cardToPlay.type === "WILD" || cardToPlay.type === "WILD DRAW") {
      currentHand.play(playableIndex, this.getRandomColor());
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
    if (CHANCE_TO_SAY_UNO) {
      this.wait(DELAY_TO_SAY_UNO_MS);
      handleGameAction(() => currentHand.sayUno(botIndex), {
        successMessage: `${botName} said UNO!`,
      });
    }
  },

  async maybeAttemptCatchUnoFailures({
    currentHand,
    accuser,
    accused,
  }: {
    currentHand: Hand;
    accuser: number;
    accused: number;
  }) {
    if (CHANCE_TO_CATCH_UNO_FAILURE) {
      await this.wait(DELAY_TO_ATTEMPT_CATCH_MS);
      const players = currentHand.players;
      const success = currentHand.catchUnoFailure({ accuser, accused });

      if (success) {
        showMessage(
          `${players[accuser]} successfully caught ${players[accused]}'s UNO failure!`
        );
      } else {
        showMessage(
          `${players[accuser]} failed to catch ${players[accused]}'s UNO failure.`
        );
      }
    }
  },
};

export default BotService;
