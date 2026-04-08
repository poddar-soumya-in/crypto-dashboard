import { ref } from 'vue'
import { useApi } from 'src/composables/useApi'
import { nextTick } from 'process'

export function useGlobalMarket() {
    const { request, loading, error } = useApi()

    const globalData = ref<any>(null)

    const fetchGlobalData = async () => {
        loading.value = true
        const res = await request<{ data: any }>('/global')
        globalData.value = res?.data || null
        loading.value = false
    }

    return {
        globalData,
        fetchGlobalData,
        loading,
        error
    }
}