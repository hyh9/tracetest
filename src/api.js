/* ============================================================
   API — 前后端分离：封装后端 REST 接口 + 前后端字段映射。
   默认走同源 /api（由 Vite dev 代理转发到后端），生产可用 VITE_API_BASE 覆盖。
   后端统一返回 { code, msg, data }。
   ============================================================ */

const BASE = (import.meta.env && import.meta.env.VITE_API_BASE) || '/api'

async function request(method, url, body) {
  let res
  try {
    res = await fetch(BASE + url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body == null ? undefined : JSON.stringify(body),
    })
  } catch (e) {
    throw new Error('无法连接后端服务 (' + BASE + ')')
  }
  let json
  try { json = await res.json() } catch (e) { json = { code: -1, msg: res.statusText } }
  if (json.code !== 0) throw new Error(json.msg || '请求失败')
  return json.data
}

/* ================= 字段映射：后端 ↔ 组件数据 =================
   组件约定：待办 done/priority；习惯 log 为 { 日期:true }；记账/手记 date(而非 recordDate)。
   ================= 字段映射：后端 ↔ 组件数据 ================= */

// 习惯：后端返回 log 为日期数组，转换为组件所需的 {日期:true}
function habitToFront(h) {
  const log = {}
  ;(h.log || []).forEach(d => { log[d] = true })
  return { id: h.id, title: h.title, note: h.note, streak: h.streak || 0, log }
}
function habitToBack(p) {
  return { title: p.title, note: p.note || '' }
}

// 记账/手记：后端为 recordDate，组件为 date
function financeToFront(f) { return { ...f, date: f.recordDate, amount: Number(f.amount) } }
function financeToBack(p) {
  // 后端 amount 需为数字
  return { type: p.type, title: p.title, amount: Number(p.amount), category: p.category, recordDate: p.date, note: p.note }
}
function noteToFront(n) { return { ...n, date: n.recordDate } }
function noteToBack(p) { return { title: p.title, content: p.content, mood: p.mood, recordDate: p.date } }

export const api = {
  /** 待办：list() 直接返回与组件兼容的对象 */
  todos: {
    list: () => request('GET', '/todos'),
    create: p => request('POST', '/todos', { title: p.title, priority: p.priority, note: p.note }),
    update: (id, p) => request('PUT', '/todos/' + id, { title: p.title, priority: p.priority, note: p.note }),
    toggle: id => request('PATCH', '/todos/' + id + '/toggle'),
    remove: id => request('DELETE', '/todos/' + id),
  },
  /** 习惯日报 */
  habits: {
    list: () => request('GET', '/habits').then(rs => (rs || []).map(habitToFront)),
    create: p => request('POST', '/habits', habitToBack(p)),
    update: (id, p) => request('PUT', '/habits/' + id, habitToBack(p)),
    check: (id, date) => request('POST', '/habits/' + id + '/check', { date }).then(habitToFront),
    remove: id => request('DELETE', '/habits/' + id),
  },
  /** 记账 */
  finance: {
    list: () => request('GET', '/finance').then(rs => (rs || []).map(financeToFront)),
    create: p => request('POST', '/finance', financeToBack(p)),
    update: (id, p) => request('PUT', '/finance/' + id, financeToBack(p)),
    remove: id => request('DELETE', '/finance/' + id),
  },
  /** 手记 */
  notes: {
    list: () => request('GET', '/notes').then(rs => (rs || []).map(noteToFront)),
    create: p => request('POST', '/notes', noteToBack(p)),
    update: (id, p) => request('PUT', '/notes/' + id, noteToBack(p)),
    remove: id => request('DELETE', '/notes/' + id),
  },
}

/** 模块 key(input: todo/checkin/money/note) → 后端 API 对象 */
export const REMOTE_API = {
  todo: api.todos,
  checkin: api.habits,
  money: api.finance,
  note: api.notes,
}

/** 后端新增后返回真实 id，需把缓存对象 id 替换
 *  约定：非远程模块返回 false。 */
export const isRemoteModule = mkey => !!REMOTE_API[mkey]

/** 单条记录：后端 → 组件字段（用于新建/编辑回写） */
const TO_FRONT = { todo: x => x, checkin: habitToFront, money: financeToFront, note: noteToFront }
export function toFrontRecord(mkey, rec) {
  const f = TO_FRONT[mkey] || (x => x)
  return f(rec)
}

export default api