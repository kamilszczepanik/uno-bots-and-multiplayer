import { WebSocket } from 'ws'
import type { IndexedGame, IndexedGameSpecs } from '../shared/types'

const ws = new WebSocket('ws://localhost:9090/publish')

export function broadcast(game: IndexedGameSpecs | IndexedGame): void {
  ws.send(JSON.stringify({ type: 'send', message: game }))
}

export default ws
