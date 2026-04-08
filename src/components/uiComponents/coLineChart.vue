<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  type ChartOptions
} from 'chart.js'

import { Colors } from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Colors
)

const props = withDefaults(defineProps<{
  data?: {
    avg: number[],
    btc: number[]
  }
}>(), {
  data: () => ({
    avg: [],
    btc: []
  })
})

const avgData = computed(() => props.data?.avg || [])
const btcData = computed(() => props.data?.btc || [])

const labels = computed(() =>
  avgData.value.map((_, i) => i)
)

const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: 'AVG',
      data: avgData.value,
      borderColor: '#00b8db',
      backgroundColor: '#00b8dbaa',
      borderWidth: 1,
      pointRadius: 0,
      tension: 0.3,
      yAxisID: 'y'
    },
    {
      label: 'BTC',
      data: btcData.value,
      borderColor: '#ad46ff',
      backgroundColor: '#ad46ffaa',
      borderWidth: 1,
      pointRadius: 0,
      tension: 0.3,
      yAxisID: 'y1'
    }
  ]
}))

const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'bottom' },
    tooltip: { enabled: false }
  },
  scales: {
    x: { display: true },
    y: {
      display: true,
      position: 'left'
    },
    y1: {
      display: true,
      position: 'right',
      grid: {
        drawOnChartArea: false
      }
    }
  }
}
</script>
<template>
  <div id="line-chart" style="height: 176px;">
    <Line :data="chartData" :options="options" />
  </div>
</template>