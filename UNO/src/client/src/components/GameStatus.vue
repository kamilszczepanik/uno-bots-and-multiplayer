<!-- score, round, turn -->

<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { computed } from 'vue'

const gameStore = useGameStore()
const name = computed(() => gameStore.game?.name)
const targetScore = computed(() => gameStore.game?.targetScore)
const cardsPerPlayer = computed(() => gameStore.game?.cardsPerPlayer)
console.log(gameStore.game)
// const currentRound = computed(() => gameStore.game?.currentRound)
// const playingDirection = computed(() => gameStore.game?.currentHand()?.playingDirection)
</script>

<template>
  <div class="ml-2">
    <h1 class="text-5xl">UNO</h1>
    <div>
      <!-- Round: <span class="font-bold">{{ currentRound }}</span> -->
    </div>
    <p>
      Game name: <span class="font-bold">{{ name }}</span>
    </p>
    <p>
      Target score: <span class="font-bold">{{ targetScore }}</span>
    </p>
    <p>
      Cards per player: <span class="font-bold">{{ cardsPerPlayer }}</span>
    </p>
    <div class="flex items-center space-x-2">
      <span>Playing direction:</span>
      <div class="flex items-center space-x-1">
        <!-- <span class="font-bold">{{ playingDirection }}</span> -->
        <!-- <span
          :class="[
            'transform font-bold transition-transform duration-300',
            playingDirection === 'Clockwise' ? 'rotate-0' : 'rotate-180',
          ]"
        >
          ⟳
        </span> -->
      </div>
    </div>
  </div>
</template>
