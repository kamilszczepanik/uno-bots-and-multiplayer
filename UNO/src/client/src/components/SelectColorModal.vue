<script setup lang="ts">
import { computed, defineEmits } from 'vue'
import ControlButton from './ControlButton.vue'
import { handleGameAction, showMessage } from '@/utils/helpers'
import { useGameStore } from '@/stores/gameStore'
import { colors, type Color } from '../../../model/deck'

const gameStore = useGameStore()
const currentHand = computed(() => gameStore.currentHand)
const emit = defineEmits(['close'])

const { cardIndex } = defineProps<{ cardIndex: number | null }>()

const closeModal = () => {
  emit('close')
}

const handleSelectColor = (color: Color) => {
  if (!cardIndex) {
    return showMessage('Select a WILD or WILD DRAW card first.')
  }

  handleGameAction(() => {
    handleGameAction(() => currentHand.value?.play(cardIndex, color))
  })

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
    <div class="z-50 w-96 space-y-4 rounded-lg bg-white p-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold">Select the color that you want</h2>
        <ControlButton
          variant="destructive"
          class="w-12 border border-red-600 bg-inherit text-red-600 hover:bg-inherit"
          @click="closeModal"
          >X</ControlButton
        >
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
