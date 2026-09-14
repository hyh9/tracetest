<script setup>
import { computed } from 'vue'
import Icon from '../Icon.vue'
import { useStore } from '../../store'
import { trendSVG } from '../../utils'
const { CONFIG, data } = useStore()
const series = computed(() => CONFIG.trend.series(data))
const has = computed(() => series.value.length > 0)
const avg = computed(() => has.value ? Math.round(series.value.reduce((a, b) => a + b, 0) / series.value.length) : 0)
</script>

<template>
  <div class="tile b8">
    <div class="tile-h">
      <span class="tic"><Icon name="chart" :size="16" /></span>
      <div class="tt"><span class="en">MOOD TREND · 近 7 天</span><span class="zh">{{ CONFIG.trend.title }}</span></div>
      <span v-if="has" class="r">均 {{ avg }}{{ CONFIG.trend.unit }}</span>
    </div>
    <div v-if="has"><span v-html="trendSVG(series)"></span>
      <div class="trend-x"><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span></div>
    </div>
    <div v-else class="trend-empty"><Icon name="chart" :size="26" /><span>暂无本周数据 · 在洞察中记录每日状态</span></div>
  </div>
</template>