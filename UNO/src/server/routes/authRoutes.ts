import express from 'express'
import { registerUser, loginUser } from '../services/authService'
import { verifyToken } from '../utils/jwtHelper'
import { JwtPayload } from 'jsonwebtoken'
import prisma from '../utils/db.server'

const router = express.Router()

router.post('/register', async (req, res) => {
  const { username, password } = req.body

  try {
    const newUser = await registerUser(username, password)
    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
    })
  } catch (error) {
    // todo: return specific error message to frontend
    console.error('Error logging in:', error)
    res.status(400).json({ error: 'Error registering user' })
  }
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const result = await loginUser(username, password)
    res.status(200).json(result)
  } catch (error) {
    // todo: return specific error message to frontend
    console.error('Error logging in:', error)
    res.status(400).json({ error: 'Error logging user' })
  }
})

router.get('/user-info', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    const decoded: JwtPayload | string = verifyToken(token) as {
      userId: number
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: decoded.userId },
    })

    res.status(200).json({ id: user.id, username: user.username })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch user info' })
  }
})

export default router
