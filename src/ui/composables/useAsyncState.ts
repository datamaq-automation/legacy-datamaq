import { ref } from 'vue'

export function useAsyncState() {
  const isLoading = ref(false)
  const error = ref<unknown>(null)

  async function run<T>(promise: Promise<T>): Promise<T> {
    isLoading.value = true
    error.value = null
    try {
      return await promise
    } catch (err) {
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    run
  }
}
