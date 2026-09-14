<script setup>
import { reactive, computed } from 'vue'
import Icon from './Icon.vue'
import { useStore } from '../store'
import { modOf } from '../store'
import { isoToday } from '../utils'
const { editor, closeEditor, saveRecord, removeRecord } = useStore()

const m = computed(() => modOf(editor.value.key))
const editing = computed(() => editor.value.item)

function newItem() {
  const base = { id: Date.now() }
  switch (m.value.type) {
    case 'todo': return { ...base, title: '', priority: (m.value.priorities && m.value.priorities[1] ? m.value.priorities[1].key : 'P1'), done: false, note: '' }
    case 'checkin': return { ...base, title: '', log: {} }
    case 'progress': return { ...base, title: '', current: 0, target: (m.value.unit === '页' ? 100 : 20), unit: m.value.unit || '', note: '' }
    case 'finance': return { ...base, title: '', type: 'expense', amount: '', category: (m.value.categories && m.value.categories[0]) || '其他', date: isoToday() }
    default: return { ...base, title: '', content: '', mood: (m.value.moods && m.value.moods[0]) || '', date: isoToday() }
  }
}

// 初始化表单（编辑态合并原值 + 自定义字段默认）
function init() {
  const src = editing.value || newItem() || {}
  const f = reactive({ title: src.title || '', layout: src.layout || 'default', image: src.image || '' })
  for (const [k, v] of Object.entries(src)) if (!(k in f)) f[k] = v ?? ''
  ;(m.value.fields || []).forEach(fd => { if (!(fd.key in f)) f[fd.key] = fd.type === 'select' ? ((fd.options && fd.options[0]) || '') : '' })
  return f
}
const form = init()

function save() {
  const d = editing.value || newItem()
  d.title = (form.title || '').trim() || '未命名'
  d.layout = form.layout || 'default'
  if (m.value.type === 'todo') { d.priority = form.priority; d.note = (form.note || '') }
  else if (m.value.type === 'progress') {
    d.current = Math.max(0, +form.current || 0)
    d.target = Math.max(1, +form.target || 1)
    d.unit = (form.unit || '').trim()
    d.note = (form.note || '')
  } else if (m.value.type === 'finance') {
    d.type = form.type || 'expense'
    d.amount = Math.max(0, +form.amount || 0)
    d.category = form.category || ((m.value.categories && m.value.categories[0]) || '其他')
    d.date = form.date
  } else if (m.value.type === 'note') {
    d.mood = form.mood || d.mood || ''
    d.content = (form.content || '').trim()
    d.date = form.date
  }
  ;(m.value.fields || []).forEach(fd => {
    if (fd.type === 'number') d[fd.key] = Math.max(0, +form[fd.key] || 0)
    else d[fd.key] = (String(form[fd.key] ?? '')).trim()
  })
  d.image = (form.image || '').trim()
  saveRecord(m.value.key, editing.value || null, d)
  closeEditor()
}

function remove() { const id = editor.value.item.id; closeEditor(); removeRecord(m.value.key, id) }
</script>

<template>
  <div class="overlay" @click.self="closeEditor">
    <div class="modal">
      <h3>{{ editing ? '编辑' : '新建' }} · {{ m.name }}</h3>
      <div class="sub">{{ m.desc }}</div>

      <div class="field">
        <label>{{ m.type === 'finance' ? '项目' : (m.type === 'checkin' ? '打卡项' : '标题') }}</label>
        <input v-model="form.title" :placeholder="m.type === 'progress' ? '书名 / 目标' : (m.type === 'checkin' ? '例如：喝够 8 杯水' : '给这条起个名')" />
      </div>

      <!-- todo -->
      <template v-if="m.type === 'todo'">
        <div class="field"><label>优先级</label>
          <div class="seg"><div v-for="p in m.priorities" :key="p.key" class="opt"
            :class="{ on: form.priority === p.key }" @click="form.priority = p.key">{{ p.label }}</div></div>
        </div>
        <div class="field"><label>备注</label><textarea v-model="form.note" placeholder="补充说明"></textarea></div>
      </template>

      <!-- checkin -->
      <template v-else-if="m.type === 'checkin'">
        <p class="sub" style="margin:0">保存后可在卡片点击左侧方块打卡；连续天数自动统计，每天从零开始。</p>
      </template>

      <!-- progress -->
      <template v-else-if="m.type === 'progress'">
        <div class="frow">
          <div class="field"><label>当前</label><input v-model.number="form.current" type="number" /></div>
          <div class="field"><label>目标</label><input v-model.number="form.target" type="number" /></div>
          <div class="field"><label>单位</label><input v-model="form.unit" /></div>
        </div>
        <div class="field"><label>摘录 / 想法</label><textarea v-model="form.note" placeholder="随手记"></textarea></div>
      </template>

      <!-- finance -->
      <template v-else-if="m.type === 'finance'">
        <div class="field"><label>类型</label>
          <div class="seg">
            <div class="opt" :class="{ on: form.type !== 'income' }" @click="form.type = 'expense'">支出</div>
            <div class="opt" :class="{ on: form.type === 'income' }" @click="form.type = 'income'">收入</div>
          </div>
        </div>
        <div class="frow">
          <div class="field"><label>项目</label><input v-model="form.title" placeholder="午餐 / 稿费" /></div>
          <div class="field"><label>金额 ¥</label><input v-model.number="form.amount" type="number" placeholder="0" /></div>
        </div>
        <div class="field"><label>分类</label>
          <div class="seg"><div v-for="c in m.categories" :key="c" class="opt" :class="{ on: form.category === c }"
            style="flex:0 0 auto;min-width:auto" @click="form.category = c">{{ c }}</div></div>
        </div>
        <div class="field"><label>日期</label><input v-model="form.date" type="date" /></div>
      </template>

      <!-- note -->
      <template v-else>
        <div v-if="m.moods && m.moods.length" class="field"><label>标签 / 心情</label>
          <div class="seg"><div v-for="md in m.moods" :key="md" class="opt" :class="{ on: form.mood === md }"
            style="flex:0 0 auto;min-width:auto" @click="form.mood = md">{{ md }}</div></div>
        </div>
        <div class="field"><label>内容</label><textarea v-model="form.content" placeholder="写点什么…"></textarea></div>
      </template>

      <!-- custom fields -->
      <template v-for="fd in m.fields" :key="fd.key">
        <div class="field">
          <label>{{ fd.label }}</label>
          <div v-if="fd.type === 'select'" class="seg">
            <div v-for="o in fd.options" :key="o" class="opt" :class="{ on: form[fd.key] === o }" style="flex:0 0 auto;min-width:auto" @click="form[fd.key] = o">{{ o }}</div>
          </div>
          <textarea v-else-if="fd.type === 'textarea'" v-model="form[fd.key]" :placeholder="fd.placeholder || ''"></textarea>
          <input v-else-if="fd.type === 'number'" v-model.number="form[fd.key]" type="number" :placeholder="fd.placeholder || ''" />
          <input v-else v-model="form[fd.key]" :placeholder="fd.placeholder || ''" />
        </div>
      </template>

      <div class="field"><label>图片 URL（可选）</label><input v-model="form.image" placeholder="https://..." /></div>

      <div class="modal-actions">
        <button v-if="editing" class="link-danger" @click="remove">删除</button>
        <div class="spacer"></div>
        <button class="btn ghost" @click="closeEditor">取消</button>
        <button class="btn" @click="save">保存</button>
      </div>
    </div>
  </div>
</template>