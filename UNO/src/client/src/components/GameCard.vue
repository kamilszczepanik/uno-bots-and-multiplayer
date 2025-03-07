<script setup lang="ts">
import { computed, defineProps } from 'vue'
import type { Card } from '../../../model/deck'
import { getCardImagePath } from '../../../utils/cardMapper'

const { card } = defineProps({
  card: {
    type: Object as () => Card,
  },
})

const cardImageSrc = computed(() =>
  card
    ? new URL(getCardImagePath(card), import.meta.url).href
    : new URL('../assets/cards/Unknown.png', import.meta.url).href,
)
</script>

<template>
  <div :class="`w-32 h-48 rounded-lg shadow-md`">
    <img
      :src="cardImageSrc"
      :alt="`Card ${card?.type ?? 'Unknown'}`"
      class="w-full h-full object-cover rounded-lg"
    />
  </div>
</template>
