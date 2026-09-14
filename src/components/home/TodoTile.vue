<script setup>
import { computed } from 'vue'
import Icon from '../Icon.vue'
import { useStore } from '../../store'
const { data, CONFIG, toggleViewCheck, openEditor, go } = useStore()
const prios = computed(() => {
  const m = CONFIG.modules.find(x => x.key === 'todo')
  const map = {}; (m.priorities || []).forEach(p => map[p.key] = p)
  return map
})
const it = computed(() => data.todo || [])
const done = computed(() => it.value.filter(x => x.done).length)
const pct = computed(() => it.value.length ? Math.round(done.value / it.value.length * 100) : 0)
</script>

<template>
  <div class="tile b5">
    <div class="tile-h">
      <span class="tic"><Icon name="list" :size="16" /></span>
      <div class="tt"><span class="en">TODO LIST</span><span class="zh">待办清单</span></div>
      <span class="r" style="cursor:pointer" @click="go('todo')">查看全部</span>
    </div>
    <div class="tk-head">
      <span class="pct">{{ done }}<span style="color:var(--text-secondary)">/{{ it.length }}</span></span>
      <span class="cnt">完成 {{ pct }}%</span>
      <span class="bar"><i :style="{ width: pct + '%' }"></i></span>
    </div>
    <div class="tk-list">
      <div v-if="it.length" v-for="x in it" :key="x.id" class="tk-row">
        <div class="tk-chk" :class="x.done ? 'on' : ''" @click.stop="toggleViewCheck('todo', x.id)">
          <Icon name="check" :size="12" :sw="3" /></div>
        <span class="tk-name" :class="x.done ? 'done' : ''" @click="openEditor('todo', x)">{{ x.title }}</span>
        <span v-if="prios[x.priority]" class="badge"
          :style="{ background: prios[x.priority].color, color: prios[x.priority].text }">
          <span class="dot"></span>{{ prios[x.priority].label }}</span>
      </div>
      <div v-else class="focus-empty">还没有待办，去「今日计划」添加吧</div>
    </div>
  </div>
</template>