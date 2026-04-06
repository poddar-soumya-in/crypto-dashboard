import { ref } from 'vue'
import { useApi } from './useApi'
import type { Coin } from 'src/types/coin'

export function useCoins() {
    const coins = ref<Coin[]>([])
    const { request, loading, error } = useApi()

    const fetchCoins = async () => {
        const data = await request<Coin[]>(
            '/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1'
        )

        if (data) coins.value = data
    }

    return {
        coins,
        loading,
        error,
        fetchCoins,
    }
}