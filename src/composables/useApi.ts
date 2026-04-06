import { ref } from 'vue'
import { apiClient } from 'src/services/apiClient'

export function useApi() {
    const loading = ref<boolean>(false)
    const error = ref<Error | null>(null)

    const request = async <T = any>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T | null> => {
        try {
            loading.value = true
            error.value = null

            const data = await apiClient<T>(endpoint, options)
            return data
        } catch (err) {
            error.value = err as Error
            return null
        } finally {
            loading.value = false
        }
    }

    return {
        request,
        loading,
        error,
    }
}