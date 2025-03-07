import { Card } from 'models/src/model/deck'
import { createGame } from 'models/src/model/uno'
import prisma from '../utils/db.server'
import { IndexedGameSpecs } from '../../shared/types'

export const setupGame = async ({
  id,
  name,
  targetScore,
  cardsPerPlayer,
  players,
}: IndexedGameSpecs) => {
  const playerIds = players.map(({ id }) => id) as string[]

  const game = createGame({
    players: playerIds,
    targetScore,
    cardsPerPlayer,
  })

  const hand = game.currentHand()

  if (!hand) {
    throw new Error('Failed to initialize the first hand')
  }

  const dbGame = await prisma.game.update({
    where: { id },
    data: {
      id,
      name,
      status: 'in_progress',
      currentRound: 1,
      targetScore,
      cardsPerPlayer,
      scores: Object.fromEntries(game.scores),
      players: {
        connect: playerIds.map((id) => ({ id })),
      },
    },
    select: {
      id: true,
      name: true,
      targetScore: true,
      cardsPerPlayer: true,
      status: true,
      currentRound: true,
      scores: true,
      winner: true,
      winnerId: true,
      players: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  })

  const currentPlayerIndex = hand.playerInTurn()

  if (
    currentPlayerIndex === undefined ||
    currentPlayerIndex < 0 ||
    currentPlayerIndex >= playerIds.length
  ) {
    throw new Error('Current player index is out of range or not set properly.')
  }

  const currentPlayerId = playerIds[currentPlayerIndex]

  const playerHands = JSON.stringify(
    playerIds.reduce(
      (acc, playerId, index) => {
        acc[playerId] = hand.playerHand(index)
        return acc
      },
      {} as Record<string, Card[]>,
    ),
  )

  await prisma.hand.create({
    data: {
      gameId: dbGame.id,
      dealerId: currentPlayerId,
      currentPlayerId: currentPlayerId,
      newColor: hand.newColor ?? 'undefined',
      playersWhoDrewCard: JSON.stringify([...hand.playersThatDrewCard]),
      playersWhoSaidUno: JSON.stringify([...hand.playersThatSaidUno]),
      playingDirection: hand.playingDirection,
      discardPile: JSON.stringify(hand.discardPile()),
      drawPile: JSON.stringify(hand.drawPile()),
      playerHands,
      players: {
        connect: playerIds.map((id) => ({ id })),
      },
    },
  })

  const allHands = await prisma.hand.findMany({
    where: { gameId: dbGame.id },
  })

  const handsMap = allHands.reduce(
    (acc, hand, index) => {
      acc[(index + 1).toString()] = hand
      return acc
    },
    {} as Record<string, (typeof allHands)[number]>,
  )

  return {
    dbGame,
    hands: handsMap,
  }
}
