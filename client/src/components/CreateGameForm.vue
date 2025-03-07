<script setup lang="ts">
import { startGameFormSchema } from '@/schemas/startGameFormSchema'
import { useGameStore } from '@/stores/gameStore'
import { useUserStore } from '@/stores/userStore'
import axiosInstance from '@/utils/axiosInstance'
import { AxiosError } from 'axios'
import { reactive, ref } from 'vue'
import { z } from 'zod'
import ControlButton from './ControlButton.vue'

type FormData = z.infer<typeof startGameFormSchema>
type FormErrors = Partial<Record<keyof FormData, string>>

const form = reactive<{
  name: string
  targetScore: number
  cardsPerPlayer: number
}>({
  name: '',
  targetScore: 500,
  cardsPerPlayer: 7,
})

const userStore = useUserStore()
const gameStore = useGameStore()
const errors = ref<FormErrors>({})
const loadingCreatingGame = ref(false)
const errorCreatingGame = ref<string | null>(null)

const handleSubmit = async () => {
  const formData = {
    name: form.name,
    targetScore: form.targetScore,
    cardsPerPlayer: form.cardsPerPlayer,
    creatorId: userStore.userInfo.id,
  }

  try {
    startGameFormSchema.parse(formData)
    await axiosInstance.post('/api/games', formData)
    errorCreatingGame.value = null
    errors.value = {}
    gameStore.fetchGames()
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.value = error.errors.reduce<Record<string, string>>((acc, curr) => {
        const fieldPath = curr.path.join('.')
        acc[fieldPath] = curr.message
        return acc
      }, {})
    }
    if (error instanceof AxiosError) {
      console.error(error)
      errorCreatingGame.value = 'Failed to create new game'
    }
  } finally {
    loadingCreatingGame.value = false
  }
}
</script>
<template>
  <div class="flex w-full flex-col items-center gap-6 px-4 pt-8">
    <form
      @submit.prevent="handleSubmit"
      class="flex w-full max-w-4xl flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <h2 class="text-center text-2xl font-semibold sm:mr-4 sm:w-auto sm:shrink-0 sm:text-left">
        Create New Game
      </h2>

      <div class="w-full sm:flex-1">
        <label class="mb-1 block font-bold text-text" for="name">Game Name</label>
        <input
          type="text"
          v-model="form.name"
          id="name"
          name="name"
          class="focus:ring-primary w-full rounded border bg-backgroundMute px-3 py-2 focus:outline-none focus:ring-2"
          placeholder="e.g., bestgame123"
          required
          autofocus
        />
        <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
      </div>

      <div class="w-full sm:flex-1">
        <label class="mb-1 block font-bold text-text" for="targetScore">Target Score</label>
        <input
          type="number"
          v-model="form.targetScore"
          id="targetScore"
          name="targetScore"
          class="focus:ring-primary w-full rounded border bg-backgroundMute px-3 py-2 focus:outline-none focus:ring-2"
        />
        <p v-if="errors.targetScore" class="text-sm text-red-500">{{ errors.targetScore }}</p>
      </div>

      <div class="w-full sm:flex-1">
        <label class="mb-1 block font-bold text-text" for="cardsPerPlayer">Cards Per Player</label>
        <input
          type="number"
          v-model="form.cardsPerPlayer"
          id="cardsPerPlayer"
          name="cardsPerPlayer"
          class="focus:ring-primary w-full rounded border bg-backgroundMute px-3 py-2 focus:outline-none focus:ring-2"
        />
        <p v-if="errors.cardsPerPlayer" class="text-sm text-red-500">
          {{ errors.cardsPerPlayer }}
        </p>
      </div>

      <div class="flex w-full justify-center sm:w-auto">
        <ControlButton
          variant="primary"
          type="submit"
          class="w-full px-6 py-2 text-center sm:w-auto"
        >
          Create Game
        </ControlButton>
      </div>
    </form>
  </div>
</template>
