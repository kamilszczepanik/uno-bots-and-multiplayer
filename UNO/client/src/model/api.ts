import axiosInstance from '@/utils/axiosInstance'
import type { IndexedGame, IndexedGameSpecs, User } from '../../../shared/types'
import { showMessage } from '@/utils/helpers'

const headers = { Accept: 'application/json', 'Content-Type': 'application/json' }

async function get(url: string): Promise<unknown> {
  try {
    const response = await axiosInstance.get(url, { headers })
    return response.data
  } catch (error) {
    console.error(`GET ${url} failed:`, error)
    throw error
  }
}

async function post(url: string, body: object = {}): Promise<unknown> {
  try {
    const response = await axiosInstance.post(url, body, { headers })
    return response.data
  } catch (error) {
    console.error(`POST ${url} failed:`, error)
    throw error
  }
}

export async function games(): Promise<IndexedGame[]> {
  const response = await get('/api/games')
  return response as IndexedGame[]
}

export async function game(gameId: string): Promise<IndexedGame> {
  const response = await get(`/api/games/${gameId}`)
  return response as IndexedGame
}

export async function join(game: IndexedGameSpecs, player: User) {
  return post(`/api/games/${game.id}/join`, { userId: player.id })
    .then(() => {
      showMessage(`You have joined the game ${game.name}`)
    })
    .catch((error) => {
      console.error(error)
      showMessage('Failed to join game')
    })
}

export async function start(game: IndexedGameSpecs) {
  return post(`/api/games/${game.id}/start`)
    .then(() => {
      showMessage(`You have started the game ${game.name}`)
    })
    .catch((error) => {
      console.error(error)
      showMessage('Failed to start game')
    })
}

export async function pause(game: IndexedGameSpecs) {
  return post(`/api/games/${game.id}/pause`)
    .then(() => {
      showMessage(`You have paused the game ${game.name}`)
    })
    .catch((error) => {
      console.error(error)
      showMessage('Failed to pause the game' + game.name)
    })
}

export async function resume(game: IndexedGameSpecs) {
  return post(`/api/games/${game.id}/resume`)
    .then(() => {
      showMessage(`You have resume the game ${game.name}`)
    })
    .catch((error) => {
      console.error(error)
      showMessage('Failed to resume the game' + game.name)
    })
}

export async function leave(game: IndexedGameSpecs, player: User) {
  return post(`/api/games/${game.id}/leave`, { userId: player.id })
    .then(() => {
      showMessage('You have left the game ' + game.name)
    })
    .catch((error) => {
      console.error(error)
      showMessage('Failed to left the game')
    })
}
// todo: handle game actions
// async function perform_action(game: IndexedYahtzee, action: any) {
//   return post(`http://localhost:8080/games/${game.id}/actions`, action)
// }

// export async function reroll(game: IndexedYahtzee, held: number[], player: string) {
//   return perform_action(game, { type: 'reroll', held, player })
// }

// export async function register(
//   game: IndexedYahtzee,
//   slot: DieValue | LowerSectionKey,
//   player: string,
// ) {
//   return perform_action(game, { type: 'register', slot, player })
// }
