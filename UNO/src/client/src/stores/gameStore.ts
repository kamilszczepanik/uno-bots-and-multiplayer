import { type Hand, type Game } from './../../../shared/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axiosInstance from '@/utils/axiosInstance'

export const useGameStore = defineStore('game', {
  state: () => ({
    allGames: ref<Game[]>([]),
    game: ref<Game>(),
    currentHand: ref<Hand>(),
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
    async fetchGame(gameId: string) {
      this.loading = true
      this.error = null

      try {
        const response = await axiosInstance.get(`/api/games/${gameId}`)
        this.game = response.data.game
        this.currentHand = response.data.currentHand
      } catch (err) {
        this.error = 'Failed to fetch game'
        console.error('Error fetching game:', err)
      } finally {
        this.loading = false
      }
    },
  },
})
