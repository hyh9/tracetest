/* ============================================================
   STORE — 全局响应式状态 + 数据持久化（localStorage）
   ============================================================ */
import { reactive, ref, computed } from 'vue'
import { CONFIG } from '../config'
import { today, isoToday, pad2, weekNum } from '../utils'

export const modOf = k => CONFIG.modules.find(m=>m.key===k)

function load(){
  const raw = localStorage.getItem(CONFIG.storageKey)
  if(raw){ try { return JSON.parse(raw) } catch(e){} }
  const d={}; CONFIG.modules.forEach(m=>d[m.key]=structuredClone(m.seed||[])); return d
}

// 单个共享实例（data 为模块级 reactive，二次调用返回同一实例）
const data = reactive(load())
const view = ref('home')
const searchQ = ref('')
const editor = ref(null)                 // { key, item } 或 null（编辑器弹窗）
const pomo = reactive({ running:false, remain:25*60, total:25*60 })
const now = ref(new Date())              // 秒级心跳时间源

function persist(){ localStorage.setItem(CONFIG.storageKey, JSON.stringify(data)) }

// ---------- 路由 ----------
function go(v){ view.value = v; searchQ.value = "" }

// ---------- 通用项操作 ----------
function findItem(mkey, id){ return (data[mkey]||[]).find(i=>i.id==id) }

// 就地勾选（todo 完成 / checkin 今日打卡）
function toggleViewCheck(mkey, id){
  const m = modOf(mkey), x = findItem(mkey, id); if(!x) return
  if(m.type==="todo"){ x.done = !x.done }
  else if(m.type==="checkin"){ x.log = x.log||{}; const t=today(); x.log[t] ? delete x.log[t] : x.log[t]=true }
  persist()
}

// 习惯追踪表：点方框打卡某一具体日期
function toggleHabitDay(day){
  const x = findItem("checkin", day.id); if(!x) return
  x.log = x.log||{}; const d = day.day; x.log[d] ? delete x.log[d] : x.log[d]=true
  persist()
}

// 今日聚焦 / 列表：进度加减（progress）
function stepProgress(mkey, id, delta){
  const x = findItem(mkey, id); if(!x) return
  x.current = Math.max(0, (+x.current||0) + delta); persist()
}

// 置顶切换
function togglePin(mkey, id){
  const x = findItem(mkey, id); if(!x) return
  x.pinned = !x.pinned; persist()
}

// 删除（含二次确认在 UI 层，这里直接删）
function removeRecord(mkey, id){ data[mkey] = (data[mkey]||[]).filter(i=>i.id!=id); persist() }

// 保存新建/编辑（payload 为已构建好的记录对象）
function saveRecord(mkey, editing, payload){
  if(editing){ Object.assign(editing, payload) }
  else { (data[mkey]=data[mkey]||[]).unshift(payload) }
  persist()
}

// ---------- 编辑器弹窗 ----------
function openEditor(key, item){ editor.value = { key, item: item || null } }
function closeEditor(){ editor.value = null }

// ---------- 头像 ----------
function setAvatar(url){ data.__avatar = url; persist() }

// ---------- 番茄钟 & 时钟（秒级心跳） ----------
function completePomo(){
  pomo.running=false; pomo.remain=pomo.total
  data.__pomo = data.__pomo||{count:0,min:0}
  data.__pomo.count++; data.__pomo.min += Math.round(pomo.total/60); persist()
}
function togglePomo(){ pomo.running = !pomo.running }
function resetPomo(){ pomo.running=false; pomo.remain=pomo.total }

let timer=null
function startClock(){
  if(timer) return
  timer = setInterval(()=>{
    now.value = new Date()
    if(pomo.running){ pomo.remain--; if(pomo.remain<=0) completePomo() }
  }, 1000)
}

// ---------- 派生（计算属性） ----------
const clockText = computed(()=>{ const n=now.value; return `${pad2(n.getHours())}:${pad2(n.getMinutes())}:${pad2(n.getSeconds())}` })
const pomoText = computed(()=>`${pad2(Math.floor(pomo.remain/60))}:${pad2(pomo.remain%60)}`)
const pomoOffset = computed(()=>{ const r=64,c=2*Math.PI*r; return c*(1-pomo.remain/pomo.total) })
const todayInfo = computed(()=>{ const n=now.value; const dow=(n.getDay()+6)%7; return {
  hi: n.getHours()<5 ? "夜深了" : n.getHours()<11 ? "早上好" : n.getHours()<13 ? "中午好" : n.getHours()<18 ? "下午好" : "晚上好",
  quote: CONFIG.quotes[dow % CONFIG.quotes.length],
  weekName: "日一二三四五六"[(dow+6)%7],
  weekNum: weekNum(),
}}) 

export function useStore(){
  return {
    CONFIG, data, view, searchQ, editor, pomo, now,
    clockText, pomoText, pomoOffset, todayInfo,
    persist, go, modOf, findItem, toggleViewCheck, toggleHabitDay,
    stepProgress, togglePin, removeRecord, saveRecord, setAvatar,
    openEditor, closeEditor, togglePomo, resetPomo, startClock,
  }
}