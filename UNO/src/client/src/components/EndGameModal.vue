<script setup lang="ts">
import { defineEmits } from 'vue'
import ControlButton from './ControlButton.vue'
import { handleGameAction } from '@/utils/helpers'
import { useGameStore } from '@/stores/gameStore'
import { useRouter } from 'vue-router'

const gameStore = useGameStore()
const router = useRouter()
const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const handleEndGame = () => {
  handleGameAction(() => {
    gameStore.endGame()
    router.push('/')
  })
}
</script>
<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="closeModal"
  >
    <div class="z-50 w-96 space-y-4 rounded-lg bg-backgroundSoft p-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold">Are you sure you want to end the game?</h2>
      </div>
      <div class="flex flex-row gap-4">
        <ControlButton variant="primary" @click="closeModal"> Continue playing </ControlButton>
        <ControlButton variant="destructive" @click="handleEndGame"> End game </ControlButton>
      </div>
    </div>
  </div>
</template>
