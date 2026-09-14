<script setup>
import Icon from '../Icon.vue'
import { useStore } from '../../store'
const { CONFIG, go, openEditor } = useStore()
const add = q => { go(q.module); openEditor(q.module, null) }
</script>

<template>
  <div class="tile b4">
    <div class="tile-h">
      <span class="tic"><Icon name="plus" :size="16" :sw="2.2" /></span>
      <div class="tt"><span class="en">QUICK ADD</span><span class="zh">快速记录</span></div>
    </div>
    <div class="quick-grid" style="flex:1;align-content:start">
      <button v-for="q in CONFIG.quickAdd" :key="q.module" class="qbtn" @click="add(q)">
        <span class="e" :style="{ background: q.tint, color: q.color }">
          <Icon :name="q.icon" :size="20" /><i class="qplus"><Icon name="plus" :size="10" :sw="3" /></i>
        </span>
        <span class="l">{{ q.label }}</span>
      </button>
    </div>
  </div>
</template>