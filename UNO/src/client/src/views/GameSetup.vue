<script setup lang="ts">
import ControlButton from '@/components/ControlButton.vue'
import router from '@/router'
import { startGameFormSchema } from '@/schemas/startGameFormSchema'
import { useGameStore } from '@/stores/gameStore'
import { reactive, ref } from 'vue'
import { z } from 'zod'

type FormData = z.infer<typeof startGameFormSchema>
type FormErrors = Partial<Record<keyof FormData, string>>

const gameStore = useGameStore()

const form = reactive<{
  userName: string
  targetScore: number
  cardsPerPlayer: number
  bots: { name: string }[]
}>({
  userName: '',
  targetScore: 500,
  cardsPerPlayer: 7,
  bots: [],
})

const errors = ref<FormErrors>({})

const handleSubmit = async () => {
  const formData = {
    userName: form.userName,
    targetScore: form.targetScore,
    cardsPerPlayer: form.cardsPerPlayer,
    bots: form.bots,
  }

  try {
    startGameFormSchema.parse(formData)

    errors.value = {}

    const players = [formData.userName, ...formData.bots.map((bot) => bot.name)].filter(
      (name) => name !== '',
    )

    const props = {
      players,
      targetScore: formData.targetScore,
      cardsPerPlayer: formData.cardsPerPlayer,
    }

    gameStore.initializeGame(props)
    router.push('/hand')
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.value = error.errors.reduce<Record<string, string>>((acc, curr) => {
        const fieldPath = curr.path.join('.')
        acc[fieldPath] = curr.message
        return acc
      }, {})
    }
  }
}

const addBot = () => {
  if (form.bots.length < 3) {
    form.bots.push({ name: '' })
  }
}

const removeBot = (index: number) => {
  form.bots.splice(index, 1)
}
</script>

<template>
  <div class="mx-auto w-96 p-2">
    <h1 class="text-center text-7xl">UNO</h1>

    <form @submit.prevent="handleSubmit">
      <h2 class="mb-6 text-center text-2xl font-semibold">Start new game</h2>

      <div class="mb-4">
        <label class="mb-2 block font-bold text-text" for="name">Your name</label>
        <input
          type="text"
          v-model="form.userName"
          id="name"
          name="name"
          class="mb-2 w-full rounded border bg-backgroundMute px-3 py-2"
          placeholder="eg. bestplayer123"
          required
        />
        <p v-if="errors.userName" class="text-red-500">{{ errors.userName }}</p>
      </div>

      <div class="mb-4">
        <label class="mb-2 block font-bold text-text" for="targetScore">Target score</label>
        <input
          type="number"
          v-model="form.targetScore"
          id="targetScore"
          name="targetScore"
          class="mb-2 w-full rounded border bg-backgroundMute px-3 py-2"
        />
        <p v-if="errors.targetScore" class="text-red-500">{{ errors.targetScore }}</p>
      </div>

      <div class="mb-4">
        <label class="mb-2 block font-bold text-text" for="cardsPerPlayer">Cards per player</label>
        <input
          type="number"
          v-model="form.cardsPerPlayer"
          id="cardsPerPlayer"
          name="cardsPerPlayer"
          class="mb-2 w-full rounded border bg-backgroundMute px-3 py-2"
        />
        <p v-if="errors.cardsPerPlayer" class="text-red-500">
          {{ errors.cardsPerPlayer }}
        </p>
      </div>

      <div class="mb-4">
        <label class="mb-2 block font-bold text-text">Bots</label>
        <div v-for="(bot, index) in form.bots" :key="index" class="mb-2">
          <div class="mb-2 flex items-center">
            <input
              type="text"
              v-model="bot.name"
              class="mr-2 w-full rounded border px-3 py-2"
              :placeholder="'Bot ' + (index + 1) + ' name'"
              required
            />

            <button
              type="button"
              class="focus:shadow-outline rounded-full bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600 focus:outline-none"
              @click="removeBot(index)"
            >
              Delete
            </button>
          </div>
          <p v-if="(errors as any)[`bots.${index}.name`]" class="text-red-500">
            {{ (errors as any)[`bots.${index}.name`] }}
          </p>
        </div>
        <p v-if="errors.bots" class="text-red-500">{{ errors.bots }}</p>

        <ControlButton
          variant="secondary"
          class="focus:shadow-outline mt-2 rounded-full border border-primary-500 px-4 py-2 font-bold text-primary-700 focus:outline-none disabled:cursor-not-allowed"
          @click="addBot"
          :disabled="form.bots.length >= 3"
        >
          Add Bot
        </ControlButton>
      </div>

      <div>
        <ControlButton variant="primary" type="submit"> Start Game </ControlButton>
      </div>
    </form>
  </div>
</template>
