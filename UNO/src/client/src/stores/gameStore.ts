import { defineStore } from 'pinia'
import { ref } from 'vue'
import axiosInstance from '@/utils/axiosInstance'

interface Game {
  id: string
  name: string
  status: 'waiting' | 'paused' | 'in progress' | 'finished'
  targetScore: number
  cardsPerPlayer: number
  users: { id: number; username: string }[]
}

export const useGameStore = defineStore('game', {
  state: () => ({
    allGames: ref<Game[]>([]),
    loading: ref(false),
    error: ref<string | null>(null),
  }),

  actions: {
    async fetchGames() {
      this.loading = true
      this.error = null

      try {
        const response = await axiosInstance.get('/api/games')
        this.allGames = response.data
      } catch (err) {
        this.error = 'Failed to fetch games'
        console.error('Error fetching games:', err)
      } finally {
        this.loading = false
      }
    },
  },
})
