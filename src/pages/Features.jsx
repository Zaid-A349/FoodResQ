import { Link, useNavigate } from 'react-router-dom'
import { Timer, Webhook, Mic, Star, Share2, MessageSquareHeart, Check, X } from 'lucide-react'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Reveal from '../components/Reveal.jsx'
import { useApp } from '../store.jsx'

const FEATURES = [
  {
    icon: Timer,
    color: 'text-amber-600 bg-amber-50',
    title: 'Auto-Delete After Pickup Time',
    text: 'Posts automatically disappear after the pickup window expires. No stale food listings, no manual cleanup. Always fresh, always safe.',
    points: ['Zero maintenance for donors', 'Prevents confusion about food availability', 'Ensures freshness and food safety'],
  },
  {
    icon: Webhook,
    color: 'text-rose-600 bg-rose-50',
    title: 'Zomato & Swiggy API Integration (Future Roadmap)',
    text: 'Seamless merchant integration for restaurant owners. We will provide an open API to Zomato & Swiggy so restaurant and cloud kitchen owners can directly use our post food form from their existing merchant portal.',
    points: [
      '1-Click surplus food posting directly from Zomato / Swiggy merchant dashboards',
      'Auto-populates food name, portions, and restaurant pickup location without manual re-entry',
      'Lightweight REST & Webhook APIs designed for restaurants, buffet venues, and caterers',
    ],
    demo: '🚀 Future Roadmap: Restaurant owners tap "Donate Surplus" on their Zomato/Swiggy dashboard → Instantly live on FoodResQ map for local seekers & NGOs!',
  },
  {
    icon: Mic,
    color: 'text-green-600 bg-green-50',
    title: 'Voice Post (Coming Soon)',
    text: 'Can\'t type or in a hurry? Just speak! Say "Dal rice das log" and our AI auto-creates a post in seconds. Making food rescue accessible to everyone.',
    points: ['Supports 15+ regional languages', 'AI understands food quantities & types', 'Empowers local cooks and community members'],
    demo: '🚀 Demo: "Biryani pachaas log teesminut" → Auto-posts "Biryani, 50 servings, pickup in 30 mins"',
  },
  {
    icon: MessageSquareHeart,
    color: 'text-sky-600 bg-sky-50',
    title: 'Community Feedback & Reviews',
    text: 'Authentic feedback and gratitude from real food rescuers. Community members share ratings, reviews, and heartfelt thank-you notes to appreciate donors and maintain high food quality.',
    points: [
      '5-Star ratings & genuine written reviews for food quality and donor punctuality',
      'Transparent feedback loop builds community trust and dignity',
      'Heartfelt thank-you messages motivate donors to contribute regularly',
    ],
    demo: '💬 "Premkumar: Good quality hot food, picked up in 10 mins! Thank you!" ★★★★★',
    demoLabel: 'Live Community Review Example:',
  },
  {
    icon: Share2,
    color: 'text-emerald-600 bg-emerald-50',
    title: 'One-Tap WhatsApp Share',
    text: 'One tap to share food posts to WhatsApp groups. Share to your local neighborhood group → fast community pickups within walking distance!',
    points: ['Pre-formatted message with all details', 'Includes map pin and contact info', 'Amplifies rescue reach instantly across local communities'],
    demo: '🍛 FREE FOOD ALERT!\n50 Biryani servings\n📍 Hotel Bikanervala, Meerut\n⏰ Pickup in 30 mins\nVia FoodResQ',
    demoLabel: 'Example WhatsApp message:',
  },
  {
    icon: Star,
    color: 'text-yellow-600 bg-yellow-50',
    title: 'Verified Donor Recognition & Badges',
    text: 'Consistent donors earn verified community badges and trust points. Shows tangible social impact and gives restaurants positive social recognition.',
    points: ['5-star reliability scoring based on community reviews', 'Verified badge for regular donors and NGOs', 'Transparent accountability for all contributors'],
    badges: [
      { icon: '🏆', name: 'Helper Badge', req: '10+ Rescues' },
      { icon: '⭐', name: 'Zero-Waste Hero', req: '50+ Rescues' },
    ],
  },
]

const COMPARISON = [
  ['Auto-delete expired posts', true],
  ['Zomato & Swiggy API roadmap', true],
  ['Voice posting in regional languages', true],
  ['One-tap WhatsApp community share', true],
  ['Community feedback & ratings', true],
  ['NGO bulk operations mode', true],
  ['No app download required', true],
  ['100% Free & Open forever', true],
]

export default function Features() {
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

      <section className="mx-auto max-w-3xl px-4 pt-16 pb-4 text-center sm:px-6">
        <SectionHead
          pill="Innovation at Scale"
          title="Features No One Else Has"
          sub="We've built the most advanced food rescue platform with unique capabilities that make sharing food effortless and effective."
        />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 2) * 100} className="h-full">
              <div className="card-dark card-hover flex h-full flex-col p-6 sm:p-7">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${f.color}`}>
                  <f.icon size={22} />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.text}</p>
                <ul className="mt-4 space-y-2">
                  {f.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check size={15} className="mt-0.5 shrink-0 text-green-600" />
                      {p}
                    </li>
                  ))}
                </ul>
                {f.demo && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    {f.demoLabel && <p className="mb-2 text-xs font-bold text-slate-500">{f.demoLabel}</p>}
                    <p className="whitespace-pre-line text-xs font-medium leading-relaxed text-slate-800">{f.demo}</p>
                  </div>
                )}
                {f.badges && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {f.badges.map((b) => (
                      <div key={b.name} className="flex items-center gap-2.5 rounded-xl border border-green-200 bg-green-50 px-3.5 py-2.5">
                        <span className="text-xl">{b.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{b.name}</div>
                          <div className="text-[11px] text-slate-500">{b.req}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <SectionHead pill="COMPARISON" title="Why We're Different" />
        <Reveal className="mt-10">
          <div className="card-dark overflow-hidden border border-slate-200 bg-white shadow-xs">
            <div className="grid grid-cols-[1fr_110px_90px] items-center gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3.5 sm:grid-cols-[1fr_140px_110px]">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Feature</span>
              <span className="text-center text-xs font-bold uppercase tracking-wider text-green-700">FoodResQ</span>
              <span className="text-center text-xs font-bold uppercase tracking-wider text-slate-400">Others</span>
            </div>
            {COMPARISON.map(([name], i) => (
              <div key={name} className={`grid grid-cols-[1fr_110px_90px] items-center gap-2 border-b border-slate-100 px-5 py-3.5 last:border-0 sm:grid-cols-[1fr_140px_110px] ${i % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}`}>
                <span className="text-sm font-medium text-slate-700">{name}</span>
                <span className="flex justify-center"><Check size={17} className="text-green-600" /></span>
                <span className="flex justify-center"><X size={17} className="text-red-500" /></span>
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
            <h2 className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">Experience These Features Live</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-slate-600">Try the most advanced food rescue platform. All features free forever.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button onClick={handlePostFood} className="btn-brand px-8 py-3 text-sm cursor-pointer">Post Free Food</button>
              <Link to="/ngo" className="btn-outline px-8 py-3 text-sm">NGO Mode →</Link>
            </div>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  )
}
