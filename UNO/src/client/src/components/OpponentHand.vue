<script setup lang="ts">
import { computed, defineProps } from 'vue'
import GameCard from './GameCard.vue'
import type { Card } from '../../../model/deck'

const { opponentHand, placement } = defineProps({
  opponentHand: {
    type: Array as () => Card[],
    required: false,
  },
  placement: {
    type: String as () => 'top' | 'left' | 'right',
    required: true,
  },
})

const rotation = computed(() => {
  switch (placement) {
    case 'top':
      return 'rotate-0'
    case 'left':
      return 'rotate-90'
    case 'right':
      return '-rotate-90'
    default:
      return ''
  }
})
const spacing = computed(() => {
  if (!opponentHand) {
    return 0
  }

  const defaultSpacing = 200
  const tightSpacing = 100
  const cardCount = opponentHand.length
  const maxSpacing = placement === 'top' ? defaultSpacing : tightSpacing

  return Math.min(100, maxSpacing / cardCount)
})
</script>

<template>
  <div
    :class="`relative flex ${rotation}`"
    :style="placement === 'top' ? 'height: 100px;' : 'width: 100px;'"
  >
    <div
      v-for="(card, index) in opponentHand"
      :key="index"
      :class="`absolute`"
      :style="{
        transform: `translate(${index * spacing}px, ${index * 0}px)`,
      }"
    >
      <GameCard :showBack="true" />
    </div>
  </div>
</template>
