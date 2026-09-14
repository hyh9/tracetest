<script setup>
import { computed } from 'vue'
import Icon from './Icon.vue'
import { useStore } from '../store'
import { today, avgProgress, streak, ringSVG } from '../utils'
const props = defineProps({ m: Object, all: Array })
const t = today()
const palette = ['var(--accent)', 'var(--module-1)', 'var(--module-2)', 'var(--module-3)', 'var(--module-4)', 'var(--module-5)', 'var(--danger)']

const fin = computed(() => {
  const inc = props.all.filter(x => x.type === 'income').reduce((a, x) => a + +x.amount, 0)
  const exp = props.all.filter(x => x.type === 'expense').reduce((a, x) => a + +x.amount, 0)
  const by = {}; props.all.filter(x => x.type === 'expense').forEach(x => { const c = x.category || '其他'; by[c] = (by[c] || 0) + +x.amount })
  const cats = Object.entries(by).sort((a, b) => b[1] - a[1])
  const maxC = cats.length ? cats[0][1] : 1
  const todayExp = props.all.filter(x => x.type === 'expense' && x.date === t).reduce((a, x) => a + +x.amount, 0)
  return { inc, exp, bal: inc - exp, todayExp, cats, maxC }
})
const prog = computed(() => {
  const p = avgProgress(props.all)
  const doneN = props.all.filter(x => ((x.current / x.target) * 100 || 0) >= 100).length
  const totalCur = props.all.reduce((a, x) => a + (+x.current || 0), 0)
  const totalTgt = props.all.reduce((a, x) => a + (+x.target || 0), 0)
  return { p, doneN, totalCur, totalTgt, unit: (props.all[0] && props.all[0].unit) || props.m.unit || '' }
})
const chk = computed(() => {
  const done = props.all.filter(x => x.log && x.log[t]).length
  const pctV = props.all.length ? Math.round(done / props.all.length * 100) : 0
  const streaks = props.all.map(x => ({ title: x.title, s: streak(x.log) })).sort((a, b) => b.s - a.s)
  return { done, pctV, best: streaks[0] ? streaks[0].s : 0, streaks: streaks.slice(0, 6) }
})
const tdo = computed(() => {
  const done = props.all.filter(x => x.done).length
  const pctV = props.all.length ? Math.round(done / props.all.length * 100) : 0
  const by = {}; (props.m.priorities || []).forEach(p => by[p.key] = 0); props.all.forEach(x => { if (by[x.priority] != null) by[x.priority]++ })
  return { done, pctV, by, pRows: (props.m.priorities || [])
    .map(p => ({ ...p, n: by[p.key] || 0 })) }
})
const note = computed(() => {
  const todayN = props.all.filter(x => x.date === t).length
  const by = {}; props.all.forEach(x => { const md = x.mood || '未分类'; by[md] = (by[md] || 0) + 1 })
  const moods = Object.entries(by).sort((a, b) => b[1] - a[1])
  const maxM = moods.length ? moods[0][1] : 1
  return { todayN, moods, maxM }
})
const row = (k, v, dot) => `<div class="stat-row"><span class="k">${dot ? `<span class="kd" style="background:${dot}"></span>` : ''}${k}</span><span class="val">${v}</span></div>`
</script>

