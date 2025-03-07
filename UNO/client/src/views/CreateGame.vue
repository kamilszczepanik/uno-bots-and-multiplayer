<script setup lang="ts">
import ControlButton from '@/components/ControlButton.vue'
import { startGameFormSchema } from '@/schemas/startGameFormSchema'
import { useGameStore } from '@/stores/gameStore'
import { useUserStore } from '@/stores/userStore'
import axiosInstance from '@/utils/axiosInstance'
import { logoutUser } from '@/utils/helpers'
import { AxiosError } from 'axios'
import { reactive, ref } from 'vue'
import { z } from 'zod'

type FormData = z.infer<typeof startGameFormSchema>
type FormErrors = Partial<Record<keyof FormData, string>>

const gameStore = useGameStore()
const userStore = useUserStore()

const form = reactive<{
  name: string
  targetScore: number
  cardsPerPlayer: number
}>({
  name: '',
  targetScore: 500,
  cardsPerPlayer: 7,
})

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
  <div class="p-2">
    <div class="flex items-center justify-end gap-2">
      <span class="font-bold">{{ userStore.userInfo.username }}</span>
      <div>
        <ControlButton variant="cancel" @click="logoutUser" class="w-32 bg-background">
          Logout
        </ControlButton>
      </div>
    </div>
    <h1 class="text-center text-7xl">UNO</h1>
    <div class="flex w-full flex-col justify-around gap-4 pt-8">
      <form @submit.prevent="handleSubmit" class="flex w-full items-center justify-around">
        <h2 class="mb-6 text-center text-3xl font-semibold">Create new game</h2>
        <div class="mb-4">
          <label class="mb-2 block font-bold text-text" for="name">Game name</label>
          <input
            type="text"
            v-model="form.name"
            id="name"
            name="name"
            class="mb-2 w-full rounded border bg-backgroundMute px-3 py-2"
            placeholder="eg. bestgame123"
            required
            autofocus
          />
          <p v-if="errors.name" class="text-red-500">{{ errors.name }}</p>
        </div>
        <div class="mb-4">
          <label class="mb-2 block font-bold text-text" for="targetScore">Target score</label>
          <input
            type="number"
            v-model="form.targetScore"
            id="targetScore"
            name="targetScore"
            class="mb-2 w-full rounded border bg-backgroundMute px-3 py-2"
          />
          <p v-if="errors.targetScore" class="text-red-500">{{ errors.targetScore }}</p>
        </div>
        <div class="mb-4">
          <label class="mb-2 block font-bold text-text" for="cardsPerPlayer"
            >Cards per player</label
          >
          <input
            type="number"
            v-model="form.cardsPerPlayer"
            id="cardsPerPlayer"
            name="cardsPerPlayer"
            class="mb-2 w-full rounded border bg-backgroundMute px-3 py-2"
          />
          <p v-if="errors.cardsPerPlayer" class="text-red-500">
            {{ errors.cardsPerPlayer }}
          </p>
        </div>
        <div>
          <ControlButton variant="primary" type="submit"> Create Game </ControlButton>
        </div>
      </form>
    </div>
  </div>
</template>
