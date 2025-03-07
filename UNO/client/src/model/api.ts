import axiosInstance from '@/utils/axiosInstance'
import type { IndexedGame } from '../../../shared/types'

const headers = { Accept: 'application/json', 'Content-Type': 'application/json' }

async function get(url: string): Promise<any> {
  try {
    const response = await axiosInstance.get(url, { headers })
    return response.data
  } catch (error) {
    console.error(`GET ${url} failed:`, error)
    throw error
  }
}

async function post(url: string, body: {} = {}): Promise<any> {
  try {
    const response = await axiosInstance.post(url, body, { headers }) // Pass body correctly
    return response.data
  } catch (error) {
    console.error(`POST ${url} failed:`, error)
    throw error
  }
}

export async function games(): Promise<IndexedGame[]> {
  const response = await get('/api/games')
  return response
}

// export async function join(game: IndexedYahtzeeSpecs, player: string) {
//   return post(`http://localhost:8080/pending-games/${game.id}/players`, { player })
// }

// export async function new_game(
//   number_of_players: number,
//   player: string,
// ): Promise<IndexedYahtzeeSpecs | IndexedYahtzee> {
//   return await post('http://localhost:8080/pending-games', { creator: player, number_of_players })
// }

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
