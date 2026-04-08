<template>
  <q-layout view="hHr lpR fFr">
    <layout-header @toggle-drawer="toggleRightDrawer" />

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import layoutHeader from './Header.vue'

const searchQuery = ref('')
provide('searchQuery', searchQuery)

const rightDrawerOpen = ref<boolean>(false)

function toggleRightDrawer(): void {
  rightDrawerOpen.value = !rightDrawerOpen.value
}
</script>