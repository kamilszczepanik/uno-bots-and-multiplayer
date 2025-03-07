<script setup lang="ts">
import type { IndexedGame } from '../../../shared/types'

defineProps<{
  game: IndexedGame
}>()
</script>

<template>
  <div class="ml-2" v-if="game">
    <h1 class="text-5xl">UNO</h1>
    <p>
      Game name: <span class="font-bold">{{ game.name }}</span>
    </p>
    <p>
      Target score: <span class="font-bold">{{ game.targetScore }}</span>
    </p>
    <p>
      Cards per player: <span class="font-bold">{{ game.cardsPerPlayer }}</span>
    </p>
    <p>
      Round: <span class="font-bold">{{ game.currentRound }}</span>
    </p>
    <div class="flex items-center space-x-2">
      <span>Playing direction:</span>
      <div class="flex items-center space-x-1">
        <!-- todo: fix direction -->
        <!-- <span class="font-bold">{{ game.hands[game.currentRound - 1].playingDirection }}</span>
        <span
          :class="[
            'transform font-bold transition-transform duration-300',
            game.hands[game.currentRound - 1].playingDirection === 'Clockwise'
              ? 'rotate-0'
              : 'rotate-180',
          ]"
        >
          ⟳
        </span> -->
      </div>
    </div>
  </div>
</template>
