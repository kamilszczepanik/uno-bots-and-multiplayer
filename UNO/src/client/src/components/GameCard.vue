<script setup lang="ts">
import { defineProps } from 'vue'
import type { Card } from '../../../model/deck'

defineProps({
  card: {
    type: Object as () => Card,
  },
})
</script>

<template>
  <div :class="`p-6 rounded-lg shadow-md`">
    <div v-if="!card">Card is loading</div>
    <div v-else>
      <h2 class="text-2xl font-bold mb-4">{{ card?.number }}</h2>
    </div>
  </div>
</template>
