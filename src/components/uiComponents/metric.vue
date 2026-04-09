<template>
  <div>
    <div class="text-caption text-grey">{{ label }}</div>
    <div class="text-body2 font-medium">${{ value }}</div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: String
})
</script>