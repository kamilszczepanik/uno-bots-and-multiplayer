<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { shuffleBuilder } from '../../../../__test__/utils/shuffling'
import type { Props } from '../../../model/uno'
import { standardRandomizer } from '../../../utils/random_utils'
import DrawPile from '@/components/DrawPile.vue'
import DiscardPile from '@/components/DiscardPile.vue'

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
const playerCount = computed(() => gameStore.currentHand?.playerCount)
const discardPile = computed(() => gameStore.currentHand?.discardPile())
const drawPile = computed(() => gameStore.currentHand?.drawPile())

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
  <div class="w-full h-screen flex flex-col justify-between items-center mx-auto p-2">
    <div>
      <h1 class="text-7xl text-center">UNO Game</h1>
      <h2 class="text-2xl text-center font-semibold mb-6">Number of Players: {{ playerCount }}</h2>
    </div>
    <div class="flex">
      <DiscardPile :discardPile="discardPile" />
      <DrawPile :drawPile="drawPile" />
    </div>
    <div>Player hand</div>
  </div>
</template>
