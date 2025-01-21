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
  <div :class="`w-32 h-48 rounded-lg shadow-md`">
    <img
      :src="cardImageSrc"
      :alt="`Card ${card?.type ?? 'Deck'}`"
      class="w-full h-full object-cover rounded-lg"
    />
  </div>
</template>
