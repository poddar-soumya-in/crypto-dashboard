<template>
  <div class="row">
    <div class="col-8 q-pr-md">
      <marketTable
        :coins="coins"
        :search="effectiveSearch"
        @update:search="val => localSearch = val"
        @update:filterOptions="applyFilter"
      />
    </div>
    <div class="col-4">
    </div>
  </div>
</template>
<script setup>
import { ref, computed, inject, watch, onMounted } from 'vue'
import { useMarketTable } from 'src/composables/useMarketTable'

const {
  coins,
  fetchCoins,
  search: localSearch,
  setFilters
} = useMarketTable()

const globalSearch = inject('searchQuery', '')
watch(globalSearch, (val) => {
  localSearch.value = val || ''
}, { immediate: true })

const effectiveSearch = computed(() => {
  return localSearch.value || globalSearch.value
})

const applyFilter = (filter) => {
  setFilters(filter)
}

onMounted(() => {
  fetchCoins()
})
</script>