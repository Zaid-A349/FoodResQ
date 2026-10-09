import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Check, QrCode, Landmark, Heart, MessageCircle } from 'lucide-react'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Reveal from '../components/Reveal.jsx'
import { useApp } from '../store.jsx'

const TIERS = [
  { icon: '🍛', amount: '₹ 100', title: 'Feed 5 People', text: 'Covers platform costs for 5 food rescues' },
  { icon: '🚗', amount: '₹ 500', title: 'Fund Deliveries', text: 'Helps NGO volunteers with pickup logistics for a week' },
  { icon: '📱', amount: '₹ 1,000', title: 'Tech Supporter', text: 'Keeps our servers running for a month' },
  { icon: '🏆', amount: '₹ 5,000', title: 'Impact Champion', text: 'Funds platform development & new city expansion' },
]

const QUICK_AMOUNTS = ['₹100', '₹250', '₹500', '₹1,000', '₹2,500', '₹5,000']

const BANK = [
  { label: 'ACCOUNT NAME', value: 'FoodResQ Foundation' },
  { label: 'ACCOUNT NUMBER', value: '1234567890123456' },
  { label: 'IFSC CODE', value: 'SBIN0001234' },
  { label: 'BANK NAME', value: 'State Bank of India' },
  { label: 'BRANCH', value: 'Indore Main Branch' },
]

const TRANSPARENCY = [
  { label: 'Server & Hosting', pct: 35, color: 'bg-green-600' },
  { label: 'NGO Coordination', pct: 25, color: 'bg-emerald-500' },
  { label: 'App Development', pct: 25, color: 'bg-teal-500' },
  { label: 'Community Outreach', pct: 15, color: 'bg-sky-500' },
]

function CopyBtn({ value }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(value).catch(() => {})
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-green-500 hover:text-green-700"
    >
      {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

export default function Donate() {
  const { posts } = useApp()
  const meals = posts.reduce((sum, p) => sum + (parseInt(p.qty, 10) || 0), 0) || 11
  const kg = Math.round(meals * 0.4)

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      <SiteHeader />

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-4 pt-16 text-center sm:px-6">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">Every Rupee Feeds Someone</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600">
            FoodResQ is <span className="font-bold text-green-600">100% free</span> for all users — forever. Your donations keep the servers running, the app improving, and the mission alive.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
            We're a small team fighting food waste with technology. No VC funding, no ads — just people helping people.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-10">
          <div className="pill-label">YOUR IMPACT SO FAR</div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { num: `${meals}`, label: 'Meals Rescued' },
              { num: '1', label: 'City Active' },
              { num: `${kg} kg`, label: 'Food Saved' },
            ].map((s) => (
              <div key={s.label} className="card-dark border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
                <div className="font-display text-2xl font-extrabold text-green-600 sm:text-3xl">{s.num}</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Tiers */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHead pill="CHOOSE YOUR IMPACT" title="What Your Donation Does" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {TIERS.map((t, i) => (
            <Reveal key={t.title} delay={(i % 2) * 100} className="h-full">
              <div className="card-dark card-hover flex h-full items-start gap-4 p-6">
                <div className="text-4xl">{t.icon}</div>
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-display text-2xl font-extrabold text-green-600">{t.amount}</span>
                    <span className="font-display text-base font-bold text-slate-900">{t.title}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{t.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 text-center">
          <p className="text-sm font-medium text-slate-500">Or pick a quick amount:</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {QUICK_AMOUNTS.map((a) => (
              <a
                key={a}
                href={`upi://pay?pa=foodresq@upi&am=${a.replace('₹', '').replace(',', '')}&cu=INR`}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-xs transition hover:border-green-500 hover:bg-green-50 hover:text-green-700"
              >
                {a}
              </a>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Payment methods */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <SectionHead pill="PAYMENT METHODS" title="How to Donate" />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {/* UPI */}
          <Reveal className="h-full">
            <div className="card-dark flex h-full flex-col border border-slate-200 bg-white p-6 shadow-xs sm:p-7">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-slate-900">UPI Payment</h3>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Recommended</span>
              </div>
              <p className="mt-1 text-sm text-slate-500">Fastest way — GPay, PhonePe, Paytm</p>

              <div className="mt-5 flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
                <QrCode size={110} className="text-slate-400" strokeWidth={1} />
                <span className="mt-3 rounded-full bg-slate-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">QR Code</span>
                <span className="mt-1 text-xs font-semibold text-slate-500">Coming Soon</span>
                <p className="mt-2 text-xs text-slate-400">Scan with any UPI app</p>
              </div>

              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Or pay via UPI ID:</p>
                <div className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                  <span className="font-mono text-sm font-bold text-green-800">foodresq@upi</span>
                  <CopyBtn value="foodresq@upi" />
                </div>
                <p className="mt-3 flex gap-1.5 text-xs leading-relaxed text-slate-500">
                  <span>💡</span>
                  <span><span className="font-semibold text-slate-700">Tip:</span> Copy the UPI ID, open your UPI app, and paste it in the "Pay to" field.</span>
                </p>
              </div>
            </div>
          </Reveal>

          {/* Bank */}
          <Reveal delay={120} className="h-full">
            <div className="card-dark flex h-full flex-col border border-slate-200 bg-white p-6 shadow-xs sm:p-7">
              <div className="flex items-center gap-2">
                <Landmark size={18} className="text-green-600" />
                <h3 className="font-display text-lg font-bold text-slate-900">Bank Transfer (NEFT/IMPS)</h3>
              </div>
              <p className="mt-1 text-sm text-slate-500">For larger donations or recurring support</p>
              <div className="mt-5 space-y-2.5">
                {BANK.map((b) => (
                  <div key={b.label} className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{b.label}</div>
                      <div className="mt-0.5 text-sm font-semibold text-slate-800">{b.value}</div>
                    </div>
                    <CopyBtn value={b.value} />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Transparency */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <SectionHead pill="FULL TRANSPARENCY" title="Where Your Money Goes" />
        <Reveal className="mt-10">
          <div className="card-dark space-y-5 border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
            {TRANSPARENCY.map((t) => (
              <div key={t.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{t.label}</span>
                  <span className="font-display font-bold text-slate-900">{t.pct}%</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${t.color}`} style={{ width: `${t.pct}%` }} />
                </div>
              </div>
            ))}
            <div className="border-t border-slate-100 pt-4 text-center">
              <p className="text-sm font-bold text-slate-900">Zero admin salaries.</p>
              <p className="mt-1 text-xs text-slate-500">100% of donations go directly to platform operations and food rescue missions.</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Share instead */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <Reveal>
          <div className="card-dark relative overflow-hidden border border-green-200/90 bg-gradient-to-br from-white via-green-50/50 to-emerald-50/70 p-8 text-center shadow-xl shadow-green-600/5 sm:p-10">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-pink-500/10 blur-3xl" />
            <div className="text-4xl">🙏</div>
            <h2 className="mt-3 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">Can't Donate? Share Instead!</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-slate-600">Even sharing FoodResQ with one friend helps fight food waste. Every new user = more food rescued.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/find" className="btn-brand inline-flex items-center justify-center gap-2 px-8 py-3 text-sm">
                <Heart size={15} /> Start Rescuing Food
              </Link>
              <a
                href={`https://wa.me/?text=${encodeURIComponent('Check out FoodResQ — a free platform to share surplus food and fight hunger. Every meal shared is a life touched!')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-8 py-3 text-sm font-bold text-green-700 transition hover:bg-green-100"
              >
                <MessageCircle size={15} /> Share on WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  )
}
