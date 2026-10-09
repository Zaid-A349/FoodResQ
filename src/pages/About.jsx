import { Link, useNavigate } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Reveal from '../components/Reveal.jsx'
import { useApp } from '../store.jsx'

const VALUES = [
  { icon: '⚡', title: 'Lightning Fast', text: 'Post food in 30 seconds. Find food in 10 seconds. No complexity.' },
  { icon: '🆓', title: 'Always Free', text: 'No subscriptions, no fees, no hidden costs. Free forever for everyone.' },
  { icon: '📱', title: 'Accessible', text: 'Works on ₹1,000 phones. No app download needed. Just a website.' },
  { icon: '🤝', title: 'Dignity First', text: 'Safe, respectful food sharing. No stigma, just community care.' },
  { icon: '📈', title: 'Real Impact', text: 'Every post prevents waste and feeds someone. Direct, measurable impact.' },
  { icon: '🌍', title: 'Community Driven', text: 'Built by people, for people. Everyone contributes, everyone benefits.' },
]

const TIMELINE = [
  { time: '2:30 PM', place: 'Hotel Taj, Mumbai', text: 'Chef posts: "50 sandwiches + samosas left from lunch buffet. Pickup in 30 mins."' },
  { time: '2:32 PM', place: 'Nearby', text: 'Rajesh (rickshaw driver) sees notification: "Food 300m away!" Opens map.' },
  { time: '2:45 PM', place: 'Hotel Entrance', text: 'Rajesh picks up food for himself and 3 fellow drivers. Chef is happy to help.' },
  { time: '2:50 PM', place: 'Impact', text: 'Post auto-deletes. 4 people fed. 50 servings saved from waste. Total time: 20 minutes.' },
]

const DIFFERENCE = [
  { title: 'No App Download', ours: 'Just open the website. Works instantly on any device, any browser.', traditional: 'Most food apps require downloads, updates, permissions.' },
  { title: 'No Login Required', ours: 'Post or find food in seconds. Zero barriers to entry.', traditional: 'Other platforms need accounts, profiles, verification.' },
  { title: 'Live & Local', ours: 'Real-time map shows food within walking distance right now.', traditional: 'Most solutions are slow, scheduled, or require delivery.' },
  { title: 'Auto-Delete', ours: 'Posts expire automatically. No stale listings, no manual cleanup.', traditional: 'Other platforms get cluttered with old, unavailable posts.' },
  { title: 'Mobile-First', ours: 'Designed for ₹1,000 Android phones. Works on slow 2G networks.', traditional: 'Many apps are data-heavy and need expensive devices.' },
]

