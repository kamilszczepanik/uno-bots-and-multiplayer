<script setup lang="ts">
import { ref } from 'vue'
import ControlButton from './ControlButton.vue'
import CatchUnoFailureModal from './CatchUnoFailureModal.vue'
import { useGameStore } from '@/stores/gameStore'
import { USER_INDEX } from '@/utils/constants'
import { handleGameAction } from '@/utils/helpers'

const gameStore = useGameStore()
const showCatchUnoFailureModal = ref(false)

const handleSayUno = () => {
  handleGameAction(() => gameStore.currentHand?.sayUno(USER_INDEX))
}

const handleCatchUnoFailure = () => {
  showCatchUnoFailureModal.value = true
}

const handleEndGame = () => {
  console.log('End Game triggered')
}
</script>

<template>
  <div class="flex flex-col items-center space-y-2">
    <ControlButton variant="primary" @click="handleSayUno"> Say UNO </ControlButton>
    <ControlButton variant="secondary" @click="handleCatchUnoFailure">
      Catch UNO Failure
    </ControlButton>
    <ControlButton variant="destructive" @click="handleEndGame"> End Game </ControlButton>

    <CatchUnoFailureModal
      v-if="showCatchUnoFailureModal"
      @close="showCatchUnoFailureModal = false"
    />
  </div>
</template>
