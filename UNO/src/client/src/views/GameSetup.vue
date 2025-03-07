<script setup lang="ts">
import ControlButton from '@/components/ControlButton.vue'
import { startGameFormSchema } from '@/schemas/startGameFormSchema'
import axiosInstance from '@/utils/axiosInstance'
import { fetchUserInfo, logoutUser, redirectIfNotAuthenticated, showMessage } from '@/utils/helpers'
import { AxiosError } from 'axios'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'

type FormData = z.infer<typeof startGameFormSchema>
type FormErrors = Partial<Record<keyof FormData, string>>

interface Game {
  id: string
  name: string
  status: 'waiting' | 'paused' | 'playing' | 'finished'
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

const allGames = ref<Game[]>([])
const errors = ref<FormErrors>({})
const loadingCreatingGame = ref(false)
const errorCreatingGame = ref<string | null>(null)
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
    await fetchGames()
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

const fetchGames = async () => {
  loadingGames.value = true
  errorLoadingGames.value = null

  try {
    const response = await axiosInstance.get('/api/games')
    allGames.value = response.data
  } catch (err) {
    errorLoadingGames.value = 'Failed to fetch games'
    console.error(err)
  } finally {
    loadingGames.value = false
  }
}

const waitingGames = computed(() => allGames.value.filter((game) => game.status === 'waiting'))
const pausedGames = computed(() => allGames.value.filter((game) => game.status === 'paused'))
const playingGames = computed(() => allGames.value.filter((game) => game.status === 'playing'))
const finishedGames = computed(() => allGames.value.filter((game) => game.status === 'finished'))

const handleJoinGame = async (gameId: string) => {
  try {
    const response = await axiosInstance.post(`/api/games/${gameId}/join`, {
      userId: userData.value.id,
    })
    showMessage(`You have joined the game ${response.data.name}`)
    fetchGames()
  } catch (error) {
    showMessage('Failed to join game')
    console.error(error)
  } finally {
    loadingGames.value = false
  }
}

const handleStartGame = async (gameId: string) => {
  console.log(gameId)
}
const handleLeaveGame = async (gameId: string) => {
  try {
    const response = await axiosInstance.post(`/api/games/${gameId}/leave`, {
      userId: userData.value.id,
    })
    showMessage(response.data.message)
    fetchGames()
  } catch (error) {
    showMessage('Failed to left the game')
    console.error(error)
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
  fetchGames()
})
</script>

<template>
  <div class="p-2">
    <div class="flex items-center justify-end gap-2">
      <span class="font-bold">{{ userData.username }}</span>
      <ControlButton variant="cancel" @click="logoutUser" class="w-32 bg-background">
        Logout
      </ControlButton>
    </div>
    <h1 class="text-center text-7xl">UNO</h1>
    <div class="flex w-full flex-col justify-around gap-4 pt-8">
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
        <h2 class="mb-6 text-center text-3xl font-semibold">Games</h2>
        <div>
          <!-- Error or Loading State -->
          <div v-if="loadingGames" class="text-gray-500">Loading games...</div>
          <div v-else-if="errorLoadingGames" class="text-red-500">{{ errorLoadingGames }}</div>

          <!-- Waiting Games -->
          <div v-if="waitingGames.length > 0">
            <h2 class="text-xsm font-semibold text-gray-600">WAITING GAMES</h2>
            <ul>
              <li
                v-for="game in waitingGames"
                :key="game.id"
                class="mb-4 flex w-full items-center justify-between rounded border border-border p-4 shadow"
              >
                <div>
                  <div class="text-lg font-bold">{{ game.name }}</div>
                  <div class="text-sm text-gray-600">
                    {{ game.users.length }} {{ game.users.length !== 1 ? 'Players' : 'Player' }}:
                    <span class="font-bold">
                      {{ game.users.map((u) => u.username).join(', ') || 'None' }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600">
                    Target score: <span class="font-bold">{{ game.targetScore }}</span>
                  </p>
                  <p class="text-sm text-gray-600">
                    Cards per player: <span class="font-bold">{{ game.cardsPerPlayer }}</span>
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <!-- Paused Games -->
          <div v-if="pausedGames.length > 0">
            <h2 class="mb-4 text-2xl font-semibold">Paused Games</h2>
            <ul>
              <li
                v-for="game in pausedGames"
                :key="game.id"
                class="mb-4 flex w-full items-center justify-between rounded border border-border p-4 shadow"
              >
                <div>
                  <div class="text-lg font-bold">{{ game.name }}</div>
                  <div class="text-sm text-gray-600">
                    {{ game.users.length }} {{ game.users.length !== 1 ? 'Players' : 'Player' }}:
                    <span class="font-bold">
                      {{ game.users.map((u) => u.username).join(', ') || 'None' }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600">
                    Target score: <span class="font-bold">{{ game.targetScore }}</span>
                  </p>
                  <p class="text-sm text-gray-600">
                    Cards per player: <span class="font-bold">{{ game.cardsPerPlayer }}</span>
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <!-- Playing Games -->
          <div v-if="playingGames.length > 0">
            <h2 class="mb-4 text-2xl font-semibold">Playing Games</h2>
            <ul>
              <li
                v-for="game in playingGames"
                :key="game.id"
                class="mb-4 flex w-full items-center justify-between rounded border border-border p-4 shadow"
              >
                <div>
                  <div class="text-lg font-bold">{{ game.name }}</div>
                  <div class="text-sm text-gray-600">
                    {{ game.users.length }} {{ game.users.length !== 1 ? 'Players' : 'Player' }}:
                    <span class="font-bold">
                      {{ game.users.map((u) => u.username).join(', ') || 'None' }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600">
                    Target score: <span class="font-bold">{{ game.targetScore }}</span>
                  </p>
                  <p class="text-sm text-gray-600">
                    Cards per player: <span class="font-bold">{{ game.cardsPerPlayer }}</span>
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <!-- Finished Games -->
          <div v-if="finishedGames.length > 0">
            <h2 class="mb-4 text-2xl font-semibold">Finished Games</h2>
            <ul>
              <li
                v-for="game in finishedGames"
                :key="game.id"
                class="mb-4 flex w-full items-center justify-between rounded border border-border p-4 shadow"
              >
                <div>
                  <div class="text-lg font-bold">{{ game.name }}</div>
                  <div class="text-sm text-gray-600">
                    {{ game.users.length }} {{ game.users.length !== 1 ? 'Players' : 'Player' }}:
                    <span class="font-bold">
                      {{ game.users.map((u) => u.username).join(', ') || 'None' }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600">
                    Target score: <span class="font-bold">{{ game.targetScore }}</span>
                  </p>
                  <p class="text-sm text-gray-600">
                    Cards per player: <span class="font-bold">{{ game.cardsPerPlayer }}</span>
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
