<template>
    <div class="row">
        <q-card rounded bordered class="column q-pa-md text-grey-8 w-full insight-card relative"
            :style="bindStyleProps">
            <div class="row items-end q-gutter-x-sm">
                <q-icon :name="metric.icon" :color="color" size="md" />
                <div class="text-lg font-medium">{{ metric.label }}</div>
            </div>
            <div class="text-4xl font-bold" :class="`text-${color}`">{{ metric.valueFormatted }}</div>
            <div v-if="metric.change" class="row items-end q-gutter-x-sm">
                <div class="text-grey-9">{{ metric.changeFormatted }}</div>
                <q-icon :name="trendConfig[metric.trend].icon"
                    :color="metric.trend === 'up' ? 'green' : metric.trend === 'down' ? 'red' : 'grey'" size="xs" />
            </div>
            <div class="text-sm" :style="{ marginTop: !metric.change ? '21px' : '' }">{{ metric.insight }}</div>
            <div class="absolute absolute-bottom-right q-pr-md q-pb-lg">
                <slot />
            </div>
        </q-card>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { colors } from 'quasar'

const props = defineProps({
    metric: {
        type: Object,
        required: true
    },
    color: {
        type: String,
        default: 'blue'
    }
})

const { getPaletteColor, hexToRgb } = colors

const borderColor = computed(() => {
    return getPaletteColor(`${props.color}-2`)
})

const hoverShadowColor = computed(() => {
    const { r, g, b } = hexToRgb(getPaletteColor(`${props.color}-2`))
    return `rgba(${r}, ${g}, ${b}, 0.4)`
})

const bindStyleProps = computed(() => {
    return {
        borderColor: borderColor.value,
        '--hover-color': hoverShadowColor.value
    }
})

const trendConfig = {
    up: {
        icon: 'arrow_upward',
        color: 'positive'
    },
    down: {
        icon: 'arrow_downward',
        color: 'negative'
    },
    neutral: {
        icon: 'remove',
        color: 'grey'
    }
}
</script>
<style>
.insight-card {
    box-shadow: none;
    min-width: 250px;
}

.insight-card:hover {
    box-shadow: 10px 10px 20px 0 var(--hover-color);
}
</style>