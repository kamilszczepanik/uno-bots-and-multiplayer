<script setup lang="ts">
import { computed, defineEmits } from 'vue'
import { handleGameAction, showMessage } from '@/utils/helpers'
import { colors, type Color } from 'models/src/model/deck'
import * as api from '@/model/api'
import { useInProgressGamesStore } from '@/stores/inProgressGamesStore'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = computed(() => route.params.id)
const inProgressGamesStore = useInProgressGamesStore()
const game = computed(() => inProgressGamesStore.game(id.value as string))
const currentHand = computed(() => game.value?.hands[game.value.currentRound - 1])

const emit = defineEmits(['close'])

const { cardIndex } = defineProps<{ cardIndex: number | null }>()

const closeModal = () => {
  emit('close')
}

const handleSelectColor = (color: Color) => {
  if (!cardIndex) {
    return showMessage('Select a WILD or WILD DRAW card first.')
  }

  if (!game.value || !currentHand.value) {
    return showMessage('Game or current hand not found. Please refresh or try again.')
  }

  handleGameAction(
    async () =>
      await api.play({
        gameId: game.value!.id,
        handId: currentHand.value!.id,
        cardIndex,
        color,
      }),
    {
      errorMessage: 'Failed to draw a card.',
    },
  )

  emit('close')
}

const colorClasses: Record<string, string> = {
  BLUE: 'bg-blue-600',
  GREEN: 'bg-green-600',
  RED: 'bg-red-600',
  YELLOW: 'bg-yellow-600',
}
</script>
<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="closeModal"
  >
    <div class="z-50 w-96 space-y-4 rounded-lg bg-backgroundSoft p-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold">Select the color that you want</h2>
        <button
          variant="destructive"
          class="h-10 w-10 rounded-full border border-red-600 text-red-600 hover:bg-backgroundSoft"
          @click="closeModal"
        >
          X
        </button>
      </div>
      <div class="flex flex-wrap justify-center gap-2">
        <button
          v-for="color in colors"
          :key="color"
          @click="handleSelectColor(color)"
          :class="`h-24 w-40 rounded-lg text-white ${colorClasses[color]}`"
        >
          {{ color }}
        </button>
      </div>
    </div>
  </div>
</template>
