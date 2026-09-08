'use client'
import { Zap, ChevronDown, Sun, Battery, BarChart3 } from 'lucide-react'
import { useLang } from './LanguageProvider'

export default function Hero() {
  const { t } = useLang()
  const STATS=[{val:t.hero.stat1v,label:t.hero.stat1l},{val:t.hero.stat2v,label:t.hero.stat2l},{val:t.hero.stat3v,label:t.hero.stat3l},{val:t.hero.stat4v,label:t.hero.stat4l}]
  const TOOL_PILLS=[{icon:<BarChart3 size={14}/>,label:t.hero.pill1,color:'#2621FF',href:'#sizing'},{icon:<Sun size={14}/>,label:t.hero.pill2,color:'#C6741E',href:'#agricultural'},{icon:<Battery size={14}/>,label:t.hero.pill3,color:'#0B1220',href:'#battery'}]
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white pt-16">
      <div className="absolute inset-0 bg-schematic opacity-70 pointer-events-none"/>
      <div className="absolute top-10 right-[-120px] w-[560px] h-[560px] rounded-full pointer-events-none orb-pulse" style={{background:'radial-gradient(circle,rgba(38,33,255,0.08) 0%,transparent 70%)'}}/>
      <div className="absolute bottom-0 left-[-100px] w-[420px] h-[420px] rounded-full pointer-events-none orb-pulse" style={{background:'radial-gradient(circle,rgba(198,116,30,0.09) 0%,transparent 70%)',animationDelay:'3s'}}/>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-14 items-center">
          <div>
            <div className="section-eyebrow">{t.hero.eyebrow}</div>
            <h1 className="font-disp font-extrabold text-4xl sm:text-5xl md:text-6xl xl:text-[4.5rem] leading-[1.05] tracking-tight text-ink mb-6">
              {t.hero.h1a}<br/><span className="brand-text">{t.hero.h1b}</span><br/>{t.hero.h1c}
            </h1>
            <p className="text-lg text-ink-muted leading-relaxed mb-4 max-w-lg">{t.hero.p1.split('{free}')[0]}<strong className="text-ink font-semibold">{t.hero.p1Strong}</strong>{t.hero.p1.split('{free}')[1]}</p>
            <p className="text-base text-ink-faint mb-8 max-w-md">{t.hero.p2}</p>
            <div className="flex flex-wrap gap-4 mb-10">
              <a href="#sizing" className="btn-primary"><Zap size={16}/> {t.hero.cta1}</a>
              <a href="#why" className="btn-secondary">{t.hero.cta2}</a>
            </div>
            <div className="flex flex-wrap gap-3 mb-10">
              {TOOL_PILLS.map(p=>(
                <a key={p.label} href={p.href} className="flex items-center gap-2 px-4 py-2 rounded-full border bg-white font-mono text-xs font-semibold uppercase tracking-wider transition-all hover:shadow-md hover:-translate-y-0.5" style={{borderColor:`${p.color}40`,color:p.color}}>
                  {p.icon} {p.label}
                </a>
              ))}
            </div>
            <div className="flex flex-wrap gap-8">
              {STATS.map(s=>(
                <div key={s.label}>
                  <div className="font-disp font-bold text-2xl brand-text-orange">{s.val}</div>
                  <div className="text-xs font-mono text-ink-faint uppercase tracking-wider mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Signature moment: the energy-flow schematic — sun to socket, drawn as one live circuit */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-2xl border border-surface-border bg-white shadow-card-lg overflow-hidden">
              <div className="flex items-center justify-between px-6 pt-5">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-ink-faint mb-1">System trace — live estimate</div>
                  <div className="font-disp font-bold text-lg text-ink">Harare residence, 3-bed</div>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-brand-orange">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse"/>Sizing
                </span>
              </div>

              <svg viewBox="0 0 460 260" className="w-full h-auto px-2 py-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* base wiring */}
                <path d="M60 60 H230 V130 H400" stroke="#E4E0D5" strokeWidth="2"/>
                <path d="M60 60 V200 H230 V130" stroke="#E4E0D5" strokeWidth="2"/>
                <path d="M230 130 V200 H400" stroke="#E4E0D5" strokeWidth="2"/>
                {/* live pulse tracing the same paths */}
                <path d="M60 60 H230 V130 H400" stroke="#2621FF" strokeWidth="2.5" className="flow-line" pathLength={220}/>
                <path d="M60 60 V200 H230 V130" stroke="#C6741E" strokeWidth="2.5" className="flow-line" pathLength={220} style={{animationDelay:'.6s'}}/>

                {/* Sun */}
                <g className="node-glow" style={{color:'#E89A4A'}}>
                  <circle cx="60" cy="60" r="20" fill="#FFF7EC" stroke="#E89A4A" strokeWidth="1.5"/>
                  <circle cx="60" cy="60" r="7" fill="#E89A4A"/>
                </g>
                <text x="60" y="94" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#8B93A3">PV ARRAY</text>
                <text x="60" y="106" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="JetBrains Mono, monospace" fill="#0B1220">4.0 kWp</text>

                {/* Charge controller */}
                <rect x="212" y="112" width="36" height="36" rx="6" fill="#F1EEE6" stroke="#CFC9B8"/>
                <text x="230" y="164" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#8B93A3">CONTROLLER</text>

                {/* Battery */}
                <g className="node-glow" style={{color:'#2621FF'}}>
                  <rect x="14" y="184" width="46" height="32" rx="5" fill="#EEEDFF" stroke="#2621FF" strokeWidth="1.5"/>
                </g>
                <text x="37" y="230" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#8B93A3">BATTERY</text>
                <text x="37" y="242" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="JetBrains Mono, monospace" fill="#0B1220">5.0 kWh</text>

                {/* Inverter */}
                <rect x="207" y="184" width="46" height="32" rx="5" fill="#F1EEE6" stroke="#CFC9B8"/>
                <text x="230" y="230" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#8B93A3">INVERTER</text>
                <text x="230" y="242" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="JetBrains Mono, monospace" fill="#0B1220">5.0 kW</text>

                {/* Home / load */}
                <g className="node-glow" style={{color:'#C6741E'}}>
                  <rect x="378" y="112" width="44" height="36" rx="6" fill="#FFF3E7" stroke="#C6741E" strokeWidth="1.5"/>
                </g>
                <text x="400" y="164" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#8B93A3">HOME LOAD</text>
                <text x="400" y="176" textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="JetBrains Mono, monospace" fill="#0B1220">2.8 kW pk</text>
              </svg>

              <div className="border-t border-surface-border px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-wider text-ink-faint">Battery runtime</div>
                  <div className="font-mono font-bold text-sm text-ink">5 kWh → 7.6 hrs</div>
                </div>
                <a href="#sizing" className="btn-primary text-xs"><Zap size={13}/> Try the sizing tool</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <a href="#why" aria-label="Scroll to learn more" className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"><ChevronDown size={22} className="text-ink-faint"/></a>
    </section>
  )
}
