import { ref, computed } from 'vue'
import { useApi } from 'src/composables/useApi'

export function useMarketInsights() {
  const { request, loading, error } = useApi()

  type MarketItem = {
  id: string
  name: string
  symbol: string
  image: string
  change: number | null
}

  const trendingCoins = ref<MarketItem[]>([])
  const topGainers = ref<MarketItem[]>([])

  const fetchTrending = async () => {
    const res = await request<{ coins: any[] }>('/search/trending')

    if (res?.coins) {
      trendingCoins.value = res.coins.slice(0, 7).map(c => ({
        id: c.item.id,
        name: c.item.name,
        symbol: c.item.symbol,
        image: c.item.small,
        change: null
      }))
    }
  }

  const fetchTopGainers = async () => {
    const res = await request<any[]>(
      '/coins/markets?vs_currency=usd&order=price_change_percentage_24h_desc&per_page=7&page=1'
    )

    if (res) {
      topGainers.value = res.map(c => ({
        id: c.id,
        name: c.name,
        symbol: c.symbol,
        image: c.image,
        change: c.price_change_percentage_24h
      }))
    }
  }

  const trendingList = computed(() => ({
    label: 'Trending',
    icon: 'trending_up',
    items: trendingCoins.value
  }))

  const gainersList = computed(() => ({
    label: 'Top Gainers',
    icon: 'rocket_launch',
    items: topGainers.value
  }))

  return {
    trendingCoins,
    topGainers,
    trendingList,
    gainersList,
    fetchTrending,
    fetchTopGainers,
    loading,
    error
  }
}