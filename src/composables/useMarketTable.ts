import { ref, computed, nextTick } from 'vue'
import { useApi } from 'src/composables/useApi'

export function useMarketTable() {
  const { request, loading, error } = useApi()

  type Coin = {
    id: string
    name: string
    symbol: string
    current_price: number
    market_cap: number
    total_volume: number
    price_change_percentage_24h: number
    [key: string]: any
  }

  const coins = ref<Coin[]>([])
  const page = ref(1)
  const perPage = 50
  const sortBy = ref('market_cap')
  const descending = ref(true)

  const fetchCoins = async () => {
    loading.value = true
    const res = await request<any[]>(
      `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page.value}&sparkline=true&price_change_percentage=24h`
    )

    if (res) coins.value = res.map((c) => {
      const prices = c.sparkline_in_7d?.price || []

      const last24 = prices.slice(-24)
      const last72 = prices.slice(-72)

      return {
        ...c,
        trends: {
          '1d': getTrend(last24),
          '3d': getTrend(last72),
          '7d': getTrend(prices),
        },
        charts: {
          '1d': last24,
          '3d': last72,
          '7d': prices,
          '7dSample': samplePrices(prices)
        }
      }
    })
    
    await nextTick()
    loading.value = false
  }

  const search = ref('')

  const searchedCoins = computed(() => {
    if (!search.value) return coins.value

    return coins.value.filter(c =>
      c.name.toLowerCase().includes(search.value.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.value.toLowerCase())
    )
  })

  const filters = ref({
    change: '',
    priceRange: { min: 0, max: 0 },
    marketCapRange: { min: 0, max: 0 },
    volumeRange: { min: 0, max: 0 }
  })

  const setFilters = (newFilters: Object) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const filteredCoins = computed(() => {
    return searchedCoins.value.filter(c => {
      let ok = true
      if (filters.value.change === 'Gainers') {
        ok = ok && c.price_change_percentage_24h > 0
      }
      if (filters.value.change === 'Losers') {
        ok = ok && c.price_change_percentage_24h < 0
      }
      const { min: pMin, max: pMax } = filters.value.priceRange
      if (pMax > 0) {
        ok = ok && c.current_price >= pMin && c.current_price <= pMax
      }
      const { min: mMin, max: mMax } = filters.value.marketCapRange
      if (mMax > 0) {
        ok = ok && c.market_cap >= mMin && c.market_cap <= mMax
      }
      const { min: vMin, max: vMax } = filters.value.volumeRange
      if (vMax > 0) {
        ok = ok && c.total_volume >= vMin && c.total_volume <= vMax
      }

      return ok
    })
  })

  const getTrend = (prices?: number[]) => {
    if (!prices || prices.length < 2) return 'neutral'

    const first = prices[0]!
    const last = prices[prices.length - 1]!

    if (last > first) return 'bullish'
    if (last < first) return 'bearish'
    return 'neutral'
  }

  const samplePrices = (prices: number[], targetPoints = 30): number[] => {
    if (!prices?.length) return []

    if (prices.length <= targetPoints) return prices

    const step = prices.length / targetPoints
    const sampled: number[] = []

    for (let i = 0; i < targetPoints; i++) {
      sampled.push(prices[Math.floor(i * step)]!)
    }

    return sampled
  }

  const sortedCoins = computed(() => {
    return [...filteredCoins.value].sort((a, b) => {
      const valA = a[sortBy.value]
      const valB = b[sortBy.value]

      if (descending.value) return valB - valA
      return valA - valB
    })
  })

  return {
    coins: sortedCoins,
    rawCoins: coins,
    search,
    filters,
    setFilters,
    sortBy,
    descending,
    fetchCoins,
    loading,
    error
  }
}