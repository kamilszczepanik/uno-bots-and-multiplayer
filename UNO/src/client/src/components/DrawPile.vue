<script setup lang="ts">
import { computed } from 'vue'
import GameCard from './GameCard.vue'

import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
const drawPile = computed(() => gameStore.gameInstance?.currentHand()?.drawPile())
const currentHand = computed(() => gameStore.currentHand)

const visibleCards = computed(() => {
  if (!drawPile.value) return 0
  return Math.min(drawPile.value.size, 10)
})

const onClick = () => {
  currentHand.value?.draw()
}
</script>

<template>
  <div class="relative">
    <div
      v-for="i in visibleCards"
      :key="i"
      class="card-stack absolute left-0 top-0"
      :style="{ zIndex: i, transform: `translateY(-${i}px)` }"
    >
      <GameCard :showBack="true" @click="onClick" />
    </div>
  </div>
</template>

<style scoped>
.card-stack {
  transition: transform 0.2s ease-in-out;
}
</style>
