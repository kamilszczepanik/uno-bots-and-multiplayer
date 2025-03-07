<script setup lang="ts">
import ControlButton from '@/components/ControlButton.vue'
import { startGameFormSchema } from '@/schemas/startGameFormSchema'
import axiosInstance from '@/utils/axiosInstance'
import { fetchUserInfo, logoutUser, redirectIfNotAuthenticated } from '@/utils/helpers'
import { AxiosError } from 'axios'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'

type FormData = z.infer<typeof startGameFormSchema>
type FormErrors = Partial<Record<keyof FormData, string>>

interface Game {
  id: string
  name: string
  status: string
  targetScore: number
  cardsPerPlayer: number
  users: { id: number; username: string }[]
}

const router = useRouter()

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
const waitingGames = ref<Game[]>([])
const loadingGames = ref(false)
const errorLoadingGames = ref<string | null>(null)

const handleSubmit = async () => {
  const formData = {
    name: form.name,
    targetScore: form.targetScore,
    cardsPerPlayer: form.cardsPerPlayer,
    creatorId: userData.value.id,
  }

  try {
    startGameFormSchema.parse(formData)
    loadingGames.value = true
    errorLoadingGames.value = null

    await axiosInstance.post('/api/games', formData)
    errorCreatingGame.value = null
    errors.value = {}
    await fetchWaitingGames()
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

const fetchWaitingGames = async () => {
  loadingGames.value = true
  errorLoadingGames.value = null
  try {
    const response = await axiosInstance.get('/api/games')
    waitingGames.value = response.data
  } catch (err) {
    errorLoadingGames.value = 'Failed to fetch waiting games'
    console.error(err)
  } finally {
    loadingGames.value = false
  }
}

const userData = ref<{ id?: number; username?: string }>({})

onMounted(async () => {
  const userInfo = await fetchUserInfo()
  if (userInfo) {
    userData.value = userInfo
  }
  await redirectIfNotAuthenticated({
    router,
    message: 'You must be logged in to create or join a game',
  })
  fetchWaitingGames()
})
</script>

<template>
  <div class="p-2">
    <div class="flex items-center justify-end gap-2">
      <span class="font-bold">{{ userData.username }}</span>
      <ControlButton variant="cancel" @click="logoutUser" class="w-24 bg-background">
        Logout
      </ControlButton>
    </div>
    <h1 class="text-center text-7xl">UNO</h1>
    <div class="flex w-full justify-around gap-4 pt-8">
      <form @submit.prevent="handleSubmit" class="w-96">
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
      <div class="w-96">
        <h2 class="mb-6 text-center text-3xl font-semibold">Join existing game</h2>
        <div v-if="loadingGames" class="text-gray-500">loading games...</div>
        <div v-else-if="errorLoadingGames" class="text-red-500">{{ errorLoadingGames }}</div>
        <div v-else>
          <ul>
            <li
              v-for="game in waitingGames"
              :key="game.id"
              class="mb-4 flex w-full items-center justify-between rounded border border-border p-4 shadow"
            >
              <div>
                <div class="text-lg font-bold">{{ game.name }}</div>
                <div class="text-sm text-gray-600">
                  {{ game.users.length }}
                  {{ game.users.length ? 'Players' : 'Player' }}:
                  {{ game.users.map((u) => u.username).join(', ') || 'None' }}
                </div>
                <p class="text-sm text-gray-600">
                  Target score: <span class="font-bold">{{ game.targetScore }}</span>
                </p>
                <p class="text-sm text-gray-600">
                  Cards per player: <span class="font-bold">{{ game.cardsPerPlayer }}</span>
                </p>
              </div>
              <div>
                <ControlButton variant="secondary"> Join Game </ControlButton>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
