<script setup lang="ts">
import { computed, defineProps } from 'vue'
import GameCard from './GameCard.vue'
import type { DiscardPile } from '../../../model/hand'

const { discardPile } = defineProps({
  discardPile: {
    type: Object as () => DiscardPile,
  },
})
const topCard = computed(() => discardPile?.top())
</script>

<template>
  <div>
    <GameCard :card="topCard" />
  </div>
</template>
