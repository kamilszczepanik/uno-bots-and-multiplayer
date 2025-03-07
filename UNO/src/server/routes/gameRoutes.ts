import express from 'express'
import {
  createGame,
  listGames,
  joinGame,
  startGame,
  deleteGame,
  leaveGame,
  gameStatus,
} from '../controllers/gameController'

const router = express.Router()

router.post('/games', createGame)
router.get('/games', listGames)
router.get('/games/:gameId', gameStatus)
router.post('/games/:gameId/join', joinGame)
router.post('/games/:gameId/start', startGame)
router.post('/games/:gameId/leave', leaveGame)
router.delete('/games/:gameId', deleteGame)

export default router
