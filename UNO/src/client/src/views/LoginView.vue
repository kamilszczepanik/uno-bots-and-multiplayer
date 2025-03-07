<script setup lang="ts">
import axiosInstance from '@/utils/axiosInstance'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import { isAxiosError } from 'axios'
import ControlButton from '@/components/ControlButton.vue'

const loginFormSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

type LoginForm = z.infer<typeof loginFormSchema>
type FormErrors = Partial<Record<keyof LoginForm, string>>

const form = ref<LoginForm>({
  username: '',
  password: '',
})

const errors = ref<FormErrors>({})

const router = useRouter()

const handleSubmit = async () => {
  try {
    loginFormSchema.parse(form.value)

    errors.value = {}

    const response = await axiosInstance.post(`/api/auth/login`, {
      username: form.value.username,
      password: form.value.password,
    })

    const { token } = response.data
    localStorage.setItem('authToken', token)

    router.push('/')
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.value = error.errors.reduce<FormErrors>((acc, curr) => {
        const fieldPath = curr.path[0] as keyof LoginForm
        acc[fieldPath] = curr.message
        return acc
      }, {})
    } else if (isAxiosError(error)) {
      errors.value = { username: 'Invalid username or password' }
    } else {
      console.error('Unexpected error:', error)
    }
  }
}
</script>

<template>
  <div class="mx-auto w-96 p-4">
    <h1 class="mb-6 text-center text-4xl font-bold">Login</h1>

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

      <div class="mt-6">
        <ControlButton
          variant="primary"
          type="submit"
          class="w-full rounded bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Login
        </ControlButton>

        <p class="mt-4 text-center">
          Don't have an account?
          <RouterLink to="/register" class="text-primary-600">Register</RouterLink>
        </p>
      </div>
    </form>
  </div>
</template>
