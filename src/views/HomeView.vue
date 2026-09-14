<script setup>
import ClockCard from '../components/home/ClockCard.vue'
import FocusTile from '../components/home/FocusTile.vue'
import QuickTile from '../components/home/QuickTile.vue'
import OverviewTile from '../components/home/OverviewTile.vue'
import HabitTile from '../components/home/HabitTile.vue'
import TodoTile from '../components/home/TodoTile.vue'
import PomoTile from '../components/home/PomoTile.vue'
import TrendTile from '../components/home/TrendTile.vue'
import SpendTile from '../components/home/SpendTile.vue'
import BooksTile from '../components/home/BooksTile.vue'
import GoalsTile from '../components/home/GoalsTile.vue'

const SecGrp = { props: ['zh', 'en'], template: `<div class="sec-grp"><span class="bar"></span><span class="zh">{{ zh }}</span><span class="en">{{ en }}</span><span class="line"></span></div>` }
</script>

<template>
  <div>
    <SecGrp zh="今日节奏" en='TODAY · RHYTHM' />
    <div class="bento">
      <ClockCard />
      <FocusTile />
      <QuickTile />
      <OverviewTile />
    </div>

    <SecGrp zh="习惯与待办" en='HABITS & TASKS' />
    <div class="bento"><HabitTile /><TodoTile /></div>

    <SecGrp zh="专注与状态" en='FOCUS & MOOD' />
    <div class="bento"><PomoTile /><TrendTile /></div>

    <SecGrp zh="收支与成长" en='MONEY & GROWTH' />
    <div class="bento"><SpendTile /><BooksTile /><GoalsTile /></div>
  </div>
</template>