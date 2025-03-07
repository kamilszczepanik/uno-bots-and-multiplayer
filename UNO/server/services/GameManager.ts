import { createGame, Game } from 'models/src/model/uno'

import prisma from '../utils/db.server'
import { GameStatus, IndexedGameSpecs } from '../../shared/types'
import { Card } from 'models/src/model/deck'

class GameManager {
  private games = new Map<string, Game>()

  async startGame({
    id,
    name,
    targetScore,
    cardsPerPlayer,
    players,
  }: IndexedGameSpecs) {
    const playerIds = players.map(({ id }) => id) as string[]

    const game = createGame({
      players: playerIds,
      targetScore,
      cardsPerPlayer,
    })

    const currentHand = game.currentHand()

    if (!currentHand) {
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

    const currentPlayerIndex = currentHand.playerInTurn()

    if (
      currentPlayerIndex === undefined ||
      currentPlayerIndex < 0 ||
      currentPlayerIndex >= playerIds.length
    ) {
      throw new Error(
        'Current player index is out of range or not set properly.',
      )
    }

    const currentPlayerId = playerIds[currentPlayerIndex]

    const playerHands = JSON.stringify(
      playerIds.reduce(
        (acc, playerId, index) => {
          acc[playerId] = currentHand.playerHand(index)
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
        newColor: currentHand.newColor ?? 'undefined',
        playersWhoDrewCard: JSON.stringify([
          ...currentHand.playersThatDrewCard,
        ]),
        playersWhoSaidUno: JSON.stringify([...currentHand.playersThatSaidUno]),
        playingDirection: currentHand.playingDirection,
        discardPile: JSON.stringify(currentHand.discardPile()),
        drawPile: JSON.stringify(currentHand.drawPile()),
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

    this.games.set(dbGame.id, game)

    return {
      dbGame,
      dbHands: handsMap,
      game,
    }
  }

  async getGame(gameId: string): Promise<Game> {
    const game = this.games.get(gameId)
    if (!game) {
      throw new Error(
        `Game ${gameId} not found in memory. It might not have started yet or has been cleared.`,
      )
    }
    return game
  }

  clearGame(gameId: string): void {
    this.games.delete(gameId)
  }

  async saveGame({
    gameInstance,
    gameId,
    handId,
  }: {
    gameInstance: Game
    gameId: string
    handId: string
  }) {
    const dbGame = await prisma.game.findUnique({
      where: { id: gameId },
      include: { players: true, hands: true },
    })

    if (!dbGame) {
      throw new Error('Game not found')
    }

    const playerIds = dbGame.players.map(({ id }) => id) as string[]
    const currentHand = gameInstance.currentHand()

    if (!currentHand) {
      throw new Error('Current hand not found')
    }

    const winnerId = null
    const status: GameStatus = 'in_progress'

    const currentPlayerIndex = currentHand.playerInTurn()

    if (
      currentPlayerIndex === undefined ||
      currentPlayerIndex < 0 ||
      currentPlayerIndex >= playerIds.length
    ) {
      throw new Error(
        'Current player index is out of range or not set properly.',
      )
    }

    const currentPlayerId = playerIds[currentPlayerIndex]

    const playerHands = JSON.stringify(
      playerIds.reduce(
        (acc, playerId, index) => {
          acc[playerId] = currentHand.playerHand(index)
          return acc
        },
        {} as Record<string, Card[]>,
      ),
    )

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        currentRound: gameInstance.currentRound,
        status: status,
        scores: Object.fromEntries(gameInstance.scores),
        winnerId: winnerId,
        hands: {
          update: {
            where: { id: handId },
            data: {
              currentPlayerId,
              newColor: currentHand.newColor,
              discardPile: JSON.stringify(currentHand.discardPile()),
              drawPile: JSON.stringify(currentHand.drawPile()),
              playerHands,
              playingDirection: currentHand.playingDirection as string,
              winnerId: currentHand.winner()?.toString(),
              playersWhoDrewCard: JSON.stringify(
                currentHand.playersThatDrewCard,
              ),
              playersWhoSaidUno: JSON.stringify(currentHand.playersThatSaidUno),
            },
          },
        },
      },
      include: { players: true, hands: true },
    })

    // ✅ Standardize hands format before returning
    const allHands = await prisma.hand.findMany({
      where: { gameId: dbGame.id },
    })

    const handsArray = Object.values(allHands) // ✅ Convert object to array

    return {
      ...updatedGame,
      status: updatedGame.status as GameStatus,
      hands: handsArray, // ✅ Ensure hands is always an array
      players: updatedGame.players,
    }
  }
}

export const gameManager = new GameManager()
