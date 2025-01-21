<script setup lang="ts">
import ControlButton from './ControlButton.vue'

const sayUno = () => {
  console.log('Say UNO triggered')
}

const catchUnoFailure = () => {
  console.log('Catch UNO Failure triggered')
}

const endHand = () => {
  console.log('End Hand triggered')
}

const endGame = () => {
  console.log('End Game triggered')
}
</script>

<template>
  <div class="flex flex-col items-center space-y-2">
    <ControlButton variant="primary" @click="sayUno"> Say UNO </ControlButton>
    <ControlButton variant="secondary" @click="catchUnoFailure"> Catch UNO Failure </ControlButton>
    <ControlButton variant="warning" @click="endHand"> End Hand </ControlButton>
    <ControlButton variant="destructive" @click="endGame"> End Game </ControlButton>
  </div>
</template>
