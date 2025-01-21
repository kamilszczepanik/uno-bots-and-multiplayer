<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { shuffleBuilder } from '../../../../__test__/utils/shuffling'
import type { Props } from '../../../model/uno'
import { standardRandomizer } from '../../../utils/random_utils'
import GameCard from '@/components/GameCard.vue'

const firstShuffle = shuffleBuilder({ players: 4, cardsPerPlayer: 1 })
  .discard()
  .is({ type: 'NUMBERED', color: 'BLUE', number: 8 })
  .hand(0)
  .is({ color: 'GREEN', type: 'DRAW' })
  .hand(1)
  .is({ number: 8 })
  .hand(2)
  .is({ type: 'WILD DRAW' })
  .hand(3)
  .is({ number: 3 })
  .drawPile()
  .is({ color: 'GREEN', number: 5 })
  .build()

const gameStore = useGameStore()
const dealer = computed(() => gameStore.currentHand?.dealer)
const playerCount = computed(() => gameStore.currentHand?.playerCount)
const topCard = computed(() => {
  return gameStore.currentHand?.discardPile()?.top() ?? undefined
})

onMounted(() => {
  const mockProps: Props = {
    players: ['Player One', 'Player Two', 'Player Three', 'Player Four'],
    targetScore: 500,
    randomizer: standardRandomizer,
    shuffler: firstShuffle,
    cardsPerPlayer: 7,
  }

  gameStore.initializeGame(mockProps)
})
</script>

<template>
  <div class="w-96 mx-auto p-2">
    <h1 class="text-7xl text-center">UNO Game</h1>
    <h2 class="text-2xl text-center font-semibold mb-6">Number of Players: {{ playerCount }}</h2>
    <h3 v-if="dealer !== null">Dealer: {{ dealer }}</h3>
    <h3 v-else>Loading dealer...</h3>
    <!-- <DrawPile :drawPile="drawPile" @drawCard="handleDrawCard" /> -->
    <GameCard :card="topCard" />
  </div>
</template>
