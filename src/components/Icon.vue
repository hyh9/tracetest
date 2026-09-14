<script setup>
import { computed } from 'vue'
import { ICONS } from '../config'
const props = defineProps({
  name: { type: String, default: 'grid' },
  size: { type: [Number, String], default: 22 },
  sw: { type: [Number, String], default: 1.7 }
})
const path = computed(() => ICONS[props.name] || ICONS.grid)
</script>

<template>
  <svg viewBox="0 0 24 24" :width="size" :height="size" fill="none" stroke="currentColor"
    :stroke-width="sw" stroke-linecap="round" stroke-linejoin="round" v-html="path"></svg>
</template>