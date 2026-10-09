import { Link } from 'react-router-dom'
import { Map, CalendarClock, BarChart3, ClipboardList, Check, ArrowRight } from 'lucide-react'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Reveal from '../components/Reveal.jsx'

const CHALLENGES = [
  { icon: '😓', title: 'Food Scattered', text: '10 restaurants donate 5-10 servings each. Hard to track and collect all.' },
  { icon: '⏰', title: 'Time Pressure', text: 'Food expires quickly. Need to coordinate pickups within narrow windows.' },
  { icon: '📊', title: 'No Visibility', text: "Can't see available food in real-time. Miss donation opportunities." },
]

const SOLUTIONS = [
  {
    icon: Map,
    title: 'Bulk Collection View',
    text: 'See ALL available food donations on one map. Filter by quantity, type, and proximity. Plan optimal collection routes.',
    extra: 'Hotel A (50 servings) + Wedding B (100 servings) + Office C (30 servings) = 180 servings in one route',
  },
  {
    icon: CalendarClock,
    title: 'Scheduled Pickups',
    text: "Reserve multiple food posts in advance. Donors hold food for verified NGOs.",
    points: ["Reserve food up to 2 hours in advance", "Auto-notify donors when you're en route", 'Priority access for verified NGOs'],
  },
  {
    icon: BarChart3,
    title: 'Impact Dashboard',
    text: 'Track total meals collected, beneficiaries fed, and food waste prevented. Share impact reports with donors and funders.',
    stats: [
      { num: '1,247', label: 'Meals Collected' },
      { num: '843', label: 'People Fed' },
      { num: '312kg', label: 'Waste Saved' },
    ],
  },
  {
    icon: ClipboardList,
    title: 'Beneficiary Management',
    text: 'Log distribution to beneficiaries. Track who received what, when, and where. Generate reports for accountability.',
    points: ['Digital distribution logs', 'Beneficiary photo verification', 'Auto-generate monthly reports'],
  },
]

const CASE_STEPS = [
  { title: 'Morning: Check NGO Dashboard', text: 'See 15 food posts available: 5 hotels, 3 weddings, 7 office canteens. Total: 850 servings.' },
  { title: 'Reserve & Route Planning', text: 'Reserve 10 posts (closest locations). App generates optimal pickup route. ETA: 2.5 hours.' },
  { title: 'Collection Complete', text: 'Collected 650 servings (some posts were taken by others). Enough to feed 1,000 kids lunch.' },
  { title: 'Distribution & Impact', text: 'Serve meals at 3 community centers. Upload proof photos. Dashboard updates: "1,000 beneficiaries fed today."' },
]

const ENABLE_STEPS = [
  {
    title: 'Contact Us',
    lines: ['Email: ngo@foodrescue.org', 'WhatsApp: +91 98765-43210'],
    sub: 'Provide NGO registration details',
  },
  {
    title: 'Verification',
    lines: ['We verify your NGO status (usually within 24 hours)'],
    sub: 'Required: Registration certificate + ID proof',
  },
  {
    title: 'Activate',
    lines: ['Get NGO badge + access to bulk features'],
    sub: 'Start collecting & distributing food!',
  },
]

const BENEFITS = [
  'See all available food on one map',
  'Reserve multiple posts in advance',
  'Priority access over individual users',
  'Optimized collection route planning',
  'Impact dashboard & analytics',
  'Auto-generated monthly reports',
  'Beneficiary tracking system',
  'Verified NGO badge & trust signals',
  'Direct donor relationships',
  'WhatsApp alerts for bulk donations',
  'Offline mode for field workers',
  'Multi-user accounts (volunteers)',
]

