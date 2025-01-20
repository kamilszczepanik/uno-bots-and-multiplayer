<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { computed, reactive } from 'vue'

const gameStore = useGameStore()

const form = reactive({
  userName: '',
  targetScore: 500,
  cardsPerPlayer: 7,
})

const handleSubmit = async () => {
  const props = {
    players: ['a', 'b'],
    targetScore: form.targetScore,
    cardsPerPlayer: form.cardsPerPlayer,
  }

  try {
    gameStore.initializeGame(props)
  } catch (error) {
    console.error('Error fetching job', error)
  }
}
const playerCount = computed(() => gameStore.playerCount)
</script>

<template>
  <div class="w-96 mx-auto p-2">
    <h1 class="text-7xl text-center">UNO</h1>

    <form @submit.prevent="handleSubmit">
      <h2 class="text-2xl text-center font-semibold mb-6">Start new game</h2>

      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="name">Your name</label>
        <input
          type="text"
          v-model="form.userName"
          id="name"
          name="name"
          class="border rounded w-full py-2 px-3 mb-2"
          placeholder="eg. bestplayer123"
          required
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="targetScore">Target score</label>
        <input
          type="number"
          v-model="form.targetScore"
          id="targetScore"
          name="targetScore"
          class="border rounded w-full py-2 px-3 mb-2"
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="cardsPerPlayer"
          >Cards per player</label
        >
        <input
          type="number"
          v-model="form.cardsPerPlayer"
          id="cardsPerPlayer"
          name="cardsPerPlayer"
          class="border rounded w-full py-2 px-3 mb-2"
        />
      </div>

      <div>
        <button
          class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Start Game
        </button>
      </div>
    </form>
    <div v-if="playerCount > 0">
      <h2 class="text-2xl text-center font-semibold mb-6">Players</h2>
      <p>{{ playerCount }}</p>
    </div>
  </div>
</template>
