<script setup>
import { computed } from 'vue'
import Icon from '../Icon.vue'
import { useStore } from '../../store'
import { today, streak } from '../../utils'
const { CONFIG, data, toggleViewCheck, stepProgress, openEditor } = useStore()

const pins = computed(() => {
  const out = []
  CONFIG.modules.forEach(m => (data[m.key] || []).forEach(x => { if (x.pinned) out.push({ m, x }) }))
  return out
})

const sub = (m, x) => {
  if (m.type === 'checkin') return `${m.name} · 连续 ${streak(x.log)} 天`
  if (m.type === 'progress') { const p = Math.min(100, Math.round((x.current / x.target) * 100 || 0)); return `${m.name} · ${x.current}/${x.target} ${x.unit || m.unit || ''} · ${p}%` }
  return m.name
}
</script>

<template>
  <div class="tile b4">
    <div class="tile-h">
      <span class="tic"><Icon name="star" :size="16" /></span>
      <div class="tt"><span class="en">TODAY'S FOCUS</span><span class="zh">今日聚焦</span></div>
      <span class="r">{{ pins.length }} 项</span>
    </div>
    <div class="focus-list">
      <template v-if="pins.length">
        <div v-for="{ m, x } in pins" :key="m.key + x.id" class="focus-row">
          <span class="fic" :style="{ color: m.color }"><Icon :name="m.icon" :size="16" /></span>
          <div class="ft" @click.stop="openEditor(m.key, x)">
            <div class="fn" :class="{ done: m.type === 'todo' && x.done }">{{ x.title }}</div>
            <div class="fm">{{ sub(m, x) }}</div>
          </div>
          <div v-if="m.type === 'checkin'" class="pin-chk" :class="{ on: x.log && x.log[today()] }" @click.stop="toggleViewCheck(m.key, x.id)"><Icon name="check" :size="13" :sw="2.6" /></div>
          <div v-else-if="m.type === 'todo'" class="pin-chk" :class="{ on: x.done }" @click.stop="toggleViewCheck(m.key, x.id)"><Icon name="check" :size="13" :sw="2.6" /></div>
          <div v-else-if="m.type === 'progress'" class="pin-step">
            <button @click.stop="stepProgress(m.key, x.id, -1)">−</button>
            <button @click.stop="stepProgress(m.key, x.id, 1)">+</button>
          </div>
          <span v-else style="color:var(--text-tertiary)"><Icon name="chevron" :size="16" :sw="2" /></span>
        </div>
      </template>
      <div v-else class="focus-empty">
        在任意模块点击 <span style="display:inline-flex;color:var(--module-3);vertical-align:-2px"><Icon name="star" :size="13" /></span> 即可把要事置顶到这里。
      </div>
    </div>
  </div>
</template>