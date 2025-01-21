<script setup lang="ts">
import { computed, defineProps } from 'vue'
import GameCard from './GameCard.vue'
import type { DrawPile } from '../../../model/hand'

const { drawPile } = defineProps({
  drawPile: {
    type: Object as () => DrawPile,
  },
})

const visibleCards = computed(() => {
  if (!drawPile) return 0
  return Math.min(drawPile.size, 10)
})
</script>

<template>
  <div class="relative">
    <div
      v-for="i in visibleCards"
      :key="i"
      class="card-stack absolute left-0 top-0"
      :style="{ zIndex: i, transform: `translateY(-${i}px)` }"
    >
      <GameCard :showBack="true" />
    </div>
  </div>
</template>

<style scoped>
.card-stack {
  transition: transform 0.2s ease-in-out;
}
</style>
