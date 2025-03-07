import { computed, reactive, type Reactive } from 'vue'
import { defineStore } from 'pinia'
import type { IndexedYahtzee } from '@/model/game'

export const useInProgressGamesStore = defineStore('ongoing games', () => {
  const gameList = reactive<IndexedYahtzee[]>([])
  const games = computed((): Reactive<Readonly<IndexedYahtzee[]>> => gameList)
  const game = (id: number): IndexedYahtzee | undefined => gameList.find((g) => g.id === id)
  const update = (game: IndexedYahtzee) => {
    const index = gameList.findIndex((g) => g.id === game.id)
    if (index > -1) {
      gameList[index] = game
      return game
    }
  }
  const upsert = (game: IndexedYahtzee) => {
    if (gameList.some((g) => g.id === game.id)) {
      update(game)
    } else {
      gameList.push(game)
    }
  }

  const remove = (game: { id: number }) => {
    const index = gameList.findIndex((g) => g.id === game.id)
    if (index > -1) {
      gameList.splice(index, 1)
    }
  }

  return { games, game, update, upsert, remove }
})
