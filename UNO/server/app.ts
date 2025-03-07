import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import gameRoutes from './routes/game'
import { WebSocket } from 'ws'

dotenv.config()

function start_server(ws: WebSocket) {
  const gameserver: Application = express()
  gameserver.use(
    cors({
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }),
  )
  gameserver.use(express.json())

  gameserver.use('/api', gameRoutes)
  gameserver.use('/api/auth', authRoutes)

  gameserver.get('/', (req: Request, res: Response) => {
    res.send('UNO Multiplayer Server is running!')
  })

  const PORT: number = 8000
  gameserver.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}

const ws = new WebSocket('ws://localhost:9090/publish')
ws.onopen = (e) => start_server(e.target)
