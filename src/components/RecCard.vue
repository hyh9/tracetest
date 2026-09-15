<script setup>
import Icon from './Icon.vue'
import { useStore } from '../store'
import { today, streak } from '../utils'
const props = defineProps({ m: Object, x: Object })
const { toggleViewCheck, openEditor, removeRecord, togglePin, CONFIG } = useStore()

const pct = () => Math.min(100, Math.round((props.x.current / props.x.target) * 100 || 0))
const customTags = () => (props.m.fields || []).filter(f => props.x[f.key]).map(f => props.x[f.key])
const layout = () => props.x.layout || 'default'
</script>

<template>
  <div class="rec" :class="'rec-layout-' + layout()">
    <div class="acts">
      <button v-if="!m.remote" class="pin-btn" :class="{ on: x.pinned }" title="置顶" @click.stop="togglePin(m.key, x.id)"><Icon name="star" :size="15" /></button>
      <button class="del" title="删除" @click.stop="removeRecord(m.key, x.id)"><Icon name="trash" :size="15" /></button>
    </div>

    <!-- feature 大图布局 -->
    <div v-if="layout() === 'feature' && x.image" class="top" @click="openEditor(m.key, x)">
      <img v-if="x.image" class="thumb" :src="x.image" alt="">
      <div class="feat-title">{{ x.title || '无标题' }}</div>
      <div v-if="(x.content || x.note || '').trim()" class="feat-body">{{ (x.content || x.note).trim() }}</div>
      <div v-if="customTags().length" style="padding:0 16px 14px">
        <div class="meta-line"><span v-for="t in customTags()" :key="t" class="meta-tag">{{ t }}</span></div>
      </div>
    </div>

    <!-- quote 引文布局 -->
    <div v-else-if="layout() === 'quote'" class="top" style="flex-direction:column;align-items:center;text-align:center" @click="openEditor(m.key, x)">
      <div class="quote-text">{{ (x.content || x.title || '').trim() }}</div>
      <div class="quote-meta">{{ x.mood ? x.mood + (x.date ? ' · ' + x.date : '') : (x.date ? x.date : '') }}</div>
      <div v-if="customTags().length" style="margin-top:8px">
        <div class="meta-line"><span v-for="t in customTags()" :key="t" class="meta-tag">{{ t }}</span></div>
      </div>
    </div>

    <!-- default 布局 -->
    <div v-else class="top" style="padding-right:60px">
      <!-- todo -->
      <template v-if="m.type === 'todo'">
        <div class="chk" :class="x.done ? 'on' : ''" @click.stop="toggleViewCheck(m.key, x.id)"><Icon name="check" :size="13" :sw="2.4" /></div>
        <img v-if="x.image" class="thumb" :src="x.image" alt="">
        <div class="body" @click="openEditor(m.key, x)">
          <span class="rname" :class="x.done ? 'done' : ''">{{ x.title }}</span>
          <span v-if="(m.priorities || []).find(p => p.key === x.priority)" class="badge"
            :style="{ background: m.priorities.find(p => p.key === x.priority).color, color: m.priorities.find(p => p.key === x.priority).text }">
            <span class="dot"></span>{{ m.priorities.find(p => p.key === x.priority).label }}</span>
          <span v-if="x.note" class="rdate" style="margin-left:0;color:var(--text-tertiary)">{{ x.note.slice(0, 40) }}</span>
          <div v-if="customTags().length" class="meta-line"><span v-for="t in customTags()" :key="t" class="meta-tag">{{ t }}</span></div>
        </div>
      </template>
      <!-- checkin -->
      <template v-else-if="m.type === 'checkin'">
        <div class="chk" :class="x.log && x.log[today()] ? 'on' : ''" @click.stop="toggleViewCheck(m.key, x.id)"><Icon name="check" :size="13" :sw="2.4" /></div>
        <img v-if="x.image" class="thumb" :src="x.image" alt="">
        <div class="body" @click="openEditor(m.key, x)">
          <span class="rname">{{ x.title }}</span>
          <span class="streak"><Icon name="flame" :size="13" /> 连续 {{ streak(x.log) }} 天</span>
          <span v-if="x.log && x.log[today()]" class="badge" style="background:var(--accent-muted);color:var(--accent)">今日已打卡</span>
          <div v-if="customTags().length" class="meta-line"><span v-for="t in customTags()" :key="t" class="meta-tag">{{ t }}</span></div>
        </div>
      </template>
      <!-- progress -->
      <template v-else-if="m.type === 'progress'">
        <img v-if="x.image" class="thumb" :src="x.image" alt="">
        <div class="body" @click="openEditor(m.key, x)">
          <span class="rname">{{ x.title }}</span>
          <div class="pbar"><i :style="{ width: pct() + '%', background: m.color }"></i></div>
          <span class="rdate" style="margin-left:0;color:var(--text-secondary)">{{ x.current }}/{{ x.target }} {{ x.unit || m.unit || '' }} · {{ pct() }}%</span>
          <div v-if="x.note" class="rnote">{{ x.note }}</div>
          <div v-if="customTags().length" class="meta-line"><span v-for="t in customTags()" :key="t" class="meta-tag">{{ t }}</span></div>
        </div>
      </template>
      <!-- finance -->
      <template v-else-if="m.type === 'finance'">
        <img v-if="x.image" class="thumb" :src="x.image" alt="">
        <div class="body" @click="openEditor(m.key, x)">
          <span class="rname">{{ x.title }}</span>
          <span class="badge" style="background:var(--surface-nested);color:var(--text-secondary)">{{ x.category || '其他' }}</span>
          <span class="rdate">{{ x.date || '' }}</span>
          <div v-if="customTags().length" class="meta-line"><span v-for="t in customTags()" :key="t" class="meta-tag">{{ t }}</span></div>
        </div>
        <div class="amt" :class="x.type === 'income' ? 'inc' : 'exp'">{{ x.type === 'income' ? '+' : '-' }}¥{{ x.amount }}</div>
      </template>
      <!-- note -->
      <template v-else>
        <img v-if="x.image" class="thumb" :src="x.image" alt="">
        <div class="body" @click="openEditor(m.key, x)">
          <span class="rname">{{ x.title || '无标题' }}</span>
          <span v-if="x.mood" class="badge" style="background:var(--accent-muted);color:var(--accent)">{{ x.mood }}</span>
          <span v-if="x.content" class="rdate" style="margin-left:0;color:var(--text-tertiary)">{{ x.content.slice(0, 40) }}</span>
          <span class="rdate">{{ x.date || '' }}</span>
          <div v-if="customTags().length" class="meta-line"><span v-for="t in customTags()" :key="t" class="meta-tag">{{ t }}</span></div>
        </div>
      </template>
    </div>
  </div>
</template>