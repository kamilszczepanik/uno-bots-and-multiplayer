<script setup lang="ts">
import { defineProps } from 'vue'
import GameCard from './GameCard.vue'
import type { DrawPile } from '../../../model/hand'

const { drawPile } = defineProps({
  drawPile: {
    type: Object as () => DrawPile,
  },
})
console.log(drawPile)
</script>

<template>
  <div>
    <GameCard :show-back="true" />
  </div>
</template>
