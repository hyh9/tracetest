<script setup>
import { computed } from 'vue'
import Icon from '../Icon.vue'
import { useStore } from '../../store'
import { ringSVG, dateStr } from '../../utils'
const { CONFIG, data, go } = useStore()

const rings = computed(() => CONFIG.overview.map(o => ({ ...o, r: o.calc(data) })))
const recCount = computed(() => CONFIG.modules.reduce((s, m) => s + (data[m.key] || []).length, 0))
const pinCount = computed(() => CONFIG.modules.reduce((s, m) => s + (data[m.key] || []).filter(x => x.pinned).length, 0))
const money = computed(() => {
  const inc = (data.money || []).filter(x => x.type === 'income').reduce((a, x) => a + +x.amount, 0)
  const exp = (data.money || []).filter(x => x.type === 'expense').reduce((a, x) => a + +x.amount, 0)
  return { inc, exp, bal: inc - exp, col: (inc - exp) >= 0 ? 'var(--module-1)' : 'var(--danger)' }
})
</script>

<template>
  <div class="tile b12">
    <div class="tile-h">
      <span class="tic"><Icon name="target" :size="16" /></span>
      <div class="tt"><span class="en">DAILY VITALS</span><span class="zh">今日概览</span></div>
      <span class="r">{{ dateStr() }}</span>
    </div>
    <div class="ov2-body">
      <div class="rings">
        <div v-for="o in rings" :key="o.key" class="ring" @click="go(o.key)">
          <div class="dial">
            <span class="mid" :style="{ color: o.color }"><Icon :name="o.icon" :size="26" /></span>
            <span v-html="ringSVG(o.r.value, o.color)"></span>
          </div>
          <div class="pct">{{ o.r.value }}%</div>
          <div class="lbl">{{ o.label }}</div>
          <div class="sub">{{ o.r.sub }}</div>
        </div>
      </div>
      <div class="ov2-side">
        <div class="ov2-stat" @click="go('note')"><span class="s-ic" style="color:var(--module-2)"><Icon name="chart" :size="17" /></span>
          <div class="s-tx"><div class="s-v">{{ recCount }}</div><div class="s-l">累计记录条数</div></div></div>
        <div class="ov2-stat"><span class="s-ic" style="color:var(--module-3)"><Icon name="star" :size="17" /></span>
          <div class="s-tx"><div class="s-v">{{ pinCount }}</div><div class="s-l">置顶要事</div></div></div>
        <div class="ov2-stat" @click="go('money')"><span class="s-ic" :style="{ color: money.col }"><Icon name="wallet" :size="17" /></span>
          <div class="s-tx"><div class="s-v" :style="{ color: money.col }">¥{{ money.bal }}</div><div class="s-l">本月结余 · 收¥{{ money.inc }} 支¥{{ money.exp }}</div></div></div>
      </div>
    </div>
  </div>
</template>