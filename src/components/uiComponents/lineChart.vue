<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip
} from 'chart.js'

import { Colors } from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Colors
)

const props = withDefaults(defineProps<{
  data?: number[],
  color?: string
}>(), {
  data: () => [],
  color: '#45e3ff' // default (green)
})

const safeData = computed(() => props.data)

const chartData = computed(() => ({
  labels: safeData.value.map((_, i) => i),
  datasets: [
    {
      data: safeData.value,
      borderColor: props.color,
      backgroundColor: props.color,
      borderWidth: 1,
      pointRadius: 0,
      tension: 0.3
    }
  ]
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  },
  scales: {
    x: { display: false },
    y: { display: false }
  }
}

</script>

<template>
  <div style="height: 40px;">
    <Line :data="chartData" :options="options" />
  </div>
</template>

<style>
canvas {
  width: 150px !important
}
</style>