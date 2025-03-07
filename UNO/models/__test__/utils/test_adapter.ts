import {
  Randomizer,
  Shuffler,
  standardShuffler,
} from "../../src/utils/random_utils";
import * as deck from "models/src/model/deck";
import * as hand from "models/src/model/hand";
import * as uno from "models/src/model/uno";

export function createInitialDeck(): deck.Props {
  return deck.createInitialDeck();
}

export type HandProps = {
  players: string[];
  dealer: number;
  shuffler?: Shuffler<deck.Card>;
  cardsPerPlayer?: number;
};

export function createHand({
  players,
  dealer,
  shuffler = standardShuffler,
  cardsPerPlayer = 7,
}: HandProps): hand.Hand {
  return hand.createHand({ players, dealer, shuffler, cardsPerPlayer });
}

export function createGame(props: Partial<uno.Props>): uno.Game {
  return uno.createGame(props);
}