function DevCard({ letter, name, role, tag, bio, links = [], delay = 0 }) {
  return (
    <Reveal delay={delay} className="h-full">
      <div className="card-dark card-hover h-full p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 font-display text-2xl font-extrabold text-white shadow-md shadow-green-600/20">
            {letter}
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-slate-900">{name}</h3>
            <p className="text-sm font-medium text-slate-500">{role}</p>
          </div>
        </div>
        <p className="pill-label mt-5 !text-[0.62rem]">{tag}</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{bio}</p>
        {links.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-green-500/40 hover:text-green-700"
              >
                <l.icon size={13} /> {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </Reveal>
  )
}

export default function About() {
  const { user } = useApp()
  const navigate = useNavigate()

  const handlePostFood = () => {
    if (!user) {
      navigate('/auth', { state: { from: '/post' } })
    } else {
      navigate('/post')
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      <SiteHeader />

      {/* Mission */}
      <section className="mx-auto max-w-3xl px-4 pt-16 pb-4 text-center sm:px-6">
        <SectionHead
          pill="Our Mission"
          title="Connecting Surplus Food with Hungry People"
          sub="Every day, millions of people sleep hungry while tons of perfectly good food gets wasted. FoodResQ bridges this gap with a simple, free platform that works on any device."
        />
      </section>

      {/* Challenge */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHead pill="THE CHALLENGE" title="The Problem We're Solving" />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { num: '40%', label: 'Food Wasted', text: 'Of all food produced globally goes to waste', color: 'text-red-500' },
            { num: '828M', label: 'People Hungry', text: 'Go to bed hungry every night worldwide', color: 'text-amber-600' },
            { num: '100%', label: 'Free Solution', text: 'No cost to donate or receive food', color: 'text-green-600' },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 100} className="h-full">
              <div className="card-dark card-hover h-full p-6 text-center">
                <div className={`font-display text-4xl font-extrabold ${s.color}`}>{s.num}</div>
                <div className="mt-2 font-display text-lg font-bold text-slate-900">{s.label}</div>
                <p className="mt-1.5 text-sm text-slate-500">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mx-auto mt-10 max-w-2xl text-center">
          <p className="text-lg font-medium text-slate-800">
            The gap is not production — it's <span className="font-bold text-green-600">connection</span>.
          </p>
          <p className="mt-2 text-base text-slate-500">FoodResQ makes it effortless to connect those with extra food to those who need it.</p>
        </Reveal>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHead pill="VALUES" title="Our Core Values" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={(i % 3) * 100} className="h-full">
              <div className="card-dark card-hover h-full p-6">
                <div className="text-3xl">{v.icon}</div>
                <h3 className="mt-3 font-display text-lg font-bold text-slate-900">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <SectionHead pill="STORY" title="A Day in the Life" />
        <div className="relative mt-12">
          <div className="absolute top-2 bottom-2 left-[15px] w-px bg-gradient-to-b from-green-500/60 via-emerald-500/30 to-transparent sm:left-[19px]" />
          <div className="space-y-8">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.time} delay={i * 80}>
                <div className="flex gap-4 sm:gap-6">
                  <div className="relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-green-500/40 bg-white shadow-xs sm:h-10 sm:w-10">
                    <div className="dot-live" />
                  </div>
                  <div className="card-dark flex-1 p-5">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-display text-sm font-bold text-green-600">{t.time}</span>
                      <span className="text-slate-400">—</span>
                      <span className="font-display text-sm font-bold text-slate-800">{t.place}</span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{t.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal className="mt-10 text-center">
          <p className="font-display text-lg font-bold text-slate-900">This happens hundreds of times a day.</p>
          <p className="mt-1 text-sm text-slate-500">Real food. Real impact. Real people.</p>
        </Reveal>
      </section>

      {/* Difference */}
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <SectionHead pill="DIFFERENCE" title="Why Food Rescue Works" />
        <div className="mt-10 space-y-4">
          {DIFFERENCE.map((d, i) => (
            <Reveal key={d.title} delay={i * 60}>
              <div className="card-dark p-6">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">✓</span>
                  <h3 className="font-display text-lg font-bold text-slate-900">{d.title}</h3>
                </div>
                <div className="mt-3 flex gap-2.5 pl-1">
                  <span className="mt-0.5 text-green-600">✓</span>
                  <p className="text-sm leading-relaxed text-slate-700">{d.ours}</p>
                </div>
                <div className="mt-2 flex gap-2.5 pl-1">
                  <span className="mt-0.5 text-red-500">✗</span>
                  <p className="text-sm leading-relaxed text-slate-500"><span className="font-semibold text-red-600">Traditional:</span> {d.traditional}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Developers */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <SectionHead pill="TEAM" title="Meet the Team" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <DevCard
            letter="B"
            name="Team BrainBytes"
            role="Founder & Developer"
            tag="FULL-STACK TEAM BEHIND FOODRESQ"
            bio="BrainBytes founded FoodResQ with a vision to eliminate food waste through technology. The team leads the architecture, backend systems, and overall product direction — building the backbone that powers every food rescue happening on this platform."
            links={[]}
          />
          <DevCard
            letter="B"
            name="Team BrainBytes"
            role="Co-Developer"
            tag="FRONTEND & UI ENGINEERING"
            bio="BrainBytes crafts every pixel and interaction that users experience — passionate about building beautiful, accessible interfaces that make it effortless to share food and fight hunger."
            links={[]}
            delay={120}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <Reveal>
          <div className="card-dark relative overflow-hidden border border-green-200/90 bg-gradient-to-br from-white via-green-50/50 to-emerald-50/70 p-8 text-center shadow-xl shadow-green-600/5 sm:p-12">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-green-500/15 blur-3xl" />
            <h2 className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">Join the Movement</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-slate-600">Whether you have food to share or need a meal, you're part of the solution.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button onClick={handlePostFood} className="btn-brand px-8 py-3 text-sm cursor-pointer">Post Free Food</button>
              <Link to="/" className="btn-outline px-8 py-3 text-sm">Back to Home</Link>
            </div>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  )
}
