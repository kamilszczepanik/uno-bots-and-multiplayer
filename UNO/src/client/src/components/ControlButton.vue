<script setup lang="ts">
import { defineProps } from 'vue'

type Button = 'primary' | 'secondary' | 'link' | 'warning' | 'destructive'

const { variant } = defineProps<{
  variant: Button
}>()

const buttonClasses: Record<Button, string> = {
  primary:
    'bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline',
  secondary:
    'text-primary-500 hover:text-primary-400 hover:bg-backgroundMute border-primary-600 border font-bold py-2 px-4 rounded-full mt-2 focus:outline-none focus:shadow-outline disabled:cursor-not-allowed',
  link: 'text-primary-600 hover:text-primary-400',
  warning:
    'bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline',
  destructive:
    'bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline',
}
</script>

<template>
  <button :class="`rounded px-4 py-2 transition ${buttonClasses[variant]}`">
    <slot />
  </button>
</template>
