<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { computed } from 'vue'

const gameStore = useGameStore()

function startGame() {
  gameStore.initializeGame()
}

const playerCount = computed(() => gameStore.playerCount)
</script>

<template>
  <main>
    <div>
      <h1>UNO Game Setup</h1>
      <button @click="startGame">Start Game</button>
      <div v-if="playerCount > 0">
        <h2>Number of Players: {{ playerCount }}</h2>
      </div>
    </div>
  </main>
</template>
