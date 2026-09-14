<script setup>
import { ref } from 'vue'
import Icon from './Icon.vue'
import { useStore } from '../store'
const { CONFIG, data, view, go, setAvatar } = useStore()
const fileInput = ref(null)
const onPick = () => fileInput.value.click()
const onFile = e => {
  const f = e.target.files && e.target.files[0]
  if(!f) return
  const reader = new FileReader()
  reader.onload = () => setAvatar(reader.result)
  reader.readAsDataURL(f)
  e.target.value = ''
}
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="ava" title="点击更换头像" @click="onPick">
        <img :src="data.__avatar || '/assets/avatar.jpg'" alt="头像">
        <span class="cam"><Icon name="camera" :size="18" /></span>
      </div>
      <input ref="fileInput" type="file" accept="image/*" hidden @change="onFile">
      <div><h1>{{ CONFIG.owner }}</h1><p>{{ CONFIG.slogan }}</p></div>
    </div>
    <nav class="nav">
      <div class="navi" :class="{ active: view === 'home' }" @click="go('home')">
        <Icon name="home" :size="19" />首页</div>
      <div class="nav-sep">功能模块</div>
      <div v-for="m in CONFIG.modules" :key="m.key" class="navi"
        :class="{ active: view === m.key }" @click="go(m.key)">
        <Icon :name="m.icon" :size="19" />{{ m.name }}</div>
      <div class="nav-sep">统计</div>
      <div class="navi" :class="{ active: view === 'insight' }" @click="go('insight')">
        <Icon name="chart" :size="19" />洞察复盘</div>
    </nav>
    <div class="foot">数据仅存在本机 · 每日更新</div>
  </aside>
</template>