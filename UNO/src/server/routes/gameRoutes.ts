import express from 'express'
import {
  createGame,
  listGames,
  joinGame,
  startGame,
  deleteGame,
} from '../controllers/gameController'

const router = express.Router()

router.post('/games', createGame)
router.get('/games', listGames)
router.post('/games/:gameId/join', joinGame)
router.post('/games/:gameId/start', startGame)
router.delete('/games/:gameId', deleteGame)

export default router
