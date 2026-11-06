'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Droplets, MapPin, Navigation, ShieldCheck, Sparkles, Sun, Thermometer, Umbrella, Wind, Zap } from 'lucide-react'

const steps = ['Home', 'Assessment', 'Results', 'Recovery', 'Facilities', 'Verify', 'Outcome']

function Logo() {
  return <div className="brand"><span className="brand-mark"><Sun /></span><span>HeatShield <b>AI</b></span></div>
}

function Button({ children, onClick, secondary = false }: { children: React.ReactNode; onClick: () => void; secondary?: boolean }) {
  return <button className={secondary ? 'button secondary' : 'button'} onClick={onClick}>{children}<ArrowRight data-icon="inline-end" /></button>
}

function Header({ step, back }: { step: number; back?: () => void }) {
  return <header className="topbar"><div className="topbar-inner">{back ? <button className="icon-button" onClick={back} aria-label="Go back"><ArrowLeft /></button> : <Logo />}<div className="step-count">{step > 0 && <><span>0{step}</span> / 06</>}</div>{back && <div className="mini-logo"><Logo /></div>}</div></header>
}

export default function Page() {
  const [screen, setScreen] = useState(0)
  const [hours, setHours] = useState(5)
  const [work, setWork] = useState('Delivery Rider')
  const [breakTime, setBreakTime] = useState('10 minutes')
  const [hydration, setHydration] = useState('Somewhat Hydrated')
  const [verified, setVerified] = useState(false)

  const next = () => setScreen((s) => Math.min(6, s + 1))
  const reset = () => setScreen(0)

  return <div className="app-shell">
    <Header step={screen} back={screen > 0 ? () => setScreen(screen - 1) : undefined} />
    <main className="main-content">
      {screen === 0 && <section className="screen home-screen">
        <div className="hero-copy"><div className="eyebrow"><span className="live-dot" /> LIVE HEAT MONITOR</div><h1>Make every<br /><em>recovery</em> count.</h1><p className="hero-sub">Real-time heat guidance for the people who keep our cities moving.</p></div>
        <div className="location-card"><div className="location-row"><div className="pin"><MapPin /></div><div><span className="label">CURRENT LOCATION</span><strong>Hyderabad, IN</strong></div><span className="updated">Updated now</span></div><div className="weather-row"><div><span className="temp">42<span>°C</span></span><span className="condition">Extreme heat</span></div><div className="risk-badge"><span /> HIGH RISK</div></div><div className="weather-meta"><span><Wind /> 68% humidity</span><span><Sun /> UV index 11</span><span><Zap /> Feels like 49°</span></div></div>
        <Button onClick={next}>Start assessment</Button>
        <div className="info-grid"><div className="info-card accent"><Thermometer /><strong>Why this matters</strong><p>Heat stress can build before you feel it. Make a safer call.</p></div><div className="info-card"><Umbrella /><strong>Quick safety tips</strong><p>Hydrate often, find shade, and take breaks early.</p></div></div>
      </section>}

      {screen === 1 && <section className="screen"><div className="section-heading"><div className="eyebrow">PERSONALIZE YOUR CHECK-IN</div><h2>Tell us about<br /><em>your shift.</em></h2><p>A few details help us calculate your personal heat exposure.</p></div><div className="form-stack"><label>WHAT DO YOU DO?</label><div className="option-grid">{['Delivery Rider', 'Construction Worker', 'Street Vendor'].map(x => <button key={x} className={work === x ? 'option active' : 'option'} onClick={() => setWork(x)}>{x}<span>{x === 'Delivery Rider' ? '●' : x === 'Construction Worker' ? '◆' : '▲'}</span></button>)}</div><label>HOURS WORKED TODAY <b>{hours} hrs</b></label><input className="range" type="range" min="0" max="12" value={hours} onChange={e => setHours(+e.target.value)} /><div className="range-labels"><span>0 hrs</span><span>12 hrs</span></div><label>AVAILABLE BREAK TIME</label><div className="pill-row">{['5 minutes', '10 minutes', '15 minutes', '20+ minutes'].map(x => <button key={x} className={breakTime === x ? 'pill active' : 'pill'} onClick={() => setBreakTime(x)}>{x}</button>)}</div><label>HOW HYDRATED ARE YOU?</label><div className="pill-row">{['Well Hydrated', 'Somewhat Hydrated', 'Dehydrated'].map(x => <button key={x} className={hydration === x ? 'pill active' : 'pill'} onClick={() => setHydration(x)}>{x}</button>)}</div></div><Button onClick={next}>Calculate heat exposure</Button></section>}

      {screen === 2 && <section className="screen results-screen"><div className="eyebrow">YOUR HEAT EXPOSURE</div><h2>Pause. Check in.<br /><em>Stay safer.</em></h2><div className="score-card"><div className="score-ring"><div><strong>82</strong><span>/100</span></div></div><div className="risk-title"><span className="risk-badge"><span /> HIGH RISK</span><p>Recovery recommended now</p></div></div><div className="metrics">{[['Temperature','42°C'],['Humidity','68%'],['Hours worked',`${hours} hrs`],['Hydration','Moderate']].map(([a,b]) => <div key={a}><span>{a}</span><strong>{b}</strong></div>)}</div><div className="insight"><Sparkles /><div><strong>AI insight</strong><p>You have been exposed to high heat conditions for an extended period. A recovery break is recommended.</p></div></div><Button onClick={next}>Find recovery options</Button></section>}

      {screen === 3 && <section className="screen"><div className="eyebrow">AI RECOVERY PLAN</div><h2>Your next move<br /><em>is simple.</em></h2><div className="recommend-card"><div className="rec-icon"><Droplets /></div><span className="label">RECOMMENDED ACTION</span><h3>Take a 10-minute<br />cooling break.</h3><ul><li><Check /> Drink 500ml water.</li><li><Check /> Avoid direct sun exposure.</li></ul></div><div className="facility-feature"><div><span className="label">RECOMMENDED FACILITY</span><h3>Ashray Centre A</h3><p>450m away · 5 min walk</p></div><div className="potential"><strong>65%</strong><span>Recovery<br />potential</span></div></div><div className="confidence"><span>Confidence score</span><strong>92%</strong><div className="bar"><i /></div></div><p className="reason">“Best balance of distance, cooling infrastructure, and recovery effectiveness within your available break time.”</p><Button onClick={next}>View facilities</Button></section>}

      {screen === 4 && <section className="screen facilities-screen"><div className="eyebrow">NEARBY RECOVERY OPTIONS</div><div className="fac-heading"><div><h2>Find your<br /><em>cool down.</em></h2></div><button className="map-toggle"><MapPin /> Map</button></div><div className="map"><div className="map-grid" /><div className="map-road r1" /><div className="map-road r2" /><div className="map-road r3" /><div className="map-pin main"><MapPin /></div><div className="map-pin p2"><MapPin /></div><div className="map-pin p3"><MapPin /></div><div className="you"><span /> You are here</div></div><div className="facility-list">{[['Ashray Centre A','450m','AC','92%','95'],['Community Rest Point','250m','Fan','80%','70'],['Transit Cooling Hub','600m','AC','88%','89']].map((x,i)=><div className={i===0?'facility-card best':'facility-card'} key={x[0]}>{i===0 && <span className="best-badge">BEST OPTION</span>}<div className="facility-top"><div><h3>{x[0]}</h3><p><Navigation /> {x[1]} · 5 min walk</p></div><div className="trust"><strong>{x[3]}</strong><span>Trust score</span></div></div><div className="facility-tags"><span><Droplets /> Water</span><span><ShieldCheck /> Restroom</span><span><Wind /> {x[2]}</span></div><div className="recovery-line"><span>Recovery score</span><strong>{x[4]}</strong></div></div>)}</div><Button onClick={next}>Verify facility</Button></section>}

      {screen === 5 && <section className="screen"><div className="eyebrow">FACILITY CHECK-IN</div><h2>Is it ready<br /><em>for you?</em></h2><p className="section-lead">A quick check from someone nearby keeps this information fresh for the next worker.</p><div className="verify-card">{[['Water available?','water'],['Restroom open?','restroom'],['Seating available?','seating']].map((q)=><div className="verify-row" key={q[1]}><span>{q[0]}</span><div><button className="yes active">Yes</button><button className="no">No</button></div></div>)}<div className="verify-row"><span>Crowd level</span><div className="crowd"><button className="active">Low</button><button>Medium</button><button>High</button></div></div></div>{verified && <div className="success"><Check /><span><strong>Verification submitted</strong><small>Verified by a nearby worker 3 minutes ago.</small></span></div>}<Button onClick={() => { setVerified(true); setTimeout(next, 500) }}>{verified ? 'Continue' : 'Submit verification'}</Button></section>}

      {screen === 6 && <section className="screen outcome-screen"><div className="success-orb"><Check /></div><div className="eyebrow">RECOVERY COMPLETE</div><h2>Good call.<br /><em>You’re safer now.</em></h2><div className="before-after"><div><span>BEFORE</span><strong>82</strong><small>High risk</small></div><div className="arrow"><ArrowRight /></div><div className="after"><span>AFTER</span><strong>48</strong><small>Moderate risk</small></div></div><div className="resume"><ShieldCheck /><div><strong>Safe to resume work</strong><p>Keep hydrating and check in again in 60 minutes.</p></div></div><div className="summary"><span>RECOVERY SUMMARY</span><p><Check /> Cooling break completed</p><p><Check /> Hydration completed</p><p><Check /> Risk reduced</p></div><Button onClick={reset}>Start new assessment</Button></section>}
    </main>
    <footer><span>HEATSHIELD AI</span><span>Designed for the people who keep us moving.</span></footer>
  </div>
}
