<template>
  <q-table :rows="coins" :columns="columns" row-key="id" :loading="loading" :grid="cardState" flat bordered
    virtual-scroll color="light-blue" @row-click="onRowClick">
    <template v-slot:top>
      <div class="row justify-between w-full">
        <label class="text-lg font-medium q-mr-md"><span class="text-light-blue text-xl">#</span> Coin Market
          Table</label>
        <div class="row items-end q-gutter-md">
          <q-input color="light-blue" dense placeholder="Search coins..." v-model="searchQuery" />
          <q-btn flat dense icon="filter_alt" color="light-blue" @click="filterDialog = true" />
          <q-btn flat dense icon="restart_alt" color="light-blue" @click="resetFilter" />
          <q-btn-toggle v-model="cardState" toggle-color="light-blue" unelevated size="sm"
            style="border: 1px solid lightgrey;" :options="[
              { icon: 'grid_view', value: true },
              { icon: 'list', value: false }
            ]" />
        </div>
      </div>
    </template>
    <template v-slot:body-cell-name="props">
      <q-td :props="props">
        <div class="row items-center q-gutter-sm">
          <img :src="props.row.image" width="20" />
          <div>
            <div>{{ props.row.name }}</div>
            <div class="text-caption text-grey">
              {{ props.row.symbol.toUpperCase() }}
            </div>
          </div>
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-price="props">
      <q-td :props="props">
        ${{ props.row.current_price?.toLocaleString?.() ?? '-' }}
      </q-td>
    </template>
    <template v-slot:body-cell-change="props">
      <q-td :props="props">
        <span :class="props.row.price_change_percentage_24h > 0
          ? 'text-positive'
          : 'text-negative'">
          {{ props.row.price_change_percentage_24h?.toFixed?.(2) ?? '0.00' }}%
        </span>
      </q-td>
    </template>
    <template v-slot:body-cell-sparkline="props">
      <q-td>
        <line-chart v-if="props.col.field === 'sparkline_in_24h'" :data="props.row.charts['1d'] || []"
          :color="getGraphColor(props.row.trends['1d'])"  />
        <line-chart v-else-if="props.col.field === 'sparkline_in_7d'" :data="props.row.charts['7d'] || []"
          :color="getGraphColor(props.row.trends['7d'])" />
      </q-td>
    </template>
    <template v-slot:item="props">
      <q-card rounded bordered flat class="q-pa-md text-grey-8 relative w-1/3">
        <div class="row items-center q-gutter-x-sm">
          <img :src="props.row.image" width="24" class="rounded-circle" />
          <div class="column">
            <div class="text-lg font-medium">{{ props.row.name }}</div>
            <div class="text-caption text-grey">{{ props.row.symbol.toUpperCase() }}</div>
          </div>
        </div>
        <q-separator spaced class="q-my-sm" />
        <div v-if="props.row.sparkline_in_7d" class="q-mb-sm">
          <line-chart :data="props.row.charts['7d']" :color="getGraphColor(props.row.trends['7d'])"/>
        </div>
        <div class="row justify-between items-center q-mt-sm">
          <div class="column">
            <div class="text-sm text-grey-7">Current Price</div>
            <div class="text-base font-medium">${{ props.row.current_price }}</div>
          </div>
          <div class="column items-end">
            <div class="text-sm text-grey-7">24h Change</div>
            <div :style="`color: getGraphColor(${props.row.trends['1d']})`">
              {{ props.row.price_change_percentage_24h }}
            </div>
          </div>
        </div>
        <div class="row justify-between items-center q-mt-sm text-caption text-grey">
          <div>Market Cap: ${{ props.row.market_cap }}</div>
          <div>Volume: ${{ props.row.total_volume }}</div>
        </div>
      </q-card>
    </template>
    <template v-slot:loading>
      <div class="full-width flex flex-center q-pa-lg">
        <q-card v-if="!loading" rounded class="column items-center justify-center q-pa-xl text-grey-7 relative w-full"
          style="min-width: 280px; max-width: 420px;">
          <q-spinner color="light-blue" size="3em" :thickness="10" />
          <div class="text-h6 text-weight-medium q-mb-xs">
            Data Loading ...
          </div>
        </q-card>
      </div>
    </template>
    <template v-slot:no-data>
      <div class="full-width flex flex-center q-pa-lg">
        <q-card rounded class="column items-center justify-center q-pa-xl text-grey-7 insight-card relative w-full"
          style="min-width: 280px; max-width: 420px;">
          <q-icon name="insights" size="48px" class="q-mb-md text-grey-5" />
          <div class="text-h6 text-weight-medium q-mb-xs">
            No Data Found
          </div>
          <div class="text-body2 text-grey-5 text-center q-mb-md">
            Try adjusting your search or filters
          </div>
          <q-btn flat color="light-blue" label="Reset Filters" @click="resetFilter()" />
        </q-card>
      </div>
    </template>
  </q-table>
  <q-dialog v-model="filterDialog" persistent>
    <q-card rounded bordered class="q-pa-md text-grey-8 w-full filter-card">
      <div class="row items-center justify-between q-gutter-x-sm">
        <div class="text-lg font-medium text-light-blue-8">Apply Filter</div>
        <q-icon name="close" color="grey" size="sm" @click="filterDialog = false" />
      </div>
      <q-separator spaced class="q-mt-sm q-mb-sm" />
      <div class="row items-center q-col-gutter-x-md q-mb-xl">
        <label class="col-4">Market Change: </label>
        <q-select class="col-8" v-model="filterOptions.change" :options="changeOptions" dense color="light-blue" />
      </div>
      <div class="row items-center q-col-gutter-x-md q-mb-xl">
        <label class="col-4">Market Cap Range: </label>
        <q-range class="col-8" v-model="filterOptions.marketCapRange" :min="marketCapRangeOption.min"
          :max="marketCapRangeOption.max" :step="marketCapRangeOption.step" label color="light-blue" />
      </div>
      <div class="row items-center q-col-gutter-x-md q-mb-xl">
        <label class="col-4">Volume Range: </label>
        <q-range class="col-8" v-model="filterOptions.volumeRange" :min="volumeRangeOption.min"
          :max="volumeRangeOption.max" :step="volumeRangeOption.step" label color="light-blue" />
      </div>
      <div class="row items-center q-col-gutter-x-md">
        <label class="col-4">Price Range: </label>
        <q-range class="col-8" v-model="filterOptions.priceRange" :min="priceRangeOption.min"
          :max="priceRangeOption.max" :step="priceRangeOption.step" label color="light-blue" />
      </div>
      <q-separator spaced class="q-mt-sm q-mb-sm" />
      <q-btn unelevated label="Apply" color="light-blue-8" @click="applyFilter()" />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { debounce } from 'quasar'
