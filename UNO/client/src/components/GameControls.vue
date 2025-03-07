<script setup lang="ts">
import { computed } from 'vue'
import ControlButton from './ControlButton.vue'
import { handleGameAction, showMessage } from '@/utils/helpers'
import { useRoute, useRouter } from 'vue-router'
import * as api from '@/model/api'
import { useInProgressGamesStore } from '@/stores/inProgressGamesStore'

const route = useRoute()
const id = computed(() => route.params.id)
const router = useRouter()
const inProgressGamesStore = useInProgressGamesStore()
const playerIndex = 0
const game = computed(() => inProgressGamesStore.game(id.value as string))
const currentHand = computed(() => game.value?.hands[game.value.currentRound - 1])

const handleSayUno = () =>
  handleGameAction(
    async () => {
      if (!game.value || !currentHand.value) {
        showMessage('Game or current hand not found. Please refresh or try again.')
        return
      }
      await api.sayUno({ gameId: game.value.id, handId: currentHand.value.id, playerIndex })
      router.push('/')
    },
    {
      successMessage: 'You said UNO',
      errorMessage: 'Failed to say uno.',
    },
  )

const handleGoToMenu = () => {
  router.push('/')
}
</script>

<template>
  <div class="flex w-48 flex-col items-center gap-4">
    <ControlButton variant="primary" @click="handleSayUno"> Say UNO </ControlButton>
    <ControlButton variant="secondary" @click="handleGoToMenu"> Go to Menu </ControlButton>
  </div>
</template>
