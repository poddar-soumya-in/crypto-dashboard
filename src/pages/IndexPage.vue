<template>
  <q-page class="column items-evenly justify-start">
    <div class="full-width full-height column q-pa-md">
      <globalInsights />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import globalInsights from 'src/components/globalInsights.vue';
</script>
