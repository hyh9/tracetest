<script setup>
import { computed } from 'vue'
import Icon from '../components/Icon.vue'
import { useStore } from '../store'
import { dateStr, today, avgProgress } from '../utils'
const { CONFIG, data, go } = useStore()

const cards = computed(() => CONFIG.modules.map(m => {
  const it = data[m.key] || []
  let main = '', pct = 0
  if (m.type === 'todo') {
    const done = it.filter(x => x.done).length
    main = `${done}/${it.length} 已完成`; pct = it.length ? Math.round(done / it.length * 100) : 0
  } else if (m.type === 'checkin') {
    const t = today(); const done = it.filter(x => x.log && x.log[t]).length
    main = `今日 ${done}/${it.length} 打卡`; pct = it.length ? Math.round(done / it.length * 100) : 0
  } else if (m.type === 'progress') {
    const p = avgProgress(it); pct = p.value; main = `平均进度 ${pct}%`
  } else if (m.type === 'finance') {
    const e = it.filter(x => x.type === 'expense').reduce((a, x) => a + +x.amount, 0)
    const inc = it.filter(x => x.type === 'income').reduce((a, x) => a + +x.amount, 0)
    main = `收 ¥${inc} · 支 ¥${e}`
  } else main = `${it.length} 条记录`
  return { m, main, pct }
}))
</script>

<template>
  <div>
    <div class="header">
      <div><h2>洞察</h2><p>各模块进展一览 · 记录—执行—统计—反馈</p></div>
      <div class="spacer"></div>
      <span class="date-chip"><Icon name="calendar" :size="14" /> {{ dateStr() }}</span>
    </div>
    <div class="sec-title">模块概况</div>
    <div class="pin-list" style="grid-template-columns:repeat(3,1fr)">
      <div v-for="{ m, main, pct } in cards" :key="m.key" class="pin" style="cursor:pointer" @click="go(m.key)">
        <span class="pin-ic" :style="{ color: m.color, background: m.tint, borderColor: 'transparent' }"><Icon :name="m.icon" :size="19" /></span>
        <div class="pin-b">
          <div class="pin-t">{{ m.name }}</div>
          <div class="pin-m">{{ main }}</div>
          <div v-if="['progress', 'todo', 'checkin'].includes(m.type)" class="hero-bar" style="margin-top:9px">
            <i :style="{ width: pct + '%', background: m.color }"></i>
          </div>
        </div>
        <span class="arw" style="color:var(--text-tertiary)"><Icon name="chevron" :size="16" :sw="2" /></span>
      </div>
    </div>
  </div>
</template>