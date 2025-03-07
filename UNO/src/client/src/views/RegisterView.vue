<script setup lang="ts">
import axiosInstance from '@/utils/axiosInstance'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import { isAxiosError } from 'axios'
import ControlButton from '@/components/ControlButton.vue'

const registerFormSchema = z
  .object({
    username: z.string().min(1, { message: 'Username is required' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    confirmPassword: z.string().min(1, { message: 'Confirm Password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  })

type RegisterForm = z.infer<typeof registerFormSchema>
type FormErrors = Partial<Record<keyof RegisterForm, string>>

const form = ref<RegisterForm>({
  username: '',
  password: '',
  confirmPassword: '',
})

const errors = ref<FormErrors>({})

const router = useRouter()

const handleSubmit = async () => {
  try {
    registerFormSchema.parse(form.value)

    errors.value = {}

    await axiosInstance.post('/api/auth/register', {
      username: form.value.username,
      password: form.value.password,
    })

    router.push('/join-game')
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.value = error.errors.reduce<FormErrors>((acc, curr) => {
        const fieldPath = curr.path[0] as keyof RegisterForm
        acc[fieldPath] = curr.message
        return acc
      }, {})
    } else if (isAxiosError(error)) {
      errors.value = { username: error.response?.data?.error || 'An error occurred' }
    } else {
      console.error('Unexpected error:', error)
    }
  }
}
</script>

<template>
  <div class="mx-auto w-96 p-4">
    <h1 class="mb-6 text-center text-4xl font-bold">Register</h1>

    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="username" class="mb-2 block font-bold text-text">Username</label>
        <input
          id="username"
          type="text"
          v-model="form.username"
          class="mb-2 w-full rounded border bg-backgroundMute px-3 py-2"
          placeholder="Enter your username"
        />
        <p v-if="errors.username" class="mt-1 text-sm text-red-500">{{ errors.username }}</p>
      </div>

      <div class="mb-4">
        <label for="password" class="mb-2 block font-bold text-text">Password</label>
        <input
          id="password"
          type="password"
          v-model="form.password"
          class="mb-2 w-full rounded border bg-backgroundMute px-3 py-2"
          placeholder="Enter your password"
        />
        <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
      </div>

      <div class="mb-4">
        <label for="confirmPassword" class="mb-2 block font-bold text-text">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          v-model="form.confirmPassword"
          class="mb-2 w-full rounded border bg-backgroundMute px-3 py-2"
          placeholder="Confirm your password"
        />
        <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-500">
          {{ errors.confirmPassword }}
        </p>
      </div>

      <div class="mt-6">
        <ControlButton
          variant="primary"
          type="submit"
          class="w-full rounded bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Register
        </ControlButton>

        <p class="mt-4 text-center">
          Already have an account?
          <RouterLink to="/login" class="text-primary-600">Login</RouterLink>
        </p>
      </div>
    </form>
  </div>
</template>
