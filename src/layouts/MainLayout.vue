<template>
  <q-layout view="hHr lpR fFr">

    <layout-header @toggle-drawer="toggleRightDrawer" />

    <q-drawer
      v-model="rightDrawerOpen"
      side="right"
      bordered
      overlay
      elevated
      :width="drawerWidth"
    >
      <div v-if="coinStore.selectedCoin" class="q-pa-md">
       <coin-detail-drawer />
      </div>
      <div v-else class="q-pa-md text-grey text-center">
        No coin selected
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, provide, watch, computed } from 'vue'
import layoutHeader from './Header.vue'
import { useCoinStore } from 'src/stores/coinStore'
import { useQuasar } from 'quasar'

const searchQuery = ref('')
provide('searchQuery', searchQuery)

const themeColor = ref('light-blue')
provide('themeColor', themeColor)

const coinStore = useCoinStore()

const rightDrawerOpen = ref(false)

watch(
  () => coinStore.selectedCoin,
  (coin) => {
    rightDrawerOpen.value = !!coin
  },
  { immediate: true }
)

watch(rightDrawerOpen, (open) => {
  if (!open) {
    coinStore.setSelectedCoin(null)
  }
})

const $q = useQuasar()

const drawerWidth = computed(() => {
  return Math.round(window.innerWidth * 0.9)
})

function toggleRightDrawer(): void {
  if (!coinStore.selectedCoin) return
  rightDrawerOpen.value = !rightDrawerOpen.value
}
</script>