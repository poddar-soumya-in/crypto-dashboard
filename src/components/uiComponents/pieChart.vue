<script setup lang="ts">
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Colors
} from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, Colors)

const props = defineProps<{
    label: string,
    data: { large: number, mid: number, small: number }
}>()

const chartData = computed<ChartData<'pie', number[], string>>(() => ({
    labels: ['Large Cap', 'Mid Cap', 'Small Cap'],
    datasets: [
        {
            label: props.label,
            data: [props.data.large, props.data.mid, props.data.small],
            backgroundColor: ['#00b8dbaa', '#615fffaa', '#fe9a00aa'],
            borderColor: ['#00b8db', '#615fff', '#fe9a00'],
            borderWidth: 1
        }
    ]
}))

const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
        legend: {
            display: true,
            position: 'bottom'
        }
    }
}
</script>

<template>
    <div id="pie-chart" class="q-pt-xs">
        <Pie :data="chartData" :options="options" style="width: 160px; height: 200px;" />
    </div>
</template>