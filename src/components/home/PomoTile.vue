<script setup>
import { computed } from 'vue'
import { useStore } from '../../store'
const { data, pomo, pomoText, pomoOffset, togglePomo, resetPomo } = useStore()
const p = computed(() => data.__pomo || { count: 0, min: 0 })
const r = 64, c = 2 * Math.PI * r
</script>

<template>
  <div class="pomo b4">
    <div><div class="pen">POMODORO · 25 / 5</div><div class="pzh">专注番茄钟</div></div>
    <div class="ring-wrap">
      <svg width="150" height="150" viewBox="0 0 150 150">
        <circle cx="75" cy="75" :r="r" fill="none" stroke="rgba(244,243,240,.14)" stroke-width="7"></circle>
        <circle cx="75" cy="75" :r="r" fill="none" stroke="#e6b877" stroke-width="7" stroke-linecap="round"
          :stroke-dasharray="c" :stroke-dashoffset="pomoOffset"></circle>
      </svg>
      <div class="ptime"><span class="t">{{ pomoText }}</span><span class="s">{{ pomo.running ? '专注中' : '保持专注' }}</span></div>
    </div>
    <div class="pctl">
      <button class="primary" @click="togglePomo">{{ pomo.running ? '暂停' : '开始' }}</button>
      <button @click="resetPomo">重置</button>
    </div>
    <div class="pstats">
      <div class="ps"><div class="pv">{{ p.count }}</div><div class="pl">今日番茄</div></div>
      <div class="ps"><div class="pv">{{ p.min }}</div><div class="pl">专注分钟</div></div>
      <div class="ps"><div class="pv">{{ p.count + (pomo.running ? 1 : 0) }}</div><div class="pl">轮次</div></div>
    </div>
  </div>
</template>