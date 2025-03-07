<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import axiosInstance from '@/utils/axiosInstance'
import { showMessage } from '@/utils/helpers'
import { computed, onMounted, ref } from 'vue'

interface Game {
  id: string
  name: string
  status: 'waiting' | 'paused' | 'in progress' | 'finished'
  targetScore: number
  cardsPerPlayer: number
  users: { id: number; username: string }[]
}

const userStore = useUserStore()
const allGames = ref<Game[]>([])
const waitingGames = computed(() => allGames.value.filter((game) => game.status === 'waiting'))
const pausedGames = computed(() => allGames.value.filter((game) => game.status === 'paused'))
const inProgressGames = computed(() =>
  allGames.value.filter((game) => game.status === 'in progress'),
)
const finishedGames = computed(() => allGames.value.filter((game) => game.status === 'finished'))

const loadingGames = ref(false)
const errorLoadingGames = ref<string | null>(null)

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

const handleJoinGame = async (gameId: string) => {
  try {
    const response = await axiosInstance.post(`/api/games/${gameId}/join`, {
      userId: userStore.userInfo.id,
    })
    showMessage(`You have joined the game ${response.data.name}`)
    fetchGames()
  } catch (error) {
    showMessage('Failed to join game')
    console.error(error)
  }
}

const handleStartGame = async (gameId: string) => {
  try {
    const response = await axiosInstance.post(`/api/games/${gameId}/start`)
    showMessage(response.data.message)
    fetchGames()
  } catch (error) {
    showMessage('Failed to left the game')
    console.error(error)
  }
}
const handleLeaveGame = async (gameId: string) => {
  try {
    const response = await axiosInstance.post(`/api/games/${gameId}/leave`, {
      userId: userStore.userInfo.id,
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

onMounted(() => {
  fetchGames()
})
</script>
<template>
  <div>
    <h2 class="mb-6 text-center text-3xl font-semibold">Games</h2>
    <div class="grid grid-cols-4 gap-4">
      <div v-if="loadingGames" class="text-gray-500">Loading games...</div>
      <div v-else-if="errorLoadingGames" class="text-red-500">{{ errorLoadingGames }}</div>

      <div v-if="waitingGames.length > 0">
        <h2 class="font-bold text-gray-600">WAITING</h2>
        <ul>
          <li
            v-for="game in waitingGames"
            :key="game.id"
            class="mb-4 flex w-full items-center justify-between rounded border border-border p-1 shadow"
          >
            <div class="flex w-full items-center justify-between">
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
              <div class="flex flex-col gap-2">
                <ControlButton
                  v-if="
                    game.status === 'waiting' &&
                    game.users.length < 4 &&
                    !game.users.some((user) => user.id === userStore.userInfo.id)
                  "
                  variant="secondary"
                  @click="handleJoinGame(game.id)"
                  class="w-32"
                >
                  Join Game
                </ControlButton>
                <ControlButton
                  v-if="
                    game.status === 'waiting' &&
                    game.users.length > 1 &&
                    game.users.some((user) => user.id === userStore.userInfo.id)
                  "
                  variant="primary"
                  @click="handleStartGame(game.id)"
                  class="w-32"
                >
                  Start Game
                </ControlButton>
                <ControlButton
                  v-if="
                    game.status === 'waiting' &&
                    game.users.some((user) => user.id === userStore.userInfo.id)
                  "
                  variant="cancel"
                  @click="handleLeaveGame(game.id)"
                  class="w-32"
                >
                  Leave Game
                </ControlButton>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div v-if="pausedGames.length > 0">
        <h2 class="font-bold text-gray-600">PAUSED</h2>
        <ul>
          <li
            v-for="game in pausedGames"
            :key="game.id"
            class="mb-4 flex w-full items-center justify-between rounded border border-border p-4 shadow"
          >
            <div class="flex">
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
              <div>
                <ControlButton variant="secondary" @click="handleLeaveGame(game.id)" class="w-32">
                  Resume Game(todo)
                </ControlButton>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div v-if="inProgressGames.length > 0">
        <h2 class="font-bold text-gray-600">IN PROGRESS</h2>
        <ul>
          <li
            v-for="game in inProgressGames"
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
      <div v-if="finishedGames.length > 0">
        <h2 class="font-bold text-gray-600">FINISHED</h2>
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
</template>
