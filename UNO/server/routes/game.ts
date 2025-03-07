import { Request, Response, Router } from 'express'

import { setupGame } from '../services/gameService'
import prisma from '../utils/db.server'

const router = Router()

router.get('/games', async (req: Request, res: Response) => {
  try {
    const games = await prisma.game.findMany({
      include: { players: true },
      orderBy: { createdAt: 'desc' },
    })
    console.log(games)

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
        hands: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        players: true,
      },
    })

    if (!game) {
      res.status(404).json({ error: `Game ${gameId} not found` })
      return
    }

    const currentHand = game.hands.length > 0 ? game.hands[0] : null

    res.json({ game, currentHand })
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
      include: { players: true },
    })

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
      console.log(game)
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

    res.json(updatedGame)
    return
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to join game' })
    return
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

    await setupGame({
      gameId,
      name: game.name,
      targetScore: game.targetScore,
      cardsPerPlayer: game.cardsPerPlayer,
      status: game.status,
      currentRound: game.currentRound,
      playerIds: game.players.map((player) => player.id),
    })

    res.json({ message: 'Game started' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to start game' })
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
        players: true,
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

export default router