export default function NGO() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      <SiteHeader />

      <section className="mx-auto max-w-3xl px-4 pt-16 pb-4 text-center sm:px-6">
        <SectionHead
          pill="For Organizations"
          title="Bulk Collection → Mass Distribution"
          sub="Special mode for NGOs, charities, and community organizations to collect food in bulk and redistribute to hundreds or thousands of beneficiaries."
        />
      </section>

      {/* Challenge */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHead pill="CHALLENGE" title="The Challenge NGOs Face" />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {CHALLENGES.map((c, i) => (
            <Reveal key={c.title} delay={i * 100} className="h-full">
              <div className="card-dark card-hover h-full p-6 text-center">
                <div className="text-4xl">{c.icon}</div>
                <h3 className="mt-3 font-display text-lg font-bold text-slate-900">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Solution */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHead pill="SOLUTION" title="How NGO Mode Solves This" />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {SOLUTIONS.map((s, i) => (
            <Reveal key={s.title} delay={(i % 2) * 100} className="h-full">
              <div className="card-dark card-hover flex h-full flex-col p-6 sm:p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <s.icon size={22} />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.text}</p>
                {s.extra && (
                  <p className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs leading-relaxed text-green-800">
                    {s.extra}
                  </p>
                )}
                {s.points && (
                  <ul className="mt-4 space-y-2">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check size={15} className="mt-0.5 shrink-0 text-green-600" />
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
                {s.stats && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {s.stats.map((st) => (
                      <div key={st.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                        <div className="font-display text-lg font-extrabold text-green-600">{st.num}</div>
                        <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">{st.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Case study */}
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <SectionHead pill="CASE STUDY" title="Real-World Example" />
        <Reveal className="mt-10">
          <div className="card-dark overflow-hidden border border-slate-200 bg-white shadow-xs">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 sm:px-8">
              <h3 className="font-display text-xl font-bold text-slate-900">Akshaya Patra Foundation</h3>
              <p className="mt-0.5 text-sm text-slate-500">Feeds 1,000+ kids daily in Mumbai slums</p>
            </div>
            <div className="grid gap-0 sm:grid-cols-2">
              {CASE_STEPS.map((s, i) => (
                <div key={s.title} className={`flex gap-4 p-6 sm:p-8 ${i < CASE_STEPS.length - 1 ? 'border-b border-slate-100 sm:border-b-0' : ''} ${i % 2 === 0 ? 'sm:border-r sm:border-slate-100' : ''} ${i < 2 ? 'sm:border-b sm:border-slate-100' : ''}`}>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-emerald-600 font-display text-sm font-extrabold text-white shadow-xs">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-slate-900">{s.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 bg-green-50/70 px-6 py-4 text-center sm:px-8">
              <p className="text-sm font-bold text-green-800">Result: Zero hunger. Zero waste. Zero cost.</p>
              <p className="mt-1 text-xs text-slate-600">Same process repeats daily. 1 NGO × 365 days = 365,000 meals/year.</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Enable */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <SectionHead pill="GET STARTED" title="How to Enable NGO Mode" />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {ENABLE_STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 100} className="h-full">
              <div className="card-dark card-hover relative h-full p-6">
                <div className="font-display text-4xl font-extrabold text-slate-200">{i + 1}.</div>
                <h3 className="mt-2 font-display text-lg font-bold text-slate-900">{s.title}</h3>
                {s.lines.map((l) => (
                  <p key={l} className="mt-2 text-sm leading-relaxed text-slate-700 first:mt-3">{l}</p>
                ))}
                <p className="mt-3 text-xs text-slate-500">{s.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <SectionHead pill="BENEFITS" title="NGO Mode Benefits" />
        <Reveal className="mt-10">
          <div className="card-dark grid gap-x-6 gap-y-3 p-6 sm:grid-cols-2 sm:p-8">
            {BENEFITS.map((b) => (
              <div key={b} className="flex items-start gap-2.5 text-sm text-slate-700">
                <Check size={16} className="mt-0.5 shrink-0 text-green-600" />
                {b}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <Reveal>
          <div className="card-dark relative overflow-hidden border border-green-200/90 bg-gradient-to-br from-white via-green-50/50 to-emerald-50/70 p-8 text-center shadow-xl shadow-green-600/5 sm:p-12">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-green-500/15 blur-3xl" />
            <h2 className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">Scale Your Impact 10x</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-slate-600">Join 50+ verified NGOs already using FoodResQ to feed thousands daily.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/ngo/register" className="btn-brand inline-flex items-center justify-center gap-2 px-8 py-3 text-sm">
                Register NGO Partner Now <ArrowRight size={15} />
              </Link>
              <Link to="/ngo/dashboard" className="btn-outline px-8 py-3 text-sm">
                Open NGO Dashboard 🏛️
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  )
}
