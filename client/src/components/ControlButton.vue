oo
<script setup lang="ts">
import { defineProps } from 'vue'

type Button = 'primary' | 'secondary' | 'link' | 'warning' | 'cancel' | 'destructive'

const { variant, class: additionalClasses } = defineProps<{
  variant: Button
  class?: string
}>()

const buttonClasses: Record<Button, string> = {
  primary:
    'bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline disabled:cursor-not-allowed',
  secondary:
    'text-primary-600 hover:bg-backgroundSoft bg-background border-primary-600 border font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline disabled:cursor-not-allowed',
  link: 'text-primary-600 hover:text-primary-400',
  warning:
    'bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline',
  cancel:
    'bg-background hover:bg-backgroundSoft text-red-600 border border-red-600 font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline',
  destructive:
    'bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline',
}
</script>

<template>
  <button :class="`rounded px-4 py-2 transition ${buttonClasses[variant]} ${additionalClasses}`">
    <slot />
  </button>
</template>
