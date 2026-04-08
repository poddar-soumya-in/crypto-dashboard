<template>
    <div v-if="!loading" class="row ">
        <div class="w-3/5 row q-col-gutter-sm q-pr-sm">
            <insightCard v-for="{ metric, key, color } in insightCards" :key="key" class="col-6" :metric="metric"
                :color="color">
                <q-circular-progress v-if="key === 'btc_dominance'" :value="metric.value" size="75px" :thickness="0.40"
                    :color="color" track-color="grey-3" class="q-mt-sm" />
                <q-linear-progress v-if="key === 'market_breadth'" :value="metric.value / 100" size="10px"
                    :color="color" track-color="grey-4" class="q-mt-sm w-48 q-mb-lg rounded" />
            </insightCard>
        </div>
        <div class="w-2/5 row">
            <div class="col-6 w-1/2">
                <listCard :list="trendingList" color="cyan" />
            </div>
            <div class="col-6 w-1/2 q-pl-sm">
                <listCard :list="gainersList" color="amber" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, onMounted } from 'vue'

import { useGlobalMarket } from 'src/composables/useGlobalMarket'
import { useCoins } from 'src/composables/useCoins'

import { useMarketInsights } from 'src/composables/useMarketInsights'

const { globalData, fetchGlobalData, loading } = useGlobalMarket()
const { coins, fetchCoins } = useCoins()

const insightMetric = [
    {
        key: "market_cap",
        label: "Total Market Cap",
        icon: "candlestick_chart",
        color: "green",
        getValue: (global) => global.total_market_cap.usd,
        getChange: (global) => global.market_cap_change_percentage_24h_usd,
        format: (val) => formatCurrency(val),
        getInsight: (change) => {
            if (change > 2) return "Strong bullish momentum";
            if (change > 0) return "Market trending up";
            return "Market cooling down";
        }
    },
    {
        key: "volume",
        label: "24h Volume",
        icon: "bar_chart",
        color: "blue",
        getValue: (global) => global.total_volume.usd,
        getChange: (global) => global.volume_change_percentage_24h_usd,
        format: (val) => formatCurrency(val),
        getInsight: (change) => {
            if (change > 30) return "High trading activity";
            if (change > 0) return "Moderate activity";
            return "Low participation";
        }
    },
    {
        key: "btc_dominance",
        label: "BTC Dominance",
        icon: "pie_chart",
        color: "orange",
        getValue: (global) => global.market_cap_percentage.btc,
        getChange: () => null,
        format: (val) => `${val.toFixed(2)}%`,
        getInsight: (val) => {
            if (val > 50) return "BTC leading market";
            if (val < 45) return "Altcoins gaining strength";
            return "Balanced market";
        }
    },
    {
        key: "market_breadth",
        label: "Market Breadth",
        icon: "donut_large",
        color: "purple",
        getValue: (_, coins) => {
            const gainers = coins.filter(c => c.price_change_percentage_24h > 0).length;
            return (gainers / coins.length) * 100;
        },
        getChange: () => null,
        format: (val) => `${val.toFixed(0)}% Up`,
        getInsight: (val) => {
            if (val > 60) return "Broad market rally";
            if (val < 40) return "Weak market sentiment";
            return "Mixed movement";
        }
    }
];

const formatCurrency = (num) => {
    if (!num) return "-";
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
};

const insightCards = computed(() => {
    if (!globalData.value) return []

    return insightMetric.map(metric => {
        const value = metric.getValue(globalData.value, coins.value)
        const change = metric.getChange?.(globalData.value)

        return {
            key: metric.key,
            metric: {
                label: metric.label,
                icon: metric.icon,
                value: value,
                valueFormatted: metric.format(value),
                change,
                changeFormatted: formatPercentage(change),
                trend: getTrend(change),
                insight: metric.getInsight(change ?? value)
            },
            color: metric.color
        }
    })
})

const getTrend = (change) => {
    if (change > 0) return 'up'
    if (change < 0) return 'down'
    return 'neutral'
}

const formatPercentage = (val) => {
    if (val == null) return '-'
    return `${val > 0 ? '+' : ''}${val.toFixed(2)}%`
}

const {
  trendingList,
  gainersList,
  fetchTrending,
  fetchTopGainers
} = useMarketInsights()

onMounted(() => {
    fetchGlobalData()
    fetchCoins()
    fetchTrending()
    fetchTopGainers()
})

</script>
<style>
.insight-card {
    box-shadow: none;
}

.insight-card:hover {
    box-shadow: 10px 10px 20px 0 var(--hover-color);
}
</style>