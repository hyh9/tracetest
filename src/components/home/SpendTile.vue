<script setup>
import { computed } from 'vue'
import Icon from '../Icon.vue'
import { useStore } from '../../store'
const { data, go } = useStore()
const palette = ['var(--module-4)', 'var(--module-3)', 'var(--module-1)', 'var(--module-2)', 'var(--module-5)', 'var(--accent)', 'var(--danger)']
const cats = computed(() => {
  const by = {}; (data.money || []).filter(x => x.type === 'expense').forEach(x => { const c = x.category || '其他'; by[c] = (by[c] || 0) + +x.amount })
  return Object.entries(by).sort((a, b) => b[1] - a[1])
})
const exp = computed(() => (data.money || []).filter(x => x.type === 'expense').reduce((a, x) => a + +x.amount, 0))
const expCount = computed(() => (data.money || []).filter(x => x.type === 'expense').length)
</script>

<template>
  <div class="tile b4">
    <div class="tile-h">
      <span class="tic"><Icon name="wallet" :size="16" /></span>
      <div class="tt"><span class="en">MONTHLY SPENDING</span><span class="zh">月度开销</span></div>
      <span class="r" style="cursor:pointer" @click="go('money')">明细</span>
    </div>
    <div class="spend-sum"><span class="spend-total">¥{{ exp }}</span><span class="spend-cap">本月支出 · 共 {{ expCount }} 笔</span></div>
    <div class="book-list">
      <template v-if="cats.length">
        <div v-for="(ct, i) in cats" :key="ct[0]" class="book-row" @click="go('money')">
          <span class="spine" :style="{ background: palette[i % palette.length] }"><Icon name="wallet" :size="16" /></span>
          <div class="bmid">
            <div class="btt">{{ ct[0] }}</div><div class="bsub">¥{{ ct[1] }}</div>
            <div class="bbar"><i :style="{ width: Math.round(ct[1] / exp * 100) + '%', background: palette[i % palette.length] }"></i></div>
          </div>
          <span class="bpct" :style="{ color: palette[i % palette.length] }">{{ exp ? Math.round(ct[1] / exp * 100) : 0 }}%</span>
        </div>
      </template>
      <div v-else class="focus-empty">暂无支出记录</div>
    </div>
  </div>
</template>