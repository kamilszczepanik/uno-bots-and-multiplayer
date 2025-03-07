<script setup lang="ts">
import { computed } from 'vue'
import GameCard from './GameCard.vue'
import type { IndexedGame } from '../../../shared/types'

const { game } = defineProps<{
  game: IndexedGame
}>()

const currentHand = computed(() => game.hands[game.currentRound - 1])
const discardPile = computed(() => {
  const pile = currentHand.value?.discardPile
  return pile ? JSON.parse(pile).cards : []
})
const topCard = computed(() => {
  return discardPile.value[discardPile.value.length - 1]
})
const newColor = computed(() => currentHand.value.newColor)
</script>

<template>
  <div>
    <GameCard :card="topCard" />
    <p
      :class="
        newColor && topCard && (topCard.type === 'WILD' || topCard.type === 'WILD DRAW')
          ? 'visible'
          : 'invisible'
      "
    >
      New color: <span class="font-bold">{{ newColor || ' ' }}</span>
    </p>
  </div>
</template>
