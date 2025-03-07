import { Card } from 'models/src/model/deck'
import { createGame } from 'models/src/model/uno'
import prisma from '../utils/db.server'

interface StartGameProps {
  gameId: string
  name: string
  playerIds: number[]
  targetScore: number
  cardsPerPlayer: number
  currentRound: number
  status: 'waiting' | 'paused' | 'in_progress' | 'finished'
}

export const setupGame = async ({
  gameId,
  targetScore,
  cardsPerPlayer,
  currentRound,
  playerIds,
}: StartGameProps) => {
  const game = createGame({
    players: playerIds.map((id) => id.toString()),
    targetScore,
    cardsPerPlayer,
  })

  const hand = game.currentHand()

  if (!hand) {
    throw new Error('Failed to initialize the first hand')
  }

  const dbGame = await prisma.game.update({
    where: { id: gameId },
    data: {
      id: gameId,
      name: `Game ${gameId}`,
      status: 'in progress',
      targetScore,
      cardsPerPlayer,
      currentRound,
      scores: Object.fromEntries(game.scores),
      players: {
        connect: playerIds.map((id) => ({ id })),
      },
    },
  })

  const currentPlayerId = hand.playerInTurn()

  if (currentPlayerId === undefined) {
    throw new Error(
      'Current player is not set. Ensure the hand is initialized properly.',
    )
  }

  const playerHands = JSON.stringify(
    playerIds.reduce(
      (acc, playerId, index) => {
        acc[playerId] = hand.playerHand(index)
        return acc
      },
      {} as Record<number, Card[]>,
    ),
  )

  const dbHand = await prisma.hand.create({
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

  return { dbGame, dbHand }
}
