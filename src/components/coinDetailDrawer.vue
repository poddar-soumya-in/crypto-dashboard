<template>
    <div class="q-pa-md column full-height">
        <q-btn class="absolute-top-right" flat round icon="close" @click="closeDrawer" />
        <div class="row items-center q-my-md">
            <div class="row items-center q-gutter-md">
                <img :src="coin?.image" width="40" />
                <div>
                    <div class="text-h5">{{ coin?.name }}</div>
                    <div class="text-caption text-grey">
                        {{ coin?.symbol?.toUpperCase() }} • Rank #{{ coin?.market_cap_rank }}
                    </div>
                </div>
            </div>
            <q-space />
            <div class="text-right q-mr-md">
                <div class="text-h5">${{ format(coin?.current_price) }}</div>
                <div :class="getChangeClass(coin?.price_change_percentage_24h)">
                    {{ coin?.price_change_percentage_24h?.toFixed(2) }}%
                </div>
            </div>
        </div>
        <div class="row q-col-gutter-lg">
            <div class="col-7">
                <div class="row justify-between items-center q-mb-sm">
                    <div class="text-subtitle1">Price Trend</div>
                    <q-btn-toggle v-model="range" :toggle-color="themeColor" :options="[
                        { label: '1D', value: '1d' },
                        { label: '3D', value: '3d' },
                        { label: '7D', value: '7d' }
                    ]" />
                </div>
                <div style="height: 100px">
                    <line-chart :data="chartData" :color="getGraphColor(coin?.trends[range])" />
                </div>
                <q-card flat bordered class="q-mt-md q-pa-sm">
                    <div class="text-caption text-grey">
                        {{ volumeInsight }}
                    </div>
                </q-card>
            </div>
            <div class="col-5">
                <q-card bordered class="q-pa-md q-mb-md metric-card">
                    <div class="text-subtitle1 q-mb-sm">Key Metrics</div>
                    <div class="row q-col-gutter-sm">
                        <metric class="col-6" label="Market Cap" :value="format(coin?.market_cap)" />
                        <metric class="col-6" label="Volume" :value="format(coin?.total_volume)" />
                        <metric class="col-6" label="ATH" :value="format(coin?.ath)" />
                        <metric class="col-6" label="ATL" :value="format(coin?.atl)" />
                    </div>
                </q-card>
                <q-card bordered class="q-pa-md q-mb-md metric-card">
                    <div class="text-subtitle2 q-mb-sm">Performance</div>
                    <div class="row q-gutter-md">
                        <performance-chip label="24H" :value="coin?.price_change_percentage_24h" />
                        <performance-chip label="7D" :value="coin?.price_change_percentage_7d_in_currency" />
                    </div>
                </q-card>
                <q-card flat bordered class="q-pa-md">
                    <div class="text-subtitle2 q-mb-sm">Insights</div>
                    <div class="text-caption">{{ insight }}</div>
                </q-card>
            </div>
        </div>
        <div class="q-mt-lg">
            <div class="text-subtitle1 q-mb-sm">Market Context</div>
            <div class="row q-col-gutter-md">
                <div class="col-6">
                    <q-card flat bordered class="q-pa-sm">
                        <div class="text-caption q-mb-xs">Market vs BTC</div>
                        <co-line-chart :data="correlation.avg" />
                    </q-card>
                </div>
                <div class="col-6">
                    <q-card flat bordered class="q-pa-sm">
                        <div class="text-caption q-mb-xs">Volume vs Price</div>
                        <plot-chart :data="scatter" />
                    </q-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, inject } from 'vue'
import { useCoinStore } from 'src/stores/coinStore'

const themeColor = inject('themeColor', 'light-blue')

const coinStore = useCoinStore()
const coin = computed(() => coinStore.selectedCoin)

const range = ref<'1d' | '3d' | '7d'>('7d')

const closeDrawer = async () => {
    await nextTick()
    coinStore.setSelectedCoin(null)
}

const format = (n?: number) => n ? n.toLocaleString() : '-'

const getChangeClass = (val?: number) => {
    if (val == null) return ''
    return val > 0 ? 'text-positive' : 'text-negative'
}

const getGraphColor = (trend?: string) =>
    trend === 'bullish' ? '#5ea500'
        : trend === 'bearish' ? '#e7000b'
            : '#999'

const chartData = computed(() => {
    return coin.value?.charts?.[range.value] ?? []
})

const insight = computed(() => {
    if (!coin.value) return ''

    const c = coin.value

    if (c.price_change_percentage_24h > 3)
        return 'Strong bullish momentum'

    if (c.price_change_percentage_24h < -3)
        return 'Bearish pressure observed'

    return 'Sideways / consolidation phase'
})

const volumeInsight = computed(() => {
    if (!coin.value) return ''

    if (coin.value.total_volume > 1e9)
        return 'High liquidity → strong participation'

    return 'Low volume → weaker conviction'
})

const correlation = { avg: [] }
const scatter: { x: number; y: number }[] = []
</script>
<style>
.metric-card {
    box-shadow: none;
    border: 1px #8e51ff solid;
}
.metric-card:hover {
    box-shadow: 10px 10px 20px 0 #8e51ff56;
}
</style>