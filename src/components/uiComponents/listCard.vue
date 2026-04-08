<template>
    <div class="row h-full">
        <q-card rounded bordered class="column q-pa-md text-grey-8 w-full list-card relative" :style="cardStyle">
            <div class="row items-center q-gutter-x-sm">
                <q-icon :name="list.icon" :color="color" size="md" />
                <div class="text-lg font-medium">{{ list.label }}</div>
            </div>
            <q-separator inset spaced />
            <div v-for="item in list.items" :key="item.id" class="row justify-between items-center q-mt-sm">
                <div class="row items-center q-gutter-x-sm">
                    <img v-if="item.image" :src="item.image" width="18" />
                    <div class="text-base">{{ item.name }}</div>
                </div>
                <div class="row items-center q-gutter-x-xs"
                    >
                    <div class="text-caption text-grey">
                        {{ item.symbol?.toUpperCase() }}
                    </div>
                    <div v-if="item.change != null" class="text-sm" :class="getTrendColor(item.change)">
                        {{ formatPercentage(item.change) }}
                    </div>
                    <q-icon v-if="item.change != null" :name="getTrendIcon(item.change)" size="xs" :class="getTrendColor(item.change)"/>
                </div>
            </div>
            <div class="absolute absolute-bottom-right q-pr-md q-pb-lg">
                <slot />
            </div>
        </q-card>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { colors } from 'quasar'

const props = defineProps({
    list: {
        type: Object,
        required: true
    },
    color: {
        type: String,
        default: 'blue'
    }
})

const { getPaletteColor, hexToRgb } = colors

// 🎨 Styles
const borderColor = computed(() => getPaletteColor(`${props.color}-2`))

const hoverShadowColor = computed(() => {
    const { r, g, b } = hexToRgb(getPaletteColor(`${props.color}-2`))
    return `rgba(${r}, ${g}, ${b}, 0.4)`
})

const cardStyle = computed(() => ({
    borderColor: borderColor.value,
    '--hover-color': hoverShadowColor.value
}))

// 🔥 Helpers
const getTrendIcon = (change) => {
    if (change > 0) return 'arrow_upward'
    if (change < 0) return 'arrow_downward'
    return 'remove'
}

const getTrendColor = (change) => {
    if (change > 0) return 'text-positive'
    if (change < 0) return 'text-negative'
    return 'text-grey'
}

const formatPercentage = (val) => {
    if (val == null) return '-'
    return `${val > 0 ? '+' : ''}${val.toFixed(2)}%`
}
</script>

<style>
.list-card {
    box-shadow: none;
    min-width: 220px;
    border-width: 1.5px;
    background-image: linear-gradient(to bottom right, #ffffff00, #f9fafb11);
}

.list-card:hover {
    box-shadow: 10px 10px 20px 0 var(--hover-color);
}
</style>