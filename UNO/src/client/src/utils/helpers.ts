import { toast } from 'vue3-toastify'

export const showMessage = (message: string) => {
  toast(message)
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
