import { GameService, type GameServiceProps } from './../../../services/GameService'
import { Game } from './../../../model/uno'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    gameInstance: null as Game | null,
    playerCount: 0,
  }),

  actions: {
    initializeGame(props: GameServiceProps) {
      const game = GameService.initializeGame(props)
      this.playerCount = GameService.getPlayerCount(game)
    },
  },
})
