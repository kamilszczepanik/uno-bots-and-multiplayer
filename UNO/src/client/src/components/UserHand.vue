<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import GameCard from './GameCard.vue'
import PlayerInfo from './PlayerInfo.vue'
import { useGameStore } from '@/stores/gameStore'
import { USER_INDEX } from '@/utils/constants'
import GameControls from './GameControls.vue'
import { fetchUserInfo, redirectIfNotAuthenticated, showMessage } from '@/utils/helpers'
import SelectColorModal from './SelectColorModal.vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const gameStore = useGameStore()
const userStore = useUserStore()
const router = useRouter()
const currentHand = computed(() => gameStore.currentHand)
const showSelectColorModal = ref(false)
const selectedCardIndex = ref<number | null>(null)
const currentPlayerId = computed(() => currentHand.value?.currentPlayerId)
const userIsCurrentPlayer = computed(() => currentPlayerId.value === userStore.userInfo.id)
const userHand = computed(() => {
  const playerHands = currentHand.value?.playerHands
  const userId = userStore.userInfo.id

  if (!playerHands) {
    return []
  }

  if (!userId) {
    throw new Error('User ID not found')
  }

  const parsedPlayerHands = JSON.parse(playerHands)
  const userCards = parsedPlayerHands[userId]

  return userCards || []
})

const handlePlayCard = (index: number) => {
  if (!userIsCurrentPlayer.value) {
    return showMessage("It's not your turn")
  }

  const card = userHand.value?.[index]
  if (!card) {
    return showMessage("Card doesn't exist")
  }

  if (card.type === 'WILD' || card.type === 'WILD DRAW') {
    selectedCardIndex.value = index
    showSelectColorModal.value = true
    return
  }

  // handleGameAction(() => currentHand.value?.play(index))
}

onMounted(async () => {
  const userInfo = await fetchUserInfo()
  userStore.setUserInfo(userInfo)

  await redirectIfNotAuthenticated({
    router,
    message: 'You must be logged in to create or join a game',
  })
})

const spacing = computed(() => {
  if (!userHand.value) return 0
  const defaultSpacing = 500
  const cardCount = userHand.value.length
  return Math.min(100, defaultSpacing / cardCount)
})
</script>

<template>
  <div class="flex w-full items-center justify-between px-4">
    <div class="mr-64 flex max-w-7xl flex-grow flex-col items-center">
      <div class="flex items-start space-x-4 pb-2">
        <PlayerInfo :player-index="USER_INDEX" class="w-96" />
        <div class="relative h-48 w-full overflow-visible">
          <div
            v-for="(card, index) in userHand"
            :key="index"
            class="absolute transform-gpu transition-transform"
            :style="{ transform: `translateX(${index * spacing}px)` }"
            :class="[userIsCurrentPlayer ? 'cursor-pointer hover:z-10' : 'cursor-not-allowed']"
            @click="handlePlayCard(index)"
          >
            <GameCard
              :card="card"
              :class="[
                userIsCurrentPlayer
                  ? 'cursor-pointer hover:z-10 hover:scale-105'
                  : 'cursor-not-allowed',
              ]"
            />
          </div>
        </div>
      </div>
    </div>
    <GameControls class="pb-2" />
    <SelectColorModal
      :card-index="selectedCardIndex"
      v-if="showSelectColorModal"
      @close="showSelectColorModal = false"
    />
  </div>
</template>
