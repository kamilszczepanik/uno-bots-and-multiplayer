import prisma from '../utils/db.server'
import { Request, RequestHandler, Response } from 'express'

export const listGames: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const games = await prisma.game.findMany({
      where: { status: 'waiting' },
      include: { users: true },
    })

    res.json(games)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to fetch games' })
  }
}

export const createGame: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  const { name, creatorId, targetScore, cardsPerPlayer } = req.body
  console.log('name', name)
  console.log('creatorId', creatorId)
  if (!name || !creatorId) {
    res.status(400).json({ error: 'Name and creatorId are required' })
    return
  }

  try {
    const game = await prisma.game.create({
      data: {
        name,
        creatorId,
        targetScore,
        cardsPerPlayer,
        users: {
          connect: { id: creatorId },
        },
      },
      include: { users: true },
    })

    res.status(201).json(game)
    return
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to create game' })
    return
  }
}

export const joinGame: RequestHandler = async (req, res) => {
  const { gameId } = req.params
  const { userId } = req.body

  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { users: true },
    })

    if (!game || game.status !== 'waiting') {
      res.status(400).json({ error: 'Game is not available for joining' })
      return
    }

    if (game.users.length >= 3) {
      res.status(400).json({ error: 'Game is full' })
      return
    }

    if (game.users.some((user) => user.id === userId)) {
      res.status(400).json({ error: 'User is already in the game' })
      return
    }

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        users: {
          connect: { id: userId },
        },
      },
      include: { users: true },
    })

    res.json(updatedGame)
    return
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to join game' })
    return
  }
}

export const startGame: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  const { gameId } = req.params

  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { users: true },
    })

    if (!game || game.status !== 'waiting') {
      res.status(400).json({ error: 'Game is not available to start' })
      return
    }

    if (game.users.length < 2) {
      res.status(400).json({ error: 'Not enough players to start the game' })
      return
    }

    await prisma.game.update({
      where: { id: gameId },
      data: { status: 'started' },
    })

    res.json({ message: 'Game started' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to start game' })
  }
}

export const deleteGame: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  const { gameId } = req.params

  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { users: true },
    })

    if (!game) {
      res.status(404).json({ error: 'Game not found' })
      return
    }

    if (game.users.length > 1) {
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
    console.log(error)
    res.status(500).json({ error: 'Failed to delete game' })
  }
}
