<script setup>
import { computed } from 'vue'
import Icon from '../Icon.vue'
import { useStore } from '../../store'
import { weekDates, today } from '../../utils'
const { CONFIG, data, toggleHabitDay, go } = useStore()

const wk = computed(() => weekDates())
const t = today()
const tIdx = computed(() => wk.value.indexOf(t))
const dnames = ['一', '二', '三', '四', '五', '六', '日']
const palette = ['var(--module-1)', 'var(--module-2)', 'var(--module-3)', 'var(--module-4)', 'var(--module-5)', 'var(--accent)']
const items = computed(() => data.checkin || [])
const dayName = computed(() => '日一二三四五六'[(new Date().getDay() + 6) % 7])
</script>

<template>
  <div class="tile b7">
    <div class="tile-h">
      <span class="tic"><Icon name="leaf" :size="16" /></span>
      <div class="tt"><span class="en">HABIT TRACKER</span><span class="zh">本周习惯追踪表</span></div>
      <span class="r" style="cursor:pointer" @click="go('checkin')">本周 · 周{{ dayName }}</span>
    </div>
    <table class="habit-tb">
      <thead><tr><th class="hh">习惯</th>
        <th v-for="(d, i) in dnames" :key="d" :class="{ tdcol: i === tIdx }">{{ d }}</th>
        <th class="hr">完成率</th></tr></thead>
      <tbody>
        <tr v-if="items.length" v-for="(x, ri) in items" :key="x.id">
          <td class="hn"><span class="hdot" :style="{ background: palette[ri % palette.length] }"></span>{{ x.title }}</td>
          <td v-for="(day, i) in wk" :key="day" :class="{ tdcol: i === tIdx }">
            <span class="hcell" :class="x.log && x.log[day] ? 'on' : 'off'"
              @click.stop="toggleHabitDay({ id: x.id, day })">
              <Icon name="check" :size="13" :sw="2.8" /></span>
          </td>
          <td class="hrate" :style="{ color: palette[ri % palette.length] }">{{ Math.round((wk.filter(d => x.log && x.log[d]).length) / 7 * 100) }}%</td>
        </tr>
        <tr v-else><td colspan="9" style="text-align:center;color:var(--text-tertiary);font-size:12.5px;padding:18px 0">还没有习惯，去「习惯打卡」添加吧</td></tr>
      </tbody>
    </table>
  </div>
</template>