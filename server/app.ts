import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import gameRoutes from './routes/game'

dotenv.config()

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
