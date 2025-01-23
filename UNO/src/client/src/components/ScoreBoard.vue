<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { computed } from 'vue'

const gameStore = useGameStore()

const scores = computed(() =>
  gameStore.gameInstance?.players.map((player, index) => ({
    name: player,
    score: gameStore.gameInstance?.score(index),
  })),
)
</script>

<template>
  <div>
    <p class="text-left">Scoreboard</p>
    <table class="w-96 table-auto border-collapse border border-border text-center">
      <thead>
        <tr>
          <th class="border border-borderHover px-4 py-2 font-bold">Player</th>
          <th class="border border-borderHover px-4 py-2 font-bold">Score</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="player in scores" :key="player.name">
          <td class="border border-borderHover px-4 py-2">{{ player.name }}</td>
          <td class="border border-borderHover px-4 py-2">{{ player.score }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
