<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    type ChartData,
    type ChartOptions
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

type DataItem = {
    id: string,
    label: string
    value: number
}

const props = defineProps<{
    data: DataItem[]
}>()

const chartData = computed<ChartData<'bar'>>(() => ({
    labels: props.data.map((d) => d.label),
    datasets: [
        {
            data: props.data.map((d) => d.value),
            backgroundColor: [
                '#7ccf00aa',
                '#00b8dbaa',
                '#2b7fffaa',
                '#8e51ffaa',
                '#ad46ffaa',
                '#fe9a00aa',
                '#00bc7daa'
            ],
            borderColor: [
                '#7ccf00',
                '#00b8db',
                '#2b7fff',
                '#8e51ff',
                '#ad46ff',
                '#fe9a00',
                '#00bc7d'
            ],
            borderWidth: 1
        }
    ]
}))

const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        x: { display: true },
        y: { display: false }
    }
}
</script>

<template>
    <div>
        <Bar :data="chartData" :options="options" style="height: 200px;" />
    </div>
</template>