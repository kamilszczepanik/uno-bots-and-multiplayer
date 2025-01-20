<script setup lang="ts">
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
  <div class="w-96 mx-auto p-2">
    <h1 class="text-7xl text-center">UNO</h1>

    <form @submit.prevent="handleSubmit">
      <h2 class="text-2xl text-center font-semibold mb-6">Start new game</h2>

      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="name">Your name</label>
        <input
          type="text"
          v-model="form.userName"
          id="name"
          name="name"
          class="border rounded w-full py-2 px-3 mb-2"
          placeholder="eg. bestplayer123"
          required
        />
        <p v-if="errors.userName" class="text-red-500">{{ errors.userName }}</p>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="targetScore">Target score</label>
        <input
          type="number"
          v-model="form.targetScore"
          id="targetScore"
          name="targetScore"
          class="border rounded w-full py-2 px-3 mb-2"
        />
        <p v-if="errors.targetScore" class="text-red-500">{{ errors.targetScore }}</p>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2" for="cardsPerPlayer"
          >Cards per player</label
        >
        <input
          type="number"
          v-model="form.cardsPerPlayer"
          id="cardsPerPlayer"
          name="cardsPerPlayer"
          class="border rounded w-full py-2 px-3 mb-2"
        />
        <p v-if="errors.cardsPerPlayer" class="text-red-500">
          {{ errors.cardsPerPlayer }}
        </p>
      </div>

      <div class="mb-4">
        <label class="block text-gray-700 font-bold mb-2">Bots</label>
        <div v-for="(bot, index) in form.bots" :key="index" class="mb-2">
          <div class="flex items-center mb-2">
            <input
              type="text"
              v-model="bot.name"
              class="border rounded w-full py-2 px-3 mr-2"
              :placeholder="'Bot ' + (index + 1) + ' name'"
              required
            />

            <button
              type="button"
              class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
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

        <button
          type="button"
          class="text-primary-700 border-primary-500 border font-bold py-2 px-4 rounded-full mt-2 focus:outline-none focus:shadow-outline disabled:cursor-not-allowed"
          @click="addBot"
          :disabled="form.bots.length >= 3"
        >
          Add Bot
        </button>
      </div>

      <div>
        <button
          class="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Start Game
        </button>
      </div>
    </form>
  </div>
</template>
