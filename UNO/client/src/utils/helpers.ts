import { type Router } from 'vue-router'
import { toast } from 'vue3-toastify'
import axiosInstance from './axiosInstance'
import type { User } from '../../../shared/types'

export const showMessage = (message: string) => {
  toast(message, {
    style: {
      background: 'var(--color-background)',
    },
  })
}

export function handleGameAction(
  action: () => void,
  options?: { successMessage?: string; errorMessage?: string },
) {
  try {
    action()
    if (options?.successMessage) {
      showMessage(options.successMessage)
    }
  } catch (error) {
    if (error instanceof Error) {
      showMessage(options?.errorMessage || error.message)
    } else {
      showMessage(options?.errorMessage || 'An unknown error occurred.')
    }
  }
}

export const isAuthenticated = async (): Promise<boolean> => {
  const userInfo = await fetchUserInfo()
  return userInfo !== null
}

export const redirectIfNotAuthenticated = async ({
  router,
  redirectPath = '/login',
  message,
}: {
  router: Router
  redirectPath?: string
  message?: string
}): Promise<void> => {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    await router.push(redirectPath)
    if (message) {
      showMessage(message)
    }
  }
}

export const fetchUserInfo = async (): Promise<User | null> => {
  try {
    const token = localStorage.getItem('authToken')
    if (!token) {
      console.error('No token found')
      return null
    }

    const response = await axiosInstance.get('/api/auth/user-info', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  } catch (err) {
    console.error('Failed to fetch user info:', err)
    return null
  }
}

export const logoutUser = async () => {
  try {
    localStorage.removeItem('authToken')
    window.location.href = '/login'
  } catch (error) {
    console.error('Error logging out:', error)
  }
}
