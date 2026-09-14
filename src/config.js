/* ============================================================
   CONFIG — 应用配置（与原生版结构一致，仅需定制此处）
   modules 里每个模块 = 一个功能页；type 决定其形态与字段。
     todo     今日计划/待办（勾选 + 优先级）
     checkin  习惯打卡（连续天数，每天清零）
     progress 长期计划（进度条：当前/目标）
     finance  记账（收入/支出 + 分类 + 金额）
     note     内容记录/日记（标题 + 正文 + 心情标签）
   图标用 icon 字段（取自 ICONS，单色线性图标）。
   ============================================================ */
import { today, avgProgress, isoToday } from './utils';

export const CONFIG = {
  storageKey: "cat-news-workbench-v1",   // 换 key 可强制重置
  owner: "猫咪生活报",                   // 侧栏顶部标题
  slogan: "The Daily Cat Post",

  // 每日一句（一周七天各一句，按星期轮换：周一→周日）
  quotes: [
    "新一周的头条，从最重要的一件小事开始。",   // 周一
    "保持节奏，稳一点也没关系。",                 // 周二
    "把大目标拆成豆腐块，今天只推进一段。",       // 周三
    "坚持到一半最难，也最值得上头版。",           // 周四
    "收个尾，给这一周发一篇完结报道。",           // 周五
    "允许自己慢下来，好好打盹也是正事。",         // 周六
    "复盘一下，为下周的头版预留选题。",           // 周日
  ],

  // 今日概览环形（value 为 0-100 的完成度，calc 返回 {value, sub}）
  overview: [
    { key:"todo", label:"今日头条", icon:"list", color:"var(--accent)",
      calc: d => { const it=d.todo||[]; const done=it.filter(x=>x.done).length; return { value: it.length?Math.round(done/it.length*100):0, sub:`${done}/${it.length} 条` }; } },
    { key:"checkin", label:"已出刊", icon:"cat", color:"var(--module-1)",
      calc: d => { const it=d.checkin||[]; const t=today(); const done=it.filter(x=>x.log&&x.log[t]).length; return { value: it.length?Math.round(done/it.length*100):0, sub:`${done}/${it.length} 项` }; } },
    { key:"read", label:"阅读专刊", icon:"book", color:"var(--module-2)", calc: d => avgProgress(d.read) },
    { key:"sport", label:"运动副刊", icon:"activity", color:"var(--module-3)", calc: d => avgProgress(d.sport) },
  ],

  // 本周状态趋势（读取 __trend，7 个数字；没有则留空）
  trend: {
    title:"本周状态趋势", unit:"分",
    series: d => (Array.isArray(d.__trend) && d.__trend.length===7) ? d.__trend : [],
  },

  // 快速记录按钮（点击直接给对应模块新建）
  quickAdd: [
    { label:"记运动", icon:"activity", module:"sport",   tint:"#f6f0e6", color:"var(--module-3)" },
    { label:"记打卡", icon:"cat",      module:"checkin", tint:"#eef3ec", color:"var(--module-1)" },
    { label:"记一笔", icon:"wallet",   module:"money",   tint:"#f6efe8", color:"var(--module-4)" },
    { label:"记灵感", icon:"pen",      module:"note",    tint:"#f1eef4", color:"var(--module-5)" },
  ],

  // ============ 模块定义 ============
  modules: [
    { key:"todo", name:"今日头条", icon:"list", tint:"#efeee8", color:"var(--accent)", type:"todo", desc:"今日要闻与待办清单",
      priorities:[ {key:"P0",label:"头版",color:"#f6ece9",text:"#b85c4f"}, {key:"P1",label:"要闻",color:"#f6efe6",text:"#c67b3f"}, {key:"P2",label:"简讯",color:"#eef2ec",text:"#5e7c4e"} ],
      seed:[ {id:11,title:"审阅今日头版选题",priority:"P0",done:false,note:"确定今天最重要的三件事"},
             {id:12,title:"整理采访笔记",priority:"P1",done:false,note:""},
             {id:13,title:"给绿植浇水",priority:"P2",done:true,note:""} ] },
    { key:"checkin", name:"习惯日报", icon:"cat", tint:"#eef3ec", color:"var(--module-1)", type:"checkin", desc:"每日习惯·连续出刊",
      seed:[ {id:21,title:"喝够 8 杯水",log:{}}, {id:22,title:"23:00 前熄灯",log:{}}, {id:23,title:"补充维生素",log:{}} ] },
    { key:"read", name:"阅读专刊", icon:"book", tint:"#edf1f5", color:"var(--module-2)", type:"progress", unit:"页", desc:"书籍进度·摘录·想法",
      seed:[ {id:31,title:"《猫的报恩》",current:86,target:240,unit:"页",note:"第 3 章：午后的编辑部"}, {id:32,title:"《慢读艺术》",current:45,target:180,unit:"页",note:"每天读 20 页，做摘录"} ] },
    { key:"sport", name:"运动副刊", icon:"activity", tint:"#f6f0e6", color:"var(--module-3)", type:"progress", unit:"分钟", desc:"锻炼·散步·伸展",
      seed:[ {id:41,title:"晨间伸展",current:8,target:15,unit:"分钟",note:"唤醒身体，主编同款"}, {id:42,title:"午后散步",current:20,target:30,unit:"分钟",note:"绕街区一圈，观察人间"} ] },
    { key:"money", name:"财务版", icon:"wallet", tint:"#f6efe8", color:"var(--module-4)", type:"finance", desc:"收入·支出·分类·占比",
      categories:["餐饮","交通","购物","居家","娱乐","稿费","其他"],
      seed:[ {id:51,title:"猫粮补货",type:"expense",amount:128,category:"居家",date:isoToday()},
             {id:52,title:"地铁",type:"expense",amount:6,category:"交通",date:isoToday()},
             {id:53,title:"专栏稿费",type:"income",amount:400,category:"稿费",date:isoToday()} ] },
    { key:"note", name:"记者手记", icon:"pen", tint:"#f1eef4", color:"var(--module-5)", type:"note", desc:"灵感·摘录·心情记录",
      moods:["开心","平静","低落","焦虑","疲惫"],
      seed:[ {id:61,title:"窗外的小确幸",content:"今天阳光很好，橘子在窗台上打了个盹。",mood:"开心",date:isoToday()} ] },
    { key:"hot", name:"热点剪报", icon:"flame", tint:"#f6ece9", color:"var(--danger)", type:"note", desc:"值得收藏的报道与想法",
      moods:["收藏","稍后读","已读"],
      seed:[ {id:71,title:"写作技巧合集",content:"整理常用开头模板，方便日后写头条。",mood:"收藏",date:isoToday()} ] },
  ],
};