import { useCoinStore } from 'src/stores/coinStore'
import { Coin } from 'src/types/coin';

const marketStore = useCoinStore()

const onRowClick = (evt: Event, row:Coin) => {
  marketStore.setSelectedCoin(row)
}

const props = defineProps<{
  coins: any[]
  search: string
}>()

const loading = computed(() => {
  return !props.coins.length
})

const columns = [
  { name: 'rank', label: '#', field: 'market_cap_rank', sortable: true },
  { name: 'name', label: 'Coin', field: 'name', sortable: true },
  { name: 'price', label: 'Price', field: 'current_price', sortable: true },
  { name: 'change', label: '24h %', field: 'price_change_percentage_24h', sortable: true },
  { name: 'market_cap', label: 'Market Cap', field: 'market_cap', sortable: true },
  { name: 'volume', label: 'Volume', field: 'total_volume', sortable: true },
  { name: 'sparkline', label: '24h Sparkline', field: 'sparkline_in_24h' },
  { name: 'sparkline', label: '7d Sparkline', field: 'sparkline_in_7d' }
]

const getGraphColor = (trend: string) => {
  switch (trend) {
    case 'bullish':
      return '#5ea500'
    case 'bearish':
      return '#e7000b'
    case 'neutral':
    default:
      return '#999999'
  }
}

const cardState = ref(false)

const searchQuery = ref('')
watch(searchQuery, debounce(val => emit('update:search', val), 300))

const emit = defineEmits(['update:search', 'update:filterOptions'])

const filterDialog = ref(false)

const filterOptions = ref({
  change: '',
  priceRange: {
    min: 0,
    max: 0,
  },
  marketCapRange: {
    min: 0,
    max: 0,
  },
  volumeRange: {
    min: 0,
    max: 0,
  },

})

const changeOptions = ['All', 'Gainers', 'Losers']

const priceRangeOption = ref({
  min: 0,
  max: 100000,
  step: 100
})

const marketCapRangeOption = ref({
  min: 0,
  max: 100000,
  step: 10000
})

const volumeRangeOption = ref({
  min: 0,
  max: 100000,
  step: 10000
})

watch(
  () => props.coins,
  (newCoins) => {
    if (!newCoins || newCoins.length === 0) return

    const prices = newCoins.map(c => c.current_price)
    const marketCaps = newCoins.map(c => c.market_cap)
    const volumes = newCoins.map(c => c.total_volume)

    priceRangeOption.value.min = Math.floor(Math.min(...prices))
    priceRangeOption.value.max = Math.ceil(Math.max(...prices))

    marketCapRangeOption.value.min = Math.floor(Math.min(...marketCaps))
    marketCapRangeOption.value.max = Math.ceil(Math.max(...marketCaps))

    volumeRangeOption.value.min = Math.floor(Math.min(...volumes))
    volumeRangeOption.value.max = Math.ceil(Math.max(...volumes))

    priceRangeOption.value.step = Math.ceil((priceRangeOption.value.max - priceRangeOption.value.min) / 40)
    marketCapRangeOption.value.step = Math.ceil((marketCapRangeOption.value.max - marketCapRangeOption.value.min) / 40)
    volumeRangeOption.value.step = Math.ceil((volumeRangeOption.value.max - volumeRangeOption.value.min) / 40)
  },
  { deep: true, immediate: true }
)

const applyFilter = () => {
  emit('update:filterOptions', filterOptions.value)
  filterDialog.value = false
}

const resetFilter = () => {
  searchQuery.value = ''
  emit('update:search', '')

  filterOptions.value.change = ''
  filterOptions.value.priceRange = {
    min: 0,
    max: 0
  }
  filterOptions.value.marketCapRange = {
    min: 0,
    max: 0
  }
  filterOptions.value.volumeRange = {
    min: 0,
    max: 0
  }
  emit('update:filterOptions', filterOptions.value)
}
</script>