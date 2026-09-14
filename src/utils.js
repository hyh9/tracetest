/* ============================================================
   UTILS — 纯工具函数（不依赖 CONFIG，避免循环引用）
   ============================================================ */

export function isoToday(){ return new Date().toISOString().slice(0,10); }
export function today(){ return isoToday(); }

export function avgProgress(list){
  if(!list||!list.length) return { value:0, sub:"0" };
  const v = Math.round(list.reduce((s,x)=>s+Math.min(100,(x.current/x.target)*100||0),0)/list.length);
  return { value:v, sub:`${list.length} 项` };
}

export function pad2(n){ return String(n).padStart(2,"0"); }

/* 本周（周一起）7 天的 ISO 日期 */
export function weekDates(){
  const n=new Date(); const dow=(n.getDay()+6)%7; const mon=new Date(n); mon.setDate(n.getDate()-dow);
  const arr=[]; for(let i=0;i<7;i++){ const d=new Date(mon); d.setDate(mon.getDate()+i); arr.push(d.toISOString().slice(0,10)); }
  return arr;
}

export function weekNum(){ const n=new Date(); const s=new Date(n.getFullYear(),0,1);
  return Math.ceil(((n-s)/86400000 + s.getDay()+1)/7); }

export function dateStr(){ const n=new Date(); const wd="日一二三四五六"[n.getDay()]; return `${n.getFullYear()}年${n.getMonth()+1}月${n.getDate()}日 周${wd}`; }

export function esc(s){ return String(s??"").replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
export function attr(s){ return esc(s); }

export function streak(log){ if(!log) return 0; let n=0; const d=new Date();
  for(;;){ const k=d.toISOString().slice(0,10); if(log[k]){ n++; d.setDate(d.getDate()-1);} else break; } return n; }

/* ---------- SVG 生成（返回字符串，配合 v-html） ---------- */
export function ringSVG(pct, color){
  const r=25, c=2*Math.PI*r, off=c*(1-Math.min(100,pct)/100);
  return `<svg class="gauge" viewBox="0 0 60 60"><circle cx="30" cy="30" r="${r}" fill="none" stroke="var(--border)" stroke-width="5.5"/>
    <circle cx="30" cy="30" r="${r}" fill="none" stroke="${color}" stroke-width="5.5" stroke-linecap="round"
      stroke-dasharray="${c}" stroke-dashoffset="${off}"/></svg>`;
}

export function trendSVG(series){
  const w=560, h=170, padX=12, padTop=16, padBot=22;
  const max=Math.max(...series), min=Math.min(...series);
  const rng=(max-min)||1;
  const innerW=w-2*padX, innerH=h-padTop-padBot;
  const pts=series.map((v,i)=>{
    const x=padX+innerW*i/(series.length-1);
    const y=padTop+innerH*(1-(v-min)/rng);
    return [x,y];
  });
  const line=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const area=line+` L ${padX+innerW} ${h-padBot} L ${padX} ${h-padBot} Z`;
  const dots=pts.map(p=>`<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.2" fill="var(--surface-card)" stroke="var(--module-2)" stroke-width="2"/>`).join('');
  return `<svg class="trend-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet">
    <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--module-2)" stop-opacity=".22"/><stop offset="1" stop-color="var(--module-2)" stop-opacity="0"/></linearGradient></defs>
    <path d="${area}" fill="url(#tg)"/><path d="${line}" fill="none" stroke="var(--module-2)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>${dots}</svg>`;
}