/* ============================================================
   ICONS — 单色线性图标库（stroke 跟随 color）
   ============================================================ */
export const ICONS = {
  home:'<path d="M4 11.5 12 5l8 6.5"/><path d="M6 10.5V19h12v-8.5"/>',
  grid:'<rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/>',
  chart:'<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-4"/><path d="M12 16v-7"/><path d="M16 16v-2"/>',
  user:'<circle cx="12" cy="8" r="3.4"/><path d="M5.5 19c.7-3.2 3.2-5 6.5-5s5.8 1.8 6.5 5"/>',
  plus:'<path d="M12 5v14"/><path d="M5 12h14"/>',
  menu:'<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>',
  calendar:'<rect x="4" y="5" width="16" height="16" rx="2.5"/><path d="M4 9.5h16"/><path d="M8 3v4"/><path d="M16 3v4"/>',
  list:'<path d="M8.5 6h11"/><path d="M8.5 12h11"/><path d="M8.5 18h11"/><circle cx="4.5" cy="6" r=".9"/><circle cx="4.5" cy="12" r=".9"/><circle cx="4.5" cy="18" r=".9"/>',
  leaf:'<path d="M20 4C10 4 4 9 4 17c0 1 .1 2 .5 3 5.5-9 9-9.5 15.5-16z"/><path d="M4.5 20c3-6 7-9.5 13-11.5"/>',
  book:'<path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v14H7.5A2.5 2.5 0 0 0 5 19.5z"/><path d="M5 19.5A2.5 2.5 0 0 1 7.5 17H19v4H7.5A2.5 2.5 0 0 1 5 19.5z"/>',
  activity:'<path d="M3 12h4l2.5 6L14 5l2.5 7H21"/>',
  wallet:'<path d="M4 8a2 2 0 0 1 2-2h11a1.5 1.5 0 0 1 1.5 1.5V8"/><rect x="3.5" y="7.5" width="17" height="11.5" rx="2.5"/><circle cx="16.5" cy="13.2" r="1.3"/>',
  pen:'<path d="M4 20l1.2-4L16 5.2l2.8 2.8L8 19z"/><path d="M14.2 7l2.8 2.8"/>',
  camera:'<path d="M4 8.5h3l1.5-2h7L17 8.5h3v10H4z"/><circle cx="12" cy="13" r="3.2"/>',
  flame:'<path d="M12 3c3 3 5 5.5 5 9a5 5 0 0 1-10 0c0-2 1-3.6 2.6-4.6C9 10.4 10.4 6.2 12 3z"/>',
  target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/>',
  star:'<path d="M12 3.6l2.6 5.3 5.8.85-4.2 4.1 1 5.8L12 16.9l-5.2 2.75 1-5.8-4.2-4.1 5.8-.85z"/>',
  quote:'<path d="M9.5 7C7.6 7.9 6.5 9.6 6.5 12v5h5v-6H8.5c0-1.7.7-2.7 2.2-3.4zM19 7c-1.9.9-3 2.6-3 5v5h5v-6h-3c0-1.7.7-2.7 2.2-3.4z"/>',
  chevron:'<path d="M9 5l7 7-7 7"/>',
  check:'<path d="M5 12.5 10 17 19 7"/>',
  trash:'<path d="M4 7h16"/><path d="M9 7V4.5h6V7"/><path d="M6 7l1 13h10l1-13"/><path d="M10 11v6M14 11v6"/>',
  close:'<path d="M6 6l12 12M18 6 6 18"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/>',
  bolt:'<path d="M13 3 5 13h5l-1 8 8-11h-5z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>',
  moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z"/>',
  cat:'<path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/>',
  paw:'<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>',
};