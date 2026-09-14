<script setup>
import { computed } from 'vue'
import Icon from '../Icon.vue'
import { useStore } from '../../store'
const { data, go } = useStore()
const colors = ['var(--module-2)', 'var(--module-1)', 'var(--module-3)', 'var(--module-4)', 'var(--module-5)']
const all = computed(() => data.read || [])
const pct = x => Math.min(100, Math.round((x.current / x.target) * 100 || 0))
</script>

<template>
  <div class="tile b4">
    <div class="tile-h">
      <span class="tic"><Icon name="book" :size="16" /></span>
      <div class="tt"><span class="en">CURRENTLY READING</span><span class="zh">在读好书</span></div>
      <span class="r">{{ all.length }} 本</span>
    </div>
    <div class="book-list">
      <template v-if="all.length">
        <div v-for="(x, i) in all" :key="x.id" class="book-row" @click="go('read')">
          <span class="spine" :style="{ background: colors[i % colors.length] }"><Icon name="book" :size="16" /></span>
          <div class="bmid">
            <div class="btt">{{ x.title }}</div>
            <div class="bsub">{{ x.note ? x.note : x.current + '/' + x.target + ' ' + (x.unit || '页') }}</div>
            <div class="bbar"><i :style="{ width: pct(x) + '%', background: colors[i % colors.length] }"></i></div>
          </div>
          <span class="bpct" :style="{ color: colors[i % colors.length] }">{{ pct(x) }}%</span>
        </div>
      </template>
      <div v-else class="focus-empty">还没有在读书籍，去「阅读打卡」添加吧</div>
    </div>
  </div>
</template>