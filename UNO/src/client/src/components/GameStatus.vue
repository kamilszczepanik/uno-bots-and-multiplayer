<!-- score, round, turn -->

<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { computed } from 'vue'

const gameStore = useGameStore()
const targetScore = computed(() => gameStore.game?.targetScore)
const currentRound = computed(() => gameStore.game?.currentRound)
const playingDirection = computed(() => gameStore.game?.currentHand()?.playingDirection)
</script>

<template>
  <div class="ml-2">
    <h1 class="text-5xl">UNO</h1>
    <div>
      Round: <span class="font-bold">{{ currentRound }}</span>
    </div>
    <div>
      Target score: <span class="font-bold">{{ targetScore }}</span>
    </div>
    <div class="flex items-center space-x-2">
      <span>Playing direction:</span>
      <div class="flex items-center space-x-1">
        <span class="font-bold">{{ playingDirection }}</span>
        <span
          :class="[
            'transform font-bold transition-transform duration-300',
            playingDirection === 'Clockwise' ? 'rotate-0' : 'rotate-180',
          ]"
        >
          ⟳
        </span>
      </div>
    </div>
  </div>
</template>
