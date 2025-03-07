<script setup lang="ts">
import { computed, defineProps } from 'vue'
import type { Card } from '../../../model/deck'
import { getCardImagePath } from '../../../utils/cardMapper'

const { card, showBack } = defineProps({
  card: {
    type: Object as () => Card,
    required: false,
  },
  showBack: {
    type: Boolean,
    default: false,
  },
})

const cardImageSrc = computed(() =>
  showBack
    ? new URL('../assets/cards/Deck.png', import.meta.url).href
    : card
      ? new URL(getCardImagePath(card), import.meta.url).href
      : '',
)
</script>

<template>
  <div :class="`h-44 w-28 rounded-lg shadow-md`">
    <img
      :src="cardImageSrc"
      :alt="`Card ${card?.type ?? 'Deck'}`"
      class="h-full w-full rounded-lg object-cover"
    />
  </div>
</template>
