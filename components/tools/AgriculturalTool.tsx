'use client'
import{useState,useCallback,useEffect,useRef}from'react'
import{Plus,Trash2,Zap,Clock,X,ChevronDown}from'lucide-react'
import{AG_ACTIVITIES,AgActivity,AgEquipmentRow,PSH_TABLE,findPSH,calculateAgriculturalSizing,SizingResult}from'@/lib/calculations'
const IC:Record<string,string>={'Irrigation':'💧','Dairy Farming':'🐄','Poultry Farming':'🐓','Piggery':'🐷','Greenhouse Farming':'🌱','Crop Processing':'🌾','Mixed Farming':'🚜'}
let as=0
function Lbl({c}:{c:React.ReactNode}){return<span className="block text-[10px] font-mono uppercase tracking-wider text-ink-faint mb-1">{c}</span>}
function RC({label,value,unit,accent=false,amber=false}:{label:string;value:string;unit:string;accent?:boolean;amber?:boolean}){const col=amber?'#f97316':accent?'#0891b2':'#059669';return<div className="bg-surface-subtle rounded-xl p-4 border border-surface-border"><div className="text-[10px] font-mono uppercase tracking-widest text-ink-faint mb-1">{label}</div><div className="font-mono font-bold text-2xl leading-none" style={{color:col}}>{value}<span className="text-sm font-normal text-ink-faint ml-1">{unit}</span></div></div>}
function drawH(canvas:HTMLCanvasElement,profile:number[]){
  const ctx=canvas.getContext('2d');if(!ctx)return
  const W=canvas.width,H=canvas.height;ctx.clearRect(0,0,W,H)
  const mW=Math.max(1,...profile),pL=50,pB=34,pT=14,pR=14,plotW=W-pL-pR,plotH=H-pT-pB,bW=plotW/24
  for(let i=0;i<=5;i++){const y=pT+plotH-(i/5)*plotH;ctx.strokeStyle='#e2e8f0';ctx.lineWidth=i===0?1.5:0.8;ctx.setLineDash(i===0?[]:[3,4]);ctx.beginPath();ctx.moveTo(pL,y);ctx.lineTo(pL+plotW,y);ctx.stroke();ctx.setLineDash([]);const v=(i/5)*mW;ctx.fillStyle='#94a3b8';ctx.font='9px JetBrains Mono,monospace';ctx.textAlign='right';ctx.fillText(v>=1000?`${(v/1000).toFixed(1)}`:`${Math.round(v)}`,pL-4,y+3.5)}
  ctx.save();ctx.translate(10,pT+plotH/2);ctx.rotate(-Math.PI/2);ctx.font='9px JetBrains Mono,monospace';ctx.fillStyle='#94a3b8';ctx.textAlign='center';ctx.fillText('kW',0,0);ctx.restore()
  for(let h=0;h<24;h++){const avg=((profile[h*2]??0)+(profile[h*2+1]??0))/2,bH=(avg/mW)*plotH,x=pL+h*bW,n=h<6||h>=18;const g=ctx.createLinearGradient(0,pT+plotH-bH,0,pT+plotH);g.addColorStop(0,n?'rgba(249,115,22,0.85)':'rgba(8,145,178,0.85)');g.addColorStop(1,'rgba(0,0,0,0.02)');ctx.fillStyle=g;ctx.fillRect(x+1,pT+plotH-bH,Math.max(1,bW-2),bH)}
  ctx.fillStyle='#94a3b8';ctx.font='9px JetBrains Mono,monospace';ctx.textAlign='center'
  for(let h=0;h<24;h+=3)ctx.fillText(`${String(h).padStart(2,'0')}:00`,pL+h*bW+bW/2,pT+plotH+12)
  ctx.fillText('Hour of day',pL+plotW/2,pT+plotH+28)
  ctx.strokeStyle='#e2e8f0';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pL,pT);ctx.lineTo(pL,pT+plotH+1);ctx.stroke();ctx.beginPath();ctx.moveTo(pL,pT+plotH);ctx.lineTo(pL+plotW,pT+plotH);ctx.stroke()
}
export default function AgriculturalTool(){
  const[act,setAct]=useState<AgActivity>('Irrigation')
  const[psh,setPsh]=useState('harare')
  const[mode,setMode]=useState<'standard'|'advanced'>('standard')
  const[rows,setRows]=useState<AgEquipmentRow[]>([])
  const[sel,setSel]=useState(AG_ACTIVITIES['Irrigation'][0].id)
  const[mN,setMN]=useState(''),[mK,setMK]=useState(0),[mF,setMF]=useState('06:00'),[mT,setMT]=useState('18:00')
  const[result,setResult]=useState<SizingResult|null>(null)
  const hRef=useRef<HTMLCanvasElement>(null)
  useEffect(()=>{if(!rows.length){setResult(null);return};setResult(calculateAgriculturalSizing(rows,mode,findPSH(psh).psh,1))},[rows,psh,mode])
  useEffect(()=>{if(!hRef.current)return;if(!result){hRef.current.getContext('2d')?.clearRect(0,0,600,180);return};drawH(hRef.current,result.profile)},[result])
  useEffect(()=>{const eq=AG_ACTIVITIES[act];if(eq.length)setSel(eq[0].id);setRows([])},[act])
  const add=useCallback(()=>{const eq=AG_ACTIVITIES[act].find(e=>e.id===sel);if(!eq)return;as++;setRows(p=>[...p,{rowId:as,eqId:eq.id,name:eq.name,kw:eq.kw,surge:eq.surge,qty:1,periods:[{from:'06:00',to:'18:00'}],customKW:null}])},[act,sel])
  const addM=useCallback(()=>{if(mK<=0){alert('Enter kW>0');return};as++;setRows(p=>[...p,{rowId:as,eqId:'__misc__',name:mN||'Misc',kw:mK,surge:1,qty:1,periods:[{from:mF,to:mT}],customKW:null}])},[mK,mN,mF,mT])
  const rm=(id:number)=>setRows(p=>p.filter(r=>r.rowId!==id))
  const upd=(id:number,patch:Partial<AgEquipmentRow>)=>setRows(p=>p.map(r=>r.rowId===id?{...r,...patch}:r))
  const addP=(id:number)=>setRows(p=>p.map(r=>r.rowId===id?{...r,periods:[...r.periods,{from:'06:00',to:'08:00'}]}:r))
  const rmP=(id:number,i:number)=>setRows(p=>p.map(r=>r.rowId===id?{...r,periods:r.periods.filter((_,j)=>j!==i)}:r))
  const updP=(id:number,i:number,f:'from'|'to',v:string)=>setRows(p=>p.map(r=>r.rowId!==id?r:{...r,periods:r.periods.map((p,j)=>j===i?{...p,[f]:v}:p)}))
  return(
    <section id="agricultural" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-10">
          <div className="section-eyebrow">Free tool — Agricultural</div>
          <h2 className="font-disp font-extrabold text-4xl sm:text-5xl text-ink uppercase leading-tight mb-4">Agricultural<br/><span className="brand-text-teal">Solar Sizing Tool</span></h2>
          <p className="text-ink-muted text-base leading-relaxed">Farm loads are different. Pumps and motors draw <strong className="text-ink">2–3× their rated power on startup</strong>. Select your farm activity — the equipment list filters automatically.</p>
        </div>
        <div className="card-flat rounded-2xl overflow-hidden">
          <div className="flex flex-wrap gap-3 px-6 py-4 border-b border-surface-border bg-surface-subtle">
            {(Object.keys(AG_ACTIVITIES)as AgActivity[]).map(a=><button key={a} onClick={()=>setAct(a)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider border transition-all ${act===a?'border-brand-green text-brand-green bg-green-50':'border-surface-border text-ink-faint bg-white'}`}><span>{IC[a]}</span>{a}</button>)}
          </div>
          <div className="flex flex-wrap gap-4 items-center px-6 py-3 border-b border-surface-border bg-white">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-ink-faint">Mode</span>
              <div className="flex rounded-lg overflow-hidden border border-surface-border">
                {(['standard','advanced']as const).map(m=><button key={m} onClick={()=>setMode(m)} className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all ${mode===m?'tab-active bg-surface-muted':'text-ink-faint bg-white'}`}>{m}</button>)}
              </div>
              {mode==='advanced'&&<span className="text-[10px] font-mono text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">Power override &amp; multiple periods</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-ink-faint">Location</span>
              <div className="relative">
                <select value={psh} onChange={e=>setPsh(e.target.value)} className="tool-input text-xs pr-7" style={{minWidth:200}}>
                  {PSH_TABLE.map(g=><optgroup key={g.group} label={g.group}>{g.options.map(o=><option key={o.id} value={o.id}>{o.label} — {o.psh} PSH</option>)}</optgroup>)}
                </select>
                <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none"/>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-surface-border bg-white">
            <div className="p-6 flex flex-col gap-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-ink-faint">Equipment schedule</h3>
              <div className="flex gap-2">
                <select value={sel} onChange={e=>setSel(e.target.value)} className="tool-input flex-1 text-xs">
                  {AG_ACTIVITIES[act].map(eq=><option key={eq.id} value={eq.id}>{eq.name} ({eq.kw} kW)</option>)}
                </select>
                <button onClick={add} className="btn-teal flex-shrink-0 py-2 px-4 text-xs"><Plus size={14}/> Add</button>
              </div>
              {rows.length>0&&<div className="grid gap-2 px-1" style={{gridTemplateColumns:'1fr 52px 96px 96px 32px'}}>{['Equipment','Qty','From','To',''].map((h,i)=><Lbl key={i} c={h}/>)}</div>}
              <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                {rows.length===0&&<div className="text-center py-10 text-ink-faint font-mono text-xs uppercase">Add equipment above ↑</div>}
                {rows.map(r=>(
                  <div key={r.rowId} className="rounded-xl bg-surface-subtle border border-surface-border p-3 flex flex-col gap-2">
                    <div className="grid gap-2 items-center" style={{gridTemplateColumns:'1fr 52px 96px 96px 32px'}}>
                      <div className="font-mono text-[11px] text-ink truncate">{r.name}<span className="text-ink-faint ml-1 text-[10px]">({mode==='advanced'&&r.customKW?r.customKW:r.kw}kW)</span></div>
                      <input type="number" min={1} value={r.qty} onChange={e=>upd(r.rowId,{qty:Math.max(1,parseInt(e.target.value)||1)})} className="tool-input text-center text-xs"/>
                      <input type="time" value={r.periods[0]?.from??'06:00'} onChange={e=>updP(r.rowId,0,'from',e.target.value)} className="tool-input text-xs"/>
                      <input type="time" value={r.periods[0]?.to??'18:00'} onChange={e=>updP(r.rowId,0,'to',e.target.value)} className="tool-input text-xs"/>
                      <button onClick={()=>rm(r.rowId)} className="text-ink-faint hover:text-red-500 flex items-center justify-center"><Trash2 size={13}/></button>
                    </div>
                    {mode==='advanced'&&(
                      <div className="flex flex-col gap-2 pl-2 border-l-2 border-brand-green/30">
                        <div className="flex items-center gap-2 flex-wrap"><Lbl c="Custom power (kW)"/><input type="number" min={0.1} step={0.1} placeholder={String(r.kw)} value={r.customKW??''} onChange={e=>upd(r.rowId,{customKW:e.target.value===''?null:parseFloat(e.target.value)})} className="tool-input text-xs w-24"/>{r.customKW&&<span className="text-[10px] font-mono text-amber-600">override: {r.customKW} kW</span>}</div>
                        {r.periods.slice(1).map((p,idx)=>(<div key={idx} className="flex items-center gap-2 flex-wrap"><Lbl c={`Period ${idx+2}`}/><span className="text-[10px] font-mono text-ink-faint">From</span><input type="time" value={p.from} onChange={e=>updP(r.rowId,idx+1,'from',e.target.value)} className="tool-input text-xs w-24"/><span className="text-[10px] font-mono text-ink-faint">To</span><input type="time" value={p.to} onChange={e=>updP(r.rowId,idx+1,'to',e.target.value)} className="tool-input text-xs w-24"/><button onClick={()=>rmP(r.rowId,idx+1)} className="text-ink-faint hover:text-red-500"><X size={12}/></button></div>))}
                        <button onClick={()=>addP(r.rowId)} className="self-start flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase border border-brand-green/40 text-brand-green hover:bg-green-50 transition-all"><Clock size={11}/> Add another period</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-xs font-mono text-ink-faint">{rows.length} equipment items added</div>
              <details className="rounded-xl border border-surface-border overflow-hidden">
                <summary className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-brand-green cursor-pointer bg-green-50 list-none flex items-center gap-2"><Plus size={12}/> Add miscellaneous load</summary>
                <div className="p-4 bg-white grid grid-cols-2 gap-3">
                  <div className="col-span-2"><Lbl c="Description"/><input value={mN} onChange={e=>setMN(e.target.value)} placeholder="e.g. Farm office lights" className="tool-input text-xs"/></div>
                  <div><Lbl c="Power (kW)"/><input type="number" min={0} step={0.1} value={mK} onChange={e=>setMK(parseFloat(e.target.value)||0)} className="tool-input text-xs"/></div>
                  <div><Lbl c="Time of use"/><div className="flex gap-1"><div className="flex-1"><Lbl c="From"/><input type="time" value={mF} onChange={e=>setMF(e.target.value)} className="tool-input text-xs"/></div><div className="flex-1"><Lbl c="To"/><input type="time" value={mT} onChange={e=>setMT(e.target.value)} className="tool-input text-xs"/></div></div></div>
                  <div className="col-span-2"><button onClick={addM} className="btn-teal w-full justify-center">Add miscellaneous load</button></div>
                </div>
              </details>
            </div>
            <div className="p-6 flex flex-col gap-5">
              <h3 className="font-mono text-xs uppercase tracking-widest text-ink-faint">Results — {findPSH(psh).label}</h3>
              <div className="bg-surface-subtle rounded-xl p-3 border border-surface-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-ink-faint uppercase">24-hour load profile</span>
                  <div className="flex gap-3 text-[9px] font-mono text-ink-faint"><span><span className="inline-block w-2 h-2 rounded-sm mr-1 align-middle" style={{background:'#0891b2'}}/>Day</span><span><span className="inline-block w-2 h-2 rounded-sm mr-1 align-middle" style={{background:'#f97316'}}/>Night</span></div>
                </div>
                <canvas ref={hRef} width={560} height={180} className="w-full rounded-lg" style={{height:130}}/>
                {!result&&<div className="text-center text-ink-faint font-mono text-xs py-2">Add equipment to see profile →</div>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <RC label="Daily energy" value={result?result.Ed_kWh.toFixed(2):'—'} unit="kWh/day" accent/>
                <RC label="Maximum running demand" value={result?result.Peak_kW.toFixed(2):'—'} unit="kW" amber/>
                <RC label="Recommended inverter size" value={result?String(result.invSize):'—'} unit="kW"/>
                <RC label="Recommended surge withstand" value={result?result.Surge_kW.toFixed(2):'—'} unit="kW" amber/>
                <RC label="Recommended battery" value={result?result.CbattRounded.toFixed(1):'—'} unit="kWh" accent/>
                <RC label="Recommended PV array" value={result?result.PpvRounded.toFixed(2):'—'} unit="kWp"/>
              </div>
              {result&&<div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-xs font-mono text-green-700">≈ {result.panelCount} panels @ 550 Wp · Night {result.Enight_kWh.toFixed(2)} kWh · Day {result.Eday_kWh.toFixed(2)} kWh</div>}
              <a href="#contact" className="btn-teal justify-center"><Zap size={13}/> Request a detailed agricultural design</a>
              <p className="text-[10px] font-mono text-ink-faint leading-relaxed">Inverter sized at 1.3× peak running demand to nearest standard size. Final design must be verified by a qualified engineer before installation.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
