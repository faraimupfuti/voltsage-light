'use client'
import { AlertTriangle, BadgeDollarSign, HelpCircle, FileWarning, Gauge, ShieldOff } from 'lucide-react'
const PROBLEMS=[
  {icon:<Gauge size={22}/>,title:'Installers size systems by guessing',body:'Most solar installers don\'t do a proper load analysis before recommending a system size. They estimate based on your electricity bill or the number of bedrooms — not on what appliances you actually run and when. The result is a system that\'s either too big (you overpay) or too small (it trips and underperforms).',stat:'A 10-minute load analysis prevents years of regret.',color:'#1B17FF'},
  {icon:<BadgeDollarSign size={22}/>,title:'Three quotes, three different systems — which is right?',body:'One installer says 5 kW, another says 8 kW, a third says 10 kW — all for the same house. Without knowing your own numbers, you can\'t judge which is correct. You end up choosing on price, not on accuracy.',stat:'Know your numbers first. Then compare quotes on equal terms.',color:'#14109E'},
  {icon:<HelpCircle size={22}/>,title:'Solar jargon keeps buyers in the dark',body:'kWp, DoD, PSH, SLD, BoQ — the industry is full of technical terms that most buyers don\'t understand. This information gap benefits sellers, not buyers. You should understand what you\'re buying before you sign anything.',stat:'Our tools and articles explain everything in plain language.',color:'#0f172a'},
  {icon:<FileWarning size={22}/>,title:'Nobody tells you how long your battery will actually last',body:'A "10 kWh battery" doesn\'t mean 10 kWh of backup. Depth of discharge, efficiency losses and your actual load all reduce what you get. Most buyers find this out after installation — when it\'s too late.',stat:'Use the Battery Runtime Calculator before you buy a battery.',color:'#1e293b'},
  {icon:<AlertTriangle size={22}/>,title:'Farms and agricultural sites need special treatment',body:'A borehole pump drawing 1.1 kW while running can demand 3–4 kW when it starts. If your inverter isn\'t sized for that startup surge, it will trip every single time the pump kicks on.',stat:'The agricultural sizing tool accounts for motor starting currents.',color:'#4640FF'},
  {icon:<ShieldOff size={22}/>,title:'Every company that reviews your quote also wants to sell you something',body:'There is no such thing as a free and unbiased review from a company that sells equipment. VoltSage earns nothing from the panels, inverters or batteries you buy.',stat:'No equipment sold. No commissions. Just engineering.',color:'#64748b'},
]
export default function ProblemsSection() {
  return (
    <section id="problems" className="py-24 bg-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-14">
          <div className="section-eyebrow">The solar industry problem</div>
          <h2 className="font-disp font-extrabold text-4xl sm:text-5xl text-ink uppercase leading-tight mb-5">Six things that go wrong<br/><span className="brand-text">when you skip the sizing step</span></h2>
          <p className="text-ink-muted text-lg leading-relaxed">Most solar problems are not caused by bad equipment or bad installers. They are caused by not knowing the right system size before the purchase decision is made. VoltSage exists to fix that — for free, before you spend a cent.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROBLEMS.map((p,i)=>(
            <div key={i} className="card p-6 problem-card group">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{background:`${p.color}12`}}><span style={{color:p.color}}>{p.icon}</span></div>
                <h3 className="font-disp font-bold text-base text-ink uppercase leading-tight pt-1">{p.title}</h3>
              </div>
              <p className="text-ink-muted text-sm leading-relaxed mb-4">{p.body}</p>
              <div className="border-t border-surface-border pt-3"><p className="text-xs font-mono" style={{color:p.color}}>{p.stat}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-2xl overflow-hidden border border-surface-border" style={{background:'linear-gradient(135deg,rgba(249,115,22,0.04),rgba(8,145,178,0.04))'}}>
          <div className="p-8 flex flex-col sm:flex-row items-center gap-6 justify-between">
            <div>
              <h3 className="font-disp font-bold text-2xl text-ink uppercase mb-2">Use VoltSage before you talk to any installer.</h3>
              <p className="text-ink-muted text-sm">It takes 5 minutes. It&apos;s free. And it could save you thousands.</p>
            </div>
            <a href="#sizing" className="btn-primary flex-shrink-0">Start Sizing Free →</a>
          </div>
        </div>
      </div>
    </section>
  )
}
