<script setup lang="ts">
import { defineProps } from 'vue'
import GameCard from './GameCard.vue'
import type { Card } from '../../../model/deck'
import PlayerInfo from './PlayerInfo.vue'

const { userHand } = defineProps({
  userHand: {
    type: Object as () => Card[],
  },
})

console.log(userHand)
</script>

<template>
  <div class="flex">
    <PlayerInfo :player-index="0" />
    <div v-for="(card, index) in userHand" :key="index" class="">
      <GameCard :card="card" />
    </div>
  </div>
</template>
