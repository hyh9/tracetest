<script setup>
import { computed } from 'vue'
import Icon from '../components/Icon.vue'
import RecCard from '../components/RecCard.vue'
import SideStats from '../components/SideStats.vue'
import { useStore } from '../store'
import { modOf } from '../store'
import { dateStr, today, avgProgress } from '../utils'
const { data, view, searchQ, go, openEditor } = useStore()

const m = computed(() => modOf(view.value))
const all = computed(() => data[view.value] || [])
const filtered = computed(() => {
  const q = searchQ.value.trim().toLowerCase()
  if (!q) return all.value
  return all.value.filter(x => (x.title || '').toLowerCase().includes(q) || (x.note || x.content || '').toLowerCase().includes(q))
})

const summary = computed(() => {
  switch (m.value.type) {
    case 'finance': {
      const inc = all.value.filter(x => x.type === 'income').reduce((a, x) => a + +x.amount, 0)
      const exp = all.value.filter(x => x.type === 'expense').reduce((a, x) => a + +x.amount, 0)
      return { kind: 'finance', inc, exp }
    }
    case 'todo': {
      const done = all.value.filter(x => x.done).length
      return { kind: 'hero', big: `${done}/${all.value.length}`, label: '今日已完成' }
    }
    case 'checkin': {
      const t = today(); const done = all.value.filter(x => x.log && x.log[t]).length
      return { kind: 'hero', big: `${done}/${all.value.length}`, label: '今日已打卡' }
    }
    case 'progress': {
      const p = avgProgress(all.value)
      return { kind: 'hero', big: `${p.value}%`, label: `平均进度 · ${all.value.length} 项` }
    }
    default: {
      const t = today(); const todayN = all.value.filter(x => x.date === t).length
      return { kind: 'hero', big: `${all.value.length}`, label: `条记录 · 今日 ${todayN} 条`, noIcon: true }
    }
  }
})
</script>

<template>
  <div>
    <div class="header">
      <div><h2>{{ m.name }}</h2><p>{{ m.desc }}</p></div>
      <div class="spacer"></div>
      <span class="date-chip"><Icon name="calendar" :size="14" /> {{ dateStr() }}</span>
    </div>
    <div class="toolbar">
      <div class="search-box"><Icon name="search" :size="15" :sw="2.2" /><input v-model="searchQ" placeholder="搜索…" /></div>
      <div class="spacer"></div>
      <button class="btn" @click="openEditor(m.key, null)"><Icon name="plus" :size="16" :sw="2.2" />新建</button>
    </div>

    <!-- module summary -->
    <template v-if="summary.kind === 'finance'">
      <div class="mod-summary">
        <div class="mini"><div class="l">收入</div><div class="v" style="color:var(--module-1)">¥{{ summary.inc }}</div></div>
        <div class="mini"><div class="l">支出</div><div class="v" style="color:var(--danger)">¥{{ summary.exp }}</div></div>
        <div class="mini"><div class="l">结余</div><div class="v">¥{{ summary.inc - summary.exp }}</div></div>
        <div class="mini"><div class="l">笔数</div><div class="v">{{ all.length }}</div></div>
      </div>
    </template>
    <div v-else class="hero">
      <div class="hero-ic" :style="{ background: m.tint, color: m.color }"><Icon :name="m.icon" :size="24" /></div>
      <div class="hero-tx"><div class="hero-row"><span class="hero-v">{{ summary.big }}</span><span class="hero-l">{{ summary.label }}</span></div></div>
    </div>

    <div class="mod-layout">
      <div class="mod-main">
        <div class="sec-title">全部记录 <span style="margin-left:auto;font-weight:500;color:var(--text-secondary);font-size:12px">{{ filtered.length }} 条</span></div>
        <div class="rec-grid">
          <RecCard v-for="x in filtered" :key="x.id" :m="m" :x="x" />
          <div v-if="!filtered.length" class="empty"><span class="e"><Icon :name="m.icon" :size="28" /></span>
            <div>{{ searchQ ? '没有匹配的记录' : '还没有记录，点右上角「新建」添加第一条吧' }}</div></div>
        </div>
      </div>
      <aside class="mod-side"><SideStats :m="m" :all="all" /></aside>
    </div>
  </div>
</template>