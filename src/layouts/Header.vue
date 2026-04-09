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

const themeColor = inject('themeColor')

const colorOptions = [
    'red',
    'pink',
    'purple',
    'deep-purple',
    'indigo',
    'blue',
    'light-blue',
    'cyan',
    'teal',
    'green',
    'lime',
    'yellow',
    'amber',
    'orange',
    'deep-orange',
    'brown',
    'grey',
    'blue-grey'
]

const language = ref('en')

const toggleLanguage = () => {
    language.value = language.value === 'en' ? 'hi' : 'en'
}
</script>

<template>
    <q-header elevated :class="`bg-${themeColor} text-white`">
        <q-toolbar>
            <q-toolbar-title class="row">
                <div style="width: 180px">
                    <q-img :src="logo" />
                </div>
            <q-input dense outlined debounce="300" v-model="searchQuery" placeholder="Search coin..."
                label-color="white" color="white" class="q-ml-md" input-class="text-white" style="width: 250px">
                <template #append>
                    <q-icon color="white" name="search" />
                </template>
            </q-input>
            </q-toolbar-title>
            <q-space />
            <q-select dense outlined v-model="themeColor" :options="colorOptions" label="Theme" label-color="white" input-class="text-white" class="q-mr-md"
                style="width: 140px" />
            <q-btn flat round :icon="isDark ? 'dark_mode' : 'light_mode'" @click="toggleTheme" class="q-mr-sm" />
            <q-btn flat round label="EN/HI" @click="toggleLanguage" class="q-mr-sm" />
        </q-toolbar>
    </q-header>
</template>