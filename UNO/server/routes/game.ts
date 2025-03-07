import { gameManager } from './../services/GameManager'
import { Request, Response, Router } from 'express'

import prisma from '../utils/db.server'
import { broadcast } from '../websocket'
import { Action, GameStatus } from '../../shared/types'

const router = Router()

router.get('/games', async (req: Request, res: Response) => {
  try {
    const games = await prisma.game.findMany({
      include: { players: true, hands: true },
      orderBy: { createdAt: 'desc' },
    })

    res.json(games)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch games' })
  }
})

router.get('/games/:gameId', async (req: Request, res: Response) => {
  const { gameId } = req.params

  try {
    const game = await prisma.game.findUniqueOrThrow({
      where: { id: gameId },
      include: {
        players: {
          select: {
            id: true,
            username: true,
          },
        },
        hands: true,
      },
    })

    if (!game) {
      res.status(404).json({ error: `Game ${gameId} not found` })
      return
    }

    res.json(game)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: `Failed to fetch game ${gameId}` })
  }
})

router.post('/games', async (req: Request, res: Response) => {
  const { name, creatorId, targetScore, cardsPerPlayer } = req.body
  if (!name || !creatorId) {
    res.status(400).json({ error: 'Name and creatorId are required' })
    return
  }

  try {
    const game = await prisma.game.create({
      data: {
        name,
        targetScore,
        cardsPerPlayer,
        currentRound: 1,
        status: 'waiting',
        scores: {},
        players: {
          connect: { id: creatorId },
        },
      },
      select: {
        id: true,
        name: true,
        targetScore: true,
        cardsPerPlayer: true,
        status: true,
        players: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    const formattedGame = {
      ...game,
      status: game.status as GameStatus,
    }

    broadcast(formattedGame)
    res.status(201).json(game)
    return
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create game' })
    return
  }
})

router.post('/games/:gameId/join', async (req, res) => {
  const { gameId } = req.params
  const { userId } = req.body

  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { players: true },
    })

    if (!game || game.status !== 'waiting') {
      res.status(400).json({ error: 'Game is not available for joining' })
      return
    }

    if (game.players.length >= 3) {
      res.status(400).json({ error: 'Game is full' })
      return
    }

    if (game.players.some((user) => user.id === userId)) {
      res.status(400).json({ error: 'User is already in the game' })
      return
    }

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        players: {
          connect: { id: userId },
        },
      },
      include: { players: true },
    })

    const formattedGame = {
      ...updatedGame,
      status: updatedGame.status as GameStatus,
    }

    broadcast(formattedGame)
    res
      .status(200)
      .json({ message: 'Joined the game successfully', game: formattedGame })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to join game' })
  }
})

router.post('/games/:gameId/start', async (req: Request, res: Response) => {
  const { gameId } = req.params

  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { players: true },
    })

    if (!game || game.status !== 'waiting') {
      res.status(400).json({ error: 'Game is not available to start' })
      return
    }

    if (game.players.length < 2) {
      res.status(400).json({ error: 'Not enough players to start the game' })
      return
    }

    const playersForSetup = game.players.map(({ id, username }) => ({
      id,
      username,
    }))

    const { dbGame, dbHands } = await gameManager.startGame({
      id: gameId,
      name: game.name,
      targetScore: game.targetScore,
      cardsPerPlayer: game.cardsPerPlayer,
      status: game.status,
      players: playersForSetup,
    })

    const formattedGame = {
      ...dbGame,
      hands: dbHands,
      status: dbGame.status as GameStatus,
    }

    broadcast(formattedGame)
    res.status(200).json({ message: 'Game started', game: formattedGame })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to start game' })
  }
})

router.post('/games/:gameId/pause', async (req: Request, res: Response) => {
  const { gameId } = req.params

  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      select: { id: true },
    })

    if (!game) {
      res.status(404).json({ error: 'Game not found' })
      return
    }

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        status: 'paused',
      },
      select: {
        id: true,
        name: true,
        targetScore: true,
        cardsPerPlayer: true,
        status: true,
        players: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    const formattedGame = {
      ...updatedGame,
      status: updatedGame.status as GameStatus,
    }

    broadcast(formattedGame)
    res.status(200).json({ message: 'Game paused', game: formattedGame })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to pause game' })
  }
})

router.post('/games/:gameId/resume', async (req: Request, res: Response) => {
  const { gameId } = req.params

  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      select: { id: true },
    })

    if (!game) {
      res.status(404).json({ error: 'Game not found' })
      return
    }

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        status: 'in_progress',
      },
      select: {
        id: true,
        name: true,
        targetScore: true,
        cardsPerPlayer: true,
        status: true,
        players: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    const formattedGame = {
      ...updatedGame,
      status: updatedGame.status as GameStatus,
    }

    broadcast(formattedGame)
    res.status(200).json({ message: 'Game resumed', game: formattedGame })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to resume game' })
  }
})

router.post('/games/:gameId/leave', async (req: Request, res: Response) => {
  const { gameId } = req.params
  const { userId } = req.body

  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      select: { players: true, name: true },
    })

    if (!game) {
      res.status(404).json({ error: 'Game not found' })
      return
    }

    if (!game.players.some((user) => user.id === userId)) {
      res.status(400).json({ error: 'User is not in the game' })
      return
    }

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        players: {
          disconnect: { id: userId },
        },
      },
      select: {
        id: true,
        name: true,
        targetScore: true,
        cardsPerPlayer: true,
        status: true,
        players: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    })

    if (updatedGame.players.length === 0) {
      await prisma.game.delete({
        where: { id: updatedGame.id },
      })
      res.json({
        message: `You have left the game ${game.name} and the game has been deleted, since there was no other players.`,
      })
    } else {
      res.json({ message: `You have left the game ${game.name}` })
    }

    const formattedGame = {
      ...updatedGame,
      status: updatedGame.status as GameStatus,
    }

    broadcast(formattedGame)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to leave game' })
  }
})

router.delete('/games/:gameId', async (req: Request, res: Response) => {
  const { gameId } = req.params

  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { players: true },
    })

    if (!game) {
      res.status(404).json({ error: 'Game not found' })
      return
    }

    if (game.players.length > 1) {
      res
        .status(400)
        .json({ error: 'Cannot delete a game with more than one player' })
      return
    }

    await prisma.game.delete({
      where: { id: gameId },
    })

    res.json({ message: 'Game deleted' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to delete game' })
  }
})

export async function resolveAction(action: Action) {
  const gameInstance = await gameManager.getGame(action.gameId)

  if (!gameInstance) {
    throw new Error('Game not found')
  }

  switch (action.type) {
    case 'draw': {
      gameInstance.currentHand()?.draw()
      break
    }
    case 'play': {
      gameInstance.currentHand()?.play(action.cardIndex, action.color)
      break
    }
    default:
      throw new Error('Invalid action')
  }

  const updatedGame = await gameManager.saveGame({
    gameInstance,
    gameId: action.gameId,
    handId: action.handId,
  })

  broadcast(updatedGame)

  return updatedGame
}
interface TypedRequest<BodyType> extends Request {
  body: BodyType
}

type Body = Action & { gameId: string; handId: string }

router.post(
  '/games/:id/actions',
  async (req: TypedRequest<Body>, res: Response) => {
    try {
      const game = resolveAction(req.body)
      res.send(game)
    } catch (error: unknown) {
      console.error(error)
    }
  },
)

export default router
