<script setup>
import { ref, inject } from 'vue'
import { useQuasar } from 'quasar'

import logo from './../assets/img/logo.png'

const $q = useQuasar()
const searchQuery = inject('searchQuery')

const isDark = ref($q.dark.isActive)

const toggleTheme = () => {
    $q.dark.toggle()
    isDark.value = $q.dark.isActive
}

const language = ref('en')

const toggleLanguage = () => {
    language.value = language.value === 'en' ? 'hi' : 'en'
}
</script>

<template>
    <q-header elevated class="bg-light-blue-13 text-white">
        <q-toolbar>
            <q-toolbar-title>
                <div style="width: 180px">
                    <q-img :src="logo" />
                </div>
            </q-toolbar-title>
            <q-space />
            <q-input dense outlined debounce="300" v-model="searchQuery" placeholder="Search coin..."
                label-color="white" color="white" class="q-mr-md" input-class="text-white" style="width: 250px">
                <template #append>
                    <q-icon color="white" name="search" />
                </template>
            </q-input>
            <q-btn flat round :icon="isDark ? 'dark_mode' : 'light_mode'" @click="toggleTheme" class="q-mr-sm" />
            <q-btn flat round label="EN/HI" @click="toggleLanguage" />
            <q-btn flat round icon="more_vert" @click="$emit('toggleDrawer')"></q-btn>

        </q-toolbar>
    </q-header>
</template>