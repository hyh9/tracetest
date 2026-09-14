<script setup>
import { computed } from 'vue'
import Icon from '../Icon.vue'
import { useStore } from '../../store'
const { data, go } = useStore()
const colors = ['var(--module-3)', 'var(--module-1)', 'var(--module-2)', 'var(--module-4)', 'var(--module-5)']
const all = computed(() => data.sport || [])
const pct = x => Math.min(100, Math.round((x.current / x.target) * 100 || 0))
</script>

<template>
  <div class="tile b4">
    <div class="tile-h">
      <span class="tic"><Icon name="activity" :size="16" /></span>
      <div class="tt"><span class="en">WEEKLY GOALS</span><span class="zh">本周目标</span></div>
      <span class="r" style="cursor:pointer" @click="go('sport')">{{ all.length }} 项</span>
    </div>
    <div class="book-list">
      <template v-if="all.length">
        <div v-for="(x, i) in all" :key="x.id" class="book-row">
          <span class="spine" :style="{ background: colors[i % colors.length] }"><Icon name="activity" :size="16" /></span>
          <div class="bmid">
            <div class="btt"><span v-if="pct(x) >= 100" style="color:var(--module-1);display:inline-flex;vertical-align:-2px;margin-right:3px"><Icon name="check" :size="13" :sw="2.6" /></span>{{ x.title }}</div>
            <div class="bsub">{{ x.current }}/{{ x.target }} {{ x.unit || '次' }}</div>
            <div class="bbar"><i :style="{ width: pct(x) + '%', background: colors[i % colors.length] }"></i></div>
          </div>
          <span class="bpct" :style="{ color: colors[i % colors.length] }">{{ pct(x) }}%</span>
        </div>
      </template>
      <div v-else class="focus-empty">还没有锻炼目标，去「每日锻炼」添加吧</div>
    </div>
  </div>
</template>