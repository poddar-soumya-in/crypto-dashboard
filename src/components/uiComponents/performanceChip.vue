<template>
  <div :class="getClass">
    {{ label }}: {{ value?.toFixed(2) }}%
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  label: String,
  value: Number
})

const getClass = computed(() =>
  props.value > 0 ? 'text-positive' : 'text-negative'
)
</script>