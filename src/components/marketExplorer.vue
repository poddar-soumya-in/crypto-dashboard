<template>
  <div class="row">
    <div class="col-8 q-pr-sm">
      <marketTable :coins="coins" :search="effectiveSearch" @update:search="val => localSearch = val"
        @update:filterOptions="applyFilter" />
    </div>
    <div class="col-4 row">
      <uiCard title="Market Cap Distribution" contentClass="col-6 graph-card" color="orange">
        <pie-chart label="Market Cap" :data="marketCapDistribution" />
      </uiCard>
      <uiCard title="Volume vs Price" contentClass="col-6 graph-card" color="lime">
        <plot-chart :data="scatterData" />
      </uiCard>
      <uiCard title="Avg Market vs BTC Movement" contentClass="col-12 graph-card" color="blue">
        <co-line-chart :data="correlationData" />
      </uiCard>
      <uiCard title="How Coins Performed Today" contentClass="col-12 graph-card" color="deep-purple">
        <histo-gram :data="performanceBuckets" />
      </uiCard>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, inject, watch, onMounted } from 'vue'
import { useMarketTable } from 'src/composables/useMarketTable'
import { useMarketDataInsights } from 'src/composables/useMarketDataInsights'

const {
  coins,
  fetchCoins,
  search: localSearch,
  setFilters
} = useMarketTable()

const {
  marketCapDistribution,
  performanceBuckets,
  scatterData,
  correlationData
} = useMarketDataInsights(coins)

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
<style>
.graph-card {
  height: 215px !important;
}
</style>