import { ref } from 'vue'
import { useApi } from 'src/composables/useApi'

export function useGlobalMarket() {
    const { request, loading, error } = useApi()

    const globalData = ref<any>(null)

    const fetchGlobalData = async () => {
        const res = await request<{ data: any }>('/global')
        globalData.value = res?.data || null
    }

    return {
        globalData,
        fetchGlobalData,
        loading,
        error
    }
}