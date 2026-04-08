import { computed, type Ref } from 'vue'

type TrendKey = '1d' | '3d' | '7d' | '7dSample'

type Coin = {
  id: string
  name: string
  symbol: string
  current_price: number
  market_cap: number
  total_volume: number
  price_change_percentage_24h: number
  charts: Partial<Record<TrendKey, number[]>>
}

type MarketCapDistribution = {
  large: number
  mid: number
  small: number
}

type PerformanceBuckets = Record<number, number>

type ScatterPoint = {
  x: number
  y: number
  meta: {
    name: string
    symbol: string
    marketCap: number
  }
}

type CorrelationData = {
  avg: number[]
  btc: number[]
}

export function useMarketDataInsights(coins: Ref<Coin[]>) {

  const marketCapDistribution = computed<MarketCapDistribution>(() => {
    let large = 0, mid = 0, small = 0

    coins.value.forEach(c => {
      if (c.market_cap > 1e10) large++
      else if (c.market_cap > 1e9) mid++
      else small++
    })

    return { large, mid, small }
  })

  const performanceBuckets = computed(() => {
    const buckets: Record<string, number> = {}

    coins.value.forEach(c => {
      const val = c.price_change_percentage_24h ?? 0
      const start = Math.floor(val / 2) * 2
      const key = `${start}`

      buckets[key] = (buckets[key] || 0) + 1
    })

    return Object.entries(buckets)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([start, count]) => {
        const s = Number(start)
        return {
          id: `${s}_${s + 2}`,
          label: `${s}% - ${s + 2}%`,
          value: count
        }
      })
  })

  const scatterData = computed<ScatterPoint[]>(() => {
    return coins.value.map(c => ({
      x: c.current_price,
      y: c.total_volume,
      meta: {
        name: c.name,
        symbol: c.symbol,
        marketCap: c.market_cap
      }
    }))
  })

  const correlationData = computed<CorrelationData>(() => {
    if (!coins.value.length) return { avg: [], btc: [] }

    const first = coins.value[0]
    const length = first?.charts?.['1d']?.length ?? 0

    if (!length) return { avg: [], btc: [] }

    const avg = Array.from({ length }, (_, i) => {
      let sum = 0

      coins.value.forEach(c => {
        sum += c.charts?.['1d']?.[i] ?? 0
      })

      return sum / coins.value.length
    })

    const btc = coins.value.find(c => c.symbol === 'btc')

    return {
      avg,
      btc: btc?.charts?.['1d'] ?? []
    }
  })

  return {
    marketCapDistribution,
    performanceBuckets,
    scatterData,
    correlationData
  }
}