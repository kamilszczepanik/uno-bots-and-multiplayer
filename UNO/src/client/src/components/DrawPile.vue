<script setup lang="ts">
import { computed } from 'vue'
import GameCard from './GameCard.vue'

import { useGameStore } from '@/stores/gameStore'
import { USER_INDEX } from '@/utils/constants'
import { handleGameAction, showMessage } from '@/utils/helpers'

const gameStore = useGameStore()
const currentHand = computed(() => gameStore.gameInstance?.currentHand())
const drawPile = computed(() => gameStore.gameInstance?.currentHand()?.drawPile())
const currentPlayerIndex = computed(() => currentHand.value?.playerInTurn())
const userIsCurrentPlayer = computed(() => {
  return currentPlayerIndex.value === USER_INDEX
})

const visibleCards = computed(() => {
  if (!drawPile.value) {
    return 0
  }

  return Math.min(drawPile.value.size, 10)
})

const onClick = () => {
  if (!userIsCurrentPlayer.value) {
    showMessage('Not your turn')
    return
  }

  handleGameAction(() => currentHand.value?.draw())
}
</script>

<template>
  <div class="relative">
    <div
      v-for="i in visibleCards"
      :key="i"
      :class="`card-stack absolute left-0 top-0 ${userIsCurrentPlayer ? 'cursor-pointer' : 'cursor-not-allowed'}`"
      :style="{ zIndex: i, transform: `translateY(-${i}px)` }"
    >
      <GameCard :showBack="true" @click="onClick" class="'hover:scale-105'" />
    </div>
  </div>
</template>

<style scoped>
.card-stack {
  transition: transform 0.2s ease-in-out;
}
</style>
