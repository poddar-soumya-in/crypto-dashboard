<template>
    <div class="row h-full" :class="`${contentClass}`">
        <q-card rounded bordered class="column q-pa-xs text-grey-8 list-card w-full q-mr-sm q-mb-sm" :style="cardStyle"
            style="min-width: unset">
            <div v-if="title">
                <div class="text-base font-medium q-px-xs" :class="`text-${color}`">{{ title }}</div>
                <div class="text-xs font-medium q-px-xs text-grey-6">{{ subtitle }}</div>
            </div>
            <slot />
        </q-card>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { colors } from 'quasar'

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    subtitle: {
        type: String,
        default: ''
    },
    contentClass: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: 'blue'
    }
})

const { getPaletteColor, hexToRgb } = colors

const borderColor = computed(() => getPaletteColor(`${props.color}-2`))

const hoverShadowColor = computed(() => {
    const { r, g, b } = hexToRgb(getPaletteColor(`${props.color}-2`))
    return `rgba(${r}, ${g}, ${b}, 0.4)`
})

const cardStyle = computed(() => ({
    borderColor: borderColor.value,
    '--hover-color': hoverShadowColor.value
}))
</script>