import { GameService, type GameServiceProps } from './../../../services/GameService'
import { Game } from './../../../model/uno'
import { defineStore } from 'pinia'
import type { Hand } from '../../../model/hand'

export const useGameStore = defineStore('game', {
  state: () => ({
    gameInstance: null as Game | null,
    previousHand: null as Hand | null,
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

    setCurrentHandAsPreviousHand() {
      if (this.currentHand) {
        this.previousHand = this.currentHand
      }
    },
  },
})
