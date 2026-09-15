<script setup>
import { useStore } from './store'
import Sidebar from './components/Sidebar.vue'
import HomeView from './views/HomeView.vue'
import InsightView from './views/InsightView.vue'
import ModuleView from './views/ModuleView.vue'
import EditorModal from './components/EditorModal.vue'
import { onMounted, watch } from 'vue'
const { view, editor, startClock, initRemote } = useStore()
watch(editor, e => { document.body.style.overflow = e ? 'hidden' : '' })
onMounted(() => { startClock(); initRemote() })
</script>

<template>
  <div class="layout">
    <Sidebar />
    <main class="main">
      <div id="screen">
        <HomeView v-if="view === 'home'" />
        <InsightView v-else-if="view === 'insight'" />
        <ModuleView v-else />
      </div>
    </main>
    <EditorModal v-if="editor" />
  </div>
</template>