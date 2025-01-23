<script setup lang="ts">
import { computed } from 'vue'
import GameCard from './GameCard.vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
const newColor = computed(() => currentHand.value?.newColor)
const currentHand = computed(() => gameStore.game?.currentHand())
const topCard = computed(() => currentHand.value?.discardPile().top())
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
