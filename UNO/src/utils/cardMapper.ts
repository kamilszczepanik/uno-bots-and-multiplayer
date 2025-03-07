import type { Card } from "../model/deck";

export function getCardImagePath(card: Card): string {
  if (card.type === "WILD") {
    return "../assets/cards/Wild.png";
  }

  if (card.type === "WILD DRAW") {
    return "../assets/cards/Wild_Draw.png";
  }

  if (card.type === "NUMBERED" && card.color && card.number !== undefined) {
    return `../assets/cards/${card.color}_${card.number}.png`;
  }

  if (card.color && card.type) {
    return `../assets/cards/${card.color}_${card.type}.png`;
  }

  return "../assets/cards/Unknown.png";
}
