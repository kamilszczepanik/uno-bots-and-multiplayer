import { GameService, type GameServiceProps } from './../../../services/GameService'
import { Game } from './../../../model/uno'
import { defineStore } from 'pinia'

interface GameSettings {
  players: string[]
  targetScore: number
  cardsPerPlayer: number
}

export const useGameStore = defineStore('game', {
  state: () => ({
    gameInstance: null as Game | null,
    gameSettings: null as GameSettings | null,
  }),

  actions: {
    initializeGame(props: GameServiceProps) {
      this.gameInstance = GameService.initializeGame(props)

      // Store settings for restarting later
      this.setGameSettings({
        players: props.players,
        targetScore: props.targetScore,
        cardsPerPlayer: props.cardsPerPlayer,
      })
    },

    setGameSettings(settings: GameSettings | null) {
      this.gameSettings = settings
    },

    clearGameSettings() {
      this.gameSettings = null
    },

    restartGame() {
      if (!this.gameSettings) {
        throw new Error('Game settings are not available to restart the game.')
      }

      // Restart the game using stored settings
      this.initializeGame({
        ...this.gameSettings,
      })
    },

    endGame() {
      this.clearGameSettings()
      this.gameInstance = null
    },
  },
})
