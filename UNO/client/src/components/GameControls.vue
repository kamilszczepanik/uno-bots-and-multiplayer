<script setup lang="ts">
import { computed, ref } from 'vue'
import ControlButton from './ControlButton.vue'
import { useGameStore } from '@/stores/gameStore'
import { handleGameAction } from '@/utils/helpers'
import EndGameModal from './EndGameModal.vue'
import { useRouter } from 'vue-router'
import * as api from '@/model/api'

const router = useRouter()
const gameStore = useGameStore()
const showEndGameModal = ref(false)
const currentHand = computed(() => gameStore.game?.currentHand())

handleGameAction(
  async () => {
    // todo: handle end game
    await api.sayUno({ gameId: game.id, handId: currentHand.value.id, userId })
    router.push('/')
  },
  {
    successMessage: 'You said UNO',
    errorMessage: 'Failed to say uno.',
  },
)

const handleEndGame = () => {
  showEndGameModal.value = true
}

const handleGoToMenu = () => {
  router.push('/')
}
</script>

<template>
  <div class="flex w-48 flex-col items-center gap-4">
    <ControlButton variant="primary" @click="handleSayUno"> Say UNO </ControlButton>
    <ControlButton variant="secondary" @click="handleGoToMenu"> Go to Menu </ControlButton>
    <ControlButton variant="destructive" @click="handleEndGame"> End Game </ControlButton>
    <EndGameModal v-if="showEndGameModal" @close="showEndGameModal = false" />
  </div>
</template>
