<script setup>
import { useStore } from '../../store'
import { dateStr } from '../../utils'
const { CONFIG, clockText, todayInfo } = useStore()
</script>

<template>
  <div class="clock-card b4">
    <div>
      <div class="hi">{{ todayInfo.hi }}，{{ CONFIG.owner }}</div>
      <div class="sub">{{ todayInfo.quote }}</div>
    </div>
    <div>
      <div class="clk">{{ clockText }}</div>
      <div class="cmeta"><span>{{ dateStr() }}</span><span class="dot"></span><span>第 {{ todayInfo.weekNum }} 周</span></div>
    </div>
  </div>
</template>