<template>
  <template v-if="m.type === 'finance'">
    <div class="side-card">
      <div class="sh"><Icon name="wallet" :size="15" /> 收支概况</div>
      <div v-html="row('总收入', '<span style=color:var(--module-1)>¥' + fin.inc + '</span>')"></div>
      <div v-html="row('总支出', '<span style=color:var(--danger)>¥' + fin.exp + '</span>')"></div>
      <div v-html="row('净结余', '¥' + fin.bal)"></div>
      <div v-html="row('今日支出', '¥' + fin.todayExp)"></div>
      <div v-html="row('总笔数', all.length + ' 笔')"></div>
    </div>
    <div class="side-card"><div class="sh"><Icon name="chart" :size="15" /> 支出分类占比</div>
      <div class="catbar">
        <div v-if="fin.cats.length" v-for="(ct, i) in fin.cats" :key="ct[0]" class="cbrow">
          <span class="cbn">{{ ct[0] }}</span>
          <span class="cbt"><i :style="{ width: Math.round(ct[1] / fin.maxC * 100) + '%', background: palette[i % palette.length] }"></i></span>
          <span class="cbv">¥{{ ct[1] }}</span>
        </div>
        <div v-else style="color:var(--text-tertiary);font-size:12.5px;padding:6px 0">暂无支出记录</div>
      </div></div>
  </template>

  <template v-else-if="m.type === 'progress'">
    <div class="side-card">
      <div class="sh"><Icon name="target" :size="15" /> 总体进度</div>
      <div class="side-ring"><div class="dial">
        <span class="mid"><span class="big" :style="{ color: m.color }">{{ prog.p.value }}%</span><span class="cap">平均进度</span></span>
        <span v-html="ringSVG(prog.p.value, m.color)"></span>
      </div></div>
    </div>
    <div class="side-card"><div class="sh"><Icon name="list" :size="15" /> 数据统计</div>
      <div v-html="row('进行项目', all.length + ' 项')"></div>
      <div v-html="row('已达成', prog.doneN + ' 项')"></div>
      <div v-html="row('累计完成', prog.totalCur + ' ' + prog.unit)"></div>
      <div v-html="row('总目标量', prog.totalTgt + ' ' + prog.unit)"></div></div>
  </template>

  <template v-else-if="m.type === 'checkin'">
    <div class="side-card">
      <div class="sh"><Icon name="leaf" :size="15" /> 今日打卡</div>
      <div class="side-ring"><div class="dial">
        <span class="mid"><span class="big" :style="{ color: m.color }">{{ chk.done }}/{{ all.length }}</span><span class="cap">已完成</span></span>
        <span v-html="ringSVG(chk.pctV, m.color)"></span>
      </div></div>
    </div>
    <div class="side-card"><div class="sh"><Icon name="flame" :size="15" /> 连续天数</div>
      <div v-html="row('最长连续', '<span style=color:var(--module-3)>' + chk.best + ' 天</span>')"></div>
      <div v-html="row('习惯总数', all.length + ' 个')"></div>
      <div style="margin-top:6px">
        <div v-for="x in chk.streaks" :key="x.title" class="stat-row">
          <span class="k">{{ x.title }}</span><span class="val" style="color:var(--module-3)">{{ x.s }} 天</span></div>
      </div></div>
  </template>

  <template v-else-if="m.type === 'todo'">
    <div class="side-card">
      <div class="sh"><Icon name="list" :size="15" /> 完成情况</div>
      <div class="side-ring"><div class="dial">
        <span class="mid"><span class="big" :style="{ color: m.color }">{{ tdo.pctV }}%</span><span class="cap">{{ tdo.done }}/{{ all.length }} 完成</span></span>
        <span v-html="ringSVG(tdo.pctV, m.color)"></span>
      </div></div>
    </div>
    <div class="side-card"><div class="sh"><Icon name="chart" :size="15" /> 优先级分布</div>
      <div v-for="p in tdo.pRows" :key="p.key" class="stat-row">
        <span class="k"><span class="kd" :style="{ background: p.text }"></span>{{ p.label }}</span><span class="val">{{ p.n }} 项</span></div>
      <div v-html="row('剩余待办', (all.length - tdo.done) + ' 项')"></div></div>
  </template>

  <template v-else>
    <div class="side-card"><div class="sh"><Icon name="pen" :size="15" /> 记录统计</div>
      <div v-html="row('累计记录', all.length + ' 条')"></div>
      <div v-html="row('今日新增', note.todayN + ' 条')"></div>
      <div v-html="row('标签种类', note.moods.length + ' 种')"></div></div>
    <div class="side-card"><div class="sh"><Icon name="chart" :size="15" /> 标签分布</div>
      <div class="catbar">
        <div v-if="note.moods.length" v-for="(md, i) in note.moods" :key="md[0]" class="cbrow">
          <span class="cbn">{{ md[0] }}</span>
          <span class="cbt"><i :style="{ width: Math.round(md[1] / note.maxM * 100) + '%', background: palette[i % palette.length] }"></i></span>
          <span class="cbv">{{ md[1] }} 条</span>
        </div>
        <div v-else style="color:var(--text-tertiary);font-size:12.5px;padding:6px 0">暂无记录</div>
      </div></div>
  </template>
</template>