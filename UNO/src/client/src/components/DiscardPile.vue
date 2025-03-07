<script setup lang="ts">
import { computed } from 'vue'
import GameCard from './GameCard.vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
const topCard = computed(() => gameStore.currentHand?.discardPile().top())
const newColor = computed(() => gameStore.currentHand?.newColor)
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
