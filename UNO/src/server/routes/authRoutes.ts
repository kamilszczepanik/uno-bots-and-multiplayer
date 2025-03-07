import express from 'express'
import { registerUser, loginUser } from '../services/authService'

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

export default router
