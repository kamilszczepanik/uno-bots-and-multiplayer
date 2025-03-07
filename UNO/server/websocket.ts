import { WebSocket } from 'ws'
import type { IndexedGameSpecs } from '../shared/types'

const ws = new WebSocket('ws://localhost:9090/publish')

ws.onopen = () => {
  console.log('Connected to Pub/Sub WebSocket Server')
  ws.send(JSON.stringify({ type: 'subscribe' }))
}

ws.onclose = () => {
  console.log('Disconnected from WebSocket Server')
}

ws.onerror = (error) => {
  console.error('WebSocket Error:', error)
}

ws.onmessage = (message) => {
  console.log('WebSocket Message:', message.data)
}

export function broadcast(game: IndexedGameSpecs): void {
  ws.send(JSON.stringify({ type: 'send', message: game }))
}

export default ws
