<script setup lang="ts">
import { computed } from 'vue'
import { Scatter } from 'vue-chartjs'
import {
    Chart as ChartJS,
    PointElement,
    LinearScale,
    LogarithmicScale,
    Tooltip,
    Legend
} from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'

ChartJS.register(PointElement, LinearScale, LogarithmicScale, Tooltip, Legend)

type ScatterPoint = {
    x: number
    y: number
    meta: {
        name: string
        symbol: string
        marketCap: number
    }
}

const props = defineProps<{
    data: ScatterPoint[]
}>()

const filteredData = computed(() =>
    props.data.filter(p => p.x > 0 && p.y > 0)
)

const chartData = computed<ChartData<'scatter'>>(() => ({
    datasets: [
        {
            label: 'Market Scatter',
            data: filteredData.value,
            pointRadius: 4,
            pointHoverRadius: 6,
            backgroundColor: ['#7ccf00aa']
        }
    ]
}))

const options: ChartOptions<'scatter'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: (ctx: any) => {
                    const { x, y, meta } = ctx.raw
                    return `${meta.name} (${meta.symbol.toUpperCase()})
Price: $${x.toLocaleString()}
Volume: $${y.toLocaleString()}`
                }
            }
        }
    },
    scales: {
        x: {
            type: 'logarithmic',
            display: false
        },
        y: {
            type: 'logarithmic',
            display: false
        }
    }
}
</script>

<template>
    <div style="height: 180px; width: 100%">
        <Scatter :data="chartData" :options="options" />
    </div>
</template>