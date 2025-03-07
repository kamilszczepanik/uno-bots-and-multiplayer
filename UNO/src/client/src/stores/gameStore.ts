import { GameService, type GameServiceProps } from './../../../services/GameService'
import { Game } from './../../../model/uno'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    gameInstance: null as Game | null,
  }),

  getters: {
    currentHand: (state) => state.gameInstance?.currentHand() ?? null,
  },

  actions: {
    initializeGame(props: GameServiceProps) {
      this.gameInstance = GameService.initializeGame(props)
    },
    endGame() {
      this.gameInstance = null
    },
  },
})
