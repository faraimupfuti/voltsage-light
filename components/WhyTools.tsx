'use client'
import { ShieldCheck, Clock, BadgeCheck, Calculator, MapPin, Gift } from 'lucide-react'
const WHY=[
  {icon:Calculator,color:'#f97316',title:'You\'ll know exactly what size system you need',body:'Without a sizing tool, you\'re guessing. Our tool builds a real picture of how much electricity you use and when, then tells you the right inverter size, battery capacity and number of solar panels.'},
  {icon:ShieldCheck,color:'#0891b2',title:'You won\'t overpay for a system that\'s too big',body:'Installers often oversize systems to be "safe" — but you pay for every extra kilowatt. Knowing your actual numbers means you can push back on any quote that recommends more than you need.'},
  {icon:BadgeCheck,color:'#059669',title:'You won\'t be left with a system that\'s too small',body:'An undersized system trips and shuts down when too many appliances run at once. Our tool calculates your peak demand and surge requirements so the system handles everything simultaneously.'},
  {icon:Clock,color:'#d97706',title:'You can compare quotes from different installers fairly',body:'When you know you need a 5 kW inverter, 10 kWh battery and 8 kWp of panels — you can compare every quote on the same terms. Without those numbers, you\'re comparing apples to oranges.'},
  {icon:MapPin,color:'#8b5cf6',title:'Your system is sized for your actual location',body:'Solar performs differently in Bulawayo versus Manicaland, in Egypt versus Ghana. Our tools use real peak sun hour data for your exact province or country — not a generic average.'},
  {icon:Gift,color:'#ec4899',title:'It\'s completely free — no strings attached',body:'Residential sizing, agricultural sizing, battery runtime — all free, forever. We don\'t sell equipment and we don\'t earn a commission on what you buy.'},
]
const TOOLS=[
  {name:'Residential & Small Commercial Sizing Tool',who:'For homeowners, offices, shops and small businesses',what:'Add the appliances you want to power and the times they run. The tool builds a 24-hour load profile and tells you the recommended inverter size, battery capacity and PV array.',href:'#sizing',color:'#0891b2',cta:'Size my home or office →'},
  {name:'Agricultural Solar Sizing Tool',who:'For farmers, irrigation, poultry, dairy and crop processors',what:'Farm equipment like borehole pumps draw 2–3× their rated power on startup. This tool accounts for that and gives you the right system size for your specific farm activity.',href:'#agricultural',color:'#059669',cta:'Size my farm →'},
  {name:'Battery Runtime Calculator',who:'For anyone who wants to know how long their battery will last',what:'Enter your battery size, discharge depth, efficiency and load. Get the exact hours of backup — before you spend money on a battery.',href:'#battery',color:'#f97316',cta:'Calculate my runtime →'},
]
export default function WhyTools() {
  return (
    <>
      <section id="why" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-6">
            <div className="section-eyebrow justify-center">Use VoltSage first — before you buy anything</div>
            <h2 className="font-disp font-extrabold text-4xl sm:text-5xl text-ink uppercase leading-tight mb-5">Why you should size your<br/><span className="brand-text">system before you buy it</span></h2>
            <p className="text-ink-muted text-lg">A solar system is a major investment. Buying the wrong size is a mistake that costs you money and doesn&apos;t get fixed easily.</p>
          </div>
          <div className="flex justify-center mb-14">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-amber-200 bg-amber-50">
              <span className="text-xl">💡</span>
              <span className="font-mono text-sm text-ink-muted uppercase tracking-wider">Come to VoltSage <strong className="text-ink">first</strong> — then talk to installers</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY.map((b,i)=>(
              <div key={i} className="card p-6 group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{background:`linear-gradient(90deg,${b.color},transparent)`}}/>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:`${b.color}12`}}>
                    <b.icon size={20} style={{color:b.color}}/>
                  </div>
                  <h3 className="font-disp font-bold text-sm text-ink uppercase leading-tight">{b.title}</h3>
                </div>
                <p className="text-ink-muted text-sm leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 bg-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <div className="section-eyebrow">Three free tools — use them all</div>
            <h2 className="font-disp font-extrabold text-4xl sm:text-5xl text-ink uppercase leading-tight mb-4">What VoltSage<br/><span className="brand-text">gives you for free</span></h2>
            <p className="text-ink-muted text-base leading-relaxed">No account. No payment. No sales call first. Just open the tool, enter your details, and get the numbers you need — in minutes.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {TOOLS.map((t,i)=>(
              <div key={i} className="gradient-border rounded-2xl overflow-hidden">
                <div className="card-flat p-6 h-full flex flex-col">
                  <div className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{color:t.color}}>{t.who}</div>
                  <h3 className="font-disp font-bold text-xl text-ink uppercase mb-3">{t.name}</h3>
                  <p className="text-ink-muted text-sm flex-1 mb-6 leading-relaxed">{t.what}</p>
                  <a href={t.href} className={`${i===2?'btn-primary':'btn-teal'} justify-center`}>{t.cta}</a>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 rounded-2xl border border-surface-border bg-white p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-disp font-bold text-2xl text-ink uppercase mb-3">Why is it <span className="brand-text-teal">essential</span> to use these tools before you buy?</h3>
                <p className="text-ink-muted text-sm leading-relaxed mb-4">Solar systems are not like buying a phone. Once panels are on your roof and an inverter is wired in, fixing the wrong size means spending more money. The sizing tools take your actual appliances, your actual schedule, and your actual location — and turn that into the correct system size.</p>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  {t:'Wrong inverter size = system trips every time the pump starts',ok:false},
                  {t:'Wrong battery size = runs out of power at 2am every night',ok:false},
                  {t:'Wrong PV array size = battery never fully charges in winter',ok:false},
                  {t:'Right size = system works reliably, every day, for 15+ years',ok:true},
                ].map((p,i)=>(
                  <div key={i} className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 text-[10px] font-bold ${p.ok?'text-white':'text-red-500 bg-red-50 border border-red-200'}`} style={p.ok?{background:'linear-gradient(135deg,#059669,#0891b2)'}:{}}>
                      {p.ok?'✓':'✕'}
                    </span>
                    <p className={`text-sm font-mono ${p.ok?'text-ink font-semibold':'text-ink-muted'}`}>{p.t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
