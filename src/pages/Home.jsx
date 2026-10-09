import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Globe, Zap, Shield, MapPin, Clock, Leaf, LayoutDashboard, Sparkles, Plus, Search } from 'lucide-react'
import Logo from '../components/Logo.jsx'
import Reveal from '../components/Reveal.jsx'
import SectionHead from '../components/SectionHead.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { useLang } from '../i18n.jsx'
import { useApp } from '../store.jsx'

function useCountUp(target, start) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!start) return
    let raf
    const t0 = performance.now()
    const dur = 1600
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, target])
  return val
}

function Counter({ target, suffix = '+' }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  const val = useCountUp(target, inView)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <span ref={ref} className="font-display text-4xl font-extrabold text-green-600 sm:text-5xl">
      {val.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function Home() {
  const { t, toggle, lang } = useLang()
  const { user, posts, activePosts, stats } = useApp()
  const navigate = useNavigate()

  const handlePostFood = () => {
    if (!user) {
      navigate('/auth', { state: { from: '/post' } })
    } else {
      navigate('/post')
    }
  }

  const community = [
    { emoji: '🎓', title: 'Students', text: 'Free hot meal instead of skipping dinner' },
    { emoji: '🏠', title: 'Families', text: 'Safe, dignified food pickup nearby' },
    { emoji: '🍽️', title: 'Restaurants', text: 'Save ₹5,000/month on waste + good PR' },
    { emoji: '💒', title: 'Wedding Caterers', text: '200 plates left? Donate, not dump' },
    { emoji: '🏢', title: 'Office Canteens', text: '50 sandwiches at 5 PM? Share them!' },
    { emoji: '👨👩👧', title: 'Home Cooks', text: '"Made too much!" → Share with neighbors' },
  ]

  const why = [
    { icon: Zap, title: 'Instant Posting', text: 'Post food in under 30 seconds. Login once and share anytime.' },
    { icon: Shield, title: 'Privacy First', text: 'Secure logins. No unnecessary data stored. Anonymity for takers.' },
    { icon: MapPin, title: 'Hyper-Local', text: 'GPS-powered proximity. Find food within walking distance.' },
    { icon: Clock, title: 'Auto-Expire', text: 'Posts auto-delete after pickup time. Always fresh listings.' },
    { icon: Leaf, title: 'Zero Waste', text: 'Every meal rescued = less landfill. Saving the planet, one plate at a time.' },
    { icon: LayoutDashboard, title: 'NGO Dashboard', text: 'Bulk operations, reporting, and coordination for organizations.' },
  ]

  const giverSteps = [t('how.g1'), t('how.g2'), t('how.g3'), t('how.g4')]
  const seekerSteps = [t('how.s1'), t('how.s2'), t('how.s3'), t('how.s4')]

  const findSpots = [
    { emoji: '📍', title: 'Live Food Feed', text: 'Every active food post near you appears in real time. See the food, quantity, distance and pickup time.' },
    { emoji: '🍛', title: 'Restaurants & Hotels', text: 'Surplus buffet, bakery and kitchen items posted right after peak hours — still hot and fresh.' },
    { emoji: '💒', title: 'Weddings & Events', text: 'Hundreds of fresh plates from functions and parties, posted late evening instead of being dumped.' },
    { emoji: '🏢', title: 'Offices & Canteens', text: 'Afternoon surplus — sandwiches, snacks and full meals from office and college canteens.' },
    { emoji: '🏠', title: 'Home Cooks', text: '"Made too much!" — neighbors sharing extra portions with people nearby.' },
    { emoji: '🏛️', title: 'Community Kitchens & NGOs', text: 'Verified NGOs and community kitchens posting scheduled bulk pickups at regular spots.' },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      {/* ---------------- Header Navigation Bar ---------------- */}
      <SiteHeader />

      {/* ---------------- Hero ---------------- */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 pt-16 pb-14 text-center">
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full opacity-35 blur-3xl"
          style={{ background: 'radial-gradient(closest-side, rgba(34,197,94,.16), transparent)' }}
        />

        <Reveal delay={100}>
          <h1 className="mt-6 font-display text-4xl font-black leading-[1.08] tracking-tight text-slate-900 sm:text-6xl">
            <span>{t('hero.titleA')} </span>
            <span className="text-gradient-fire">{t('hero.titleB')}</span>
            <br />
            <span className="text-gradient-gray">{t('hero.titleC')}</span>
          </h1>
        </Reveal>
        <Reveal delay={200}>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {t('hero.sub')}{' '}
            <span className="font-bold text-green-600">
              {t('hero.zero1')} {t('hero.zero2')} {t('hero.zero3')}
            </span>
          </p>
        </Reveal>
        <Reveal delay={300}>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handlePostFood}
              className="btn-brand px-8 py-3.5 text-base inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus size={18} strokeWidth={2.5} />
              {t('hero.cta1')}
            </button>
            <button
              onClick={() => navigate('/find')}
              className="btn-outline px-8 py-3.5 text-base inline-flex items-center justify-center gap-2 cursor-pointer hover:border-green-500 hover:bg-green-50 hover:text-green-800"
            >
              <Search size={16} />
              {t('nav.findFood')} Nearby
            </button>
          </div>
        </Reveal>

        <Reveal delay={350} className="w-full max-w-4xl">
          <div className="card-dark mt-9 w-full p-5 sm:p-6 text-left shadow-sm">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
              <ol className="grid w-full gap-3 grid-cols-2 lg:grid-cols-4">
                {seekerSteps.map((s, i) => (
                  <li key={s} className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50 font-display text-xs font-extrabold text-green-700">
                      {i + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-slate-700">{s}</span>
                  </li>
                ))}
              </ol>
              <button
                onClick={() => navigate('/find')}
                className="btn-brand shrink-0 px-6 py-2.5 text-sm w-full sm:w-auto"
              >
                Find Food Now <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------------- Live strip ---------------- */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal delay={100}>
          <button
            onClick={() => navigate('/find')}
            className="card-dark card-hover flex w-full flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:px-8 sm:py-5 text-left transition hover:border-green-500/40 hover:shadow-md cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-50 font-display text-2xl font-black text-green-600 border border-green-200/60 shadow-xs">
                {activePosts.length}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="dot-live" />
                  <span className="font-display text-base sm:text-lg font-bold text-slate-900">
                    {activePosts.length} Active {t('stats.food')}
                  </span>
                </div>
                <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
                  {t('strip.live')} • Real-time posts available for pickup right now
                </p>
              </div>
            </div>
            <span className="flex items-center gap-2 font-bold text-sm text-green-600 shrink-0">
              Go get food <span aria-hidden>→</span>
            </span>
          </button>
        </Reveal>
      </section>

      {/* ---------------- Impact ---------------- */}
      <section id="impact" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6">
        <SectionHead
          pill={t('impact.pill')}
          title={
            <>
              Numbers That <span className="text-gradient-fire">Matter</span>
            </>
          }
        />
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
          {[
            { target: stats?.mealsRescued || 11, label: t('impact.meals'), suffix: '' },
            { target: stats?.activeDonors || 2, label: t('impact.donors'), suffix: '' },
            { target: stats?.citiesReached || 1, label: t('impact.cities'), suffix: '' },
          ].map((c, i) => (
            <Reveal key={c.label} delay={i * 100}>
              <div className="card-dark card-hover p-8 text-center">
                <Counter target={c.target} suffix={c.suffix} />
                <div className="mt-2 text-sm font-medium text-slate-500">{c.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={250}>
          <div className="mx-auto mt-7 flex max-w-xl items-center justify-center gap-2 rounded-xl bg-slate-50 border border-slate-200/80 px-4 py-2.5 text-center text-xs sm:text-sm text-slate-500">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t('impact.note')}</span>
          </div>
        </Reveal>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-24 sm:px-6">
        <SectionHead pill={t('how.pill')} title={t('how.title')} />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {[
            { title: t('how.givers'), sub: t('how.giversSub'), steps: giverSteps },
            { title: t('how.seekers'), sub: t('how.seekersSub'), steps: seekerSteps },
          ].map((col, ci) => (
            <Reveal key={col.title} delay={ci * 120}>
              <div className="card-dark h-full p-7">
                <h3 className="font-display text-xl font-bold text-slate-900">{col.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{col.sub}</p>
                <ol className="mt-6 space-y-4">
                  {col.steps.map((s, i) => (
                    <li key={s} className="flex items-center gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 font-display text-sm font-extrabold text-green-700">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm font-medium text-slate-700">{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- Where to find food ---------------- */}
      <section id="find-food" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-24 sm:px-6">
        <SectionHead pill={t('find.pill')} title={t('find.title')} sub={t('find.sub')} />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {findSpots.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 100}>
              <div className="card-dark card-hover h-full p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl">{f.emoji}</div>
                <h3 className="mt-4 font-display text-lg font-bold text-slate-900">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- Community ---------------- */}
      <section id="community" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-24 sm:px-6">
        <SectionHead pill={t('community.pill')} title={t('community.title')} sub={t('community.sub')} />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {community.map((c, i) => (
            <Reveal key={c.title} delay={(i % 3) * 100}>
              <div className="card-dark card-hover h-full p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl">{c.emoji}</div>
                <h3 className="mt-4 font-display text-lg font-bold text-slate-900">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- Why us ---------------- */}
      <section id="why-us" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-24 sm:px-6">
        <SectionHead pill={t('why.pill')} title={t('why.title')} />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {why.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 100}>
              <div className="card-dark card-hover h-full p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <f.icon size={20} />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-slate-900">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <div className="mt-10 text-center">
            <button
              onClick={() => navigate('/features')}
              className="btn-outline inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold shadow-xs hover:border-green-500 hover:bg-green-50 hover:text-green-800"
            >
              <Sparkles size={16} className="text-green-600" />
              Explore All 8+ Platform Features & Tech Comparison Matrix →
            </button>
          </div>
        </Reveal>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section id="cta" className="mx-auto max-w-4xl scroll-mt-24 px-4 pb-24 text-center sm:px-6">
        <Reveal>
          <div className="card-dark relative overflow-hidden border border-green-200/90 bg-gradient-to-br from-white via-green-50/50 to-emerald-50/70 px-6 py-16 shadow-xl shadow-green-600/5 sm:px-16">
            <div
              className="pointer-events-none absolute -top-24 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full opacity-40 blur-3xl"
              style={{ background: 'radial-gradient(closest-side, rgba(34,197,94,.25), transparent)' }}
            />
            <h2 className="relative font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">{t('cta.title')}</h2>
            <p className="relative mx-auto mt-4 max-w-xl text-slate-600">{t('cta.sub')}</p>
            <button onClick={handlePostFood} className="btn-brand relative mt-8 px-10 py-4 text-base inline-flex items-center justify-center gap-2 cursor-pointer">
              <Plus size={18} strokeWidth={2.5} />
              {t('cta.btn')}
            </button>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  )
}
