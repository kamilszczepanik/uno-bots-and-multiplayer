<script setup lang="ts">
import axiosInstance from '@/utils/axiosInstance'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import { isAxiosError } from 'axios'

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

    const response = await axiosInstance.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
      {
        username: form.value.username,
        password: form.value.password,
      },
    )

    const { token } = response.data
    localStorage.setItem('authToken', token)

    router.push('/dashboard')
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
        <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
        <input
          id="username"
          type="text"
          v-model="form.username"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter your username"
        />
        <p v-if="errors.username" class="mt-1 text-sm text-red-500">{{ errors.username }}</p>
      </div>

      <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          type="password"
          v-model="form.password"
          class="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter your password"
        />
        <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
      </div>

      <div class="mt-6">
        <button
          type="submit"
          class="w-full rounded bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Login
        </button>
      </div>
    </form>
  </div>
</template>
