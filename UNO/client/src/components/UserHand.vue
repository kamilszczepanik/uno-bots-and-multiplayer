<script setup lang="ts">
import { computed, ref } from 'vue'
import GameCard from './GameCard.vue'
import PlayerInfo from './PlayerInfo.vue'
import { USER_INDEX } from '@/utils/constants'
import GameControls from './GameControls.vue'
import { showMessage } from '@/utils/helpers'
import SelectColorModal from './SelectColorModal.vue'
import { useRouter } from 'vue-router'
import type { IndexedGame } from '../../../shared/types'

const { game, userId } = defineProps<{
  game: IndexedGame
  userId: string
}>()

const router = useRouter()

const showSelectColorModal = ref(false)
const selectedCardIndex = ref<number | null>(null)
console.log('game', game)
const currentHand = computed(() => game.hands[game.currentRound - 1])
console.log('currentHand', currentHand.value)

// const currentPlayerId = computed(() => currentHand.value?.currentPlayerId)
// const userIsCurrentPlayer = computed(() => currentPlayerId.value === userId)
const userIsCurrentPlayer = true
const userHand = computed(() => {
  const playerHands = currentHand.value?.playerHands

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
  // if (!userIsCurrentPlayer.value) {
  //   return showMessage("It's not your turn")
  // }

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
