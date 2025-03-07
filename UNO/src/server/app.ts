import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes'

dotenv.config()

const app: Application = express()
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
)
app.use(express.json())

app.use('/api/auth', authRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send('UNO Multiplayer Server is running!')
})

const PORT: number = 8000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
