<script setup lang="ts">
import { computed } from 'vue'
import GameCard from './GameCard.vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
const topCard = computed(() => gameStore.currentHand?.discardPile().top())
</script>

<template>
  <div>
    <GameCard :card="topCard" />
  </div>
</template>
