import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Clock, MapPin, X, Navigation, Trash2, Plus } from 'lucide-react'
import SiteHeader from '../components/SiteHeader.jsx'
import Reveal from '../components/Reveal.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { useApp } from '../store.jsx'
import { useLang } from '../i18n.jsx'

function distKm(a, b) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s))
}

function fmtDist(km) {
  if (km < 1) return `${Math.max(1, Math.round(km * 1000))} m`
  return `${km.toFixed(1)} km`
}

function foodEmoji(food = '') {
  const f = food.toLowerCase()
  if (f.includes('biryani') || f.includes('rice') || f.includes('pulao') || f.includes('idli') || f.includes('dosa')) return '🍛'
  if (f.includes('sandwich')) return '🥪'
  if (f.includes('cake') || f.includes('pastry')) return '🍰'
  if (f.includes('fruit')) return '🍎'
  if (f.includes('pizza')) return '🍕'
  if (f.includes('burger') || f.includes('fries')) return '🍔'
  if (f.includes('pasta') || f.includes('noodle')) return '🍝'
  if (f.includes('thal') || f.includes('sabzi') || f.includes('paneer') || f.includes('dal')) return '🍛'
  if (f.includes('chapati') || f.includes('roti') || f.includes('dal') || f.includes('chole')) return '🍲'
  return '🍽️'
}

function waText(p, left) {
  return `🍛 FREE FOOD ALERT!\n${p.qty} of ${p.food}\n⏰ ${left} min left\n📍 ${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}\nVia FoodResQ`
}

const gmaps = (p) => `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`

function TimeChip({ left, t }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
        left <= 15 ? 'border border-red-200 bg-red-50 text-red-600' : 'border border-green-200 bg-green-50 text-green-700'
      }`}
    >
      <Clock size={11} /> {left} {t('findpage.minLeft')}
    </span>
  )
}

export default function FindFood() {
  const navigate = useNavigate()
  const { t } = useLang()
  const { user, activePosts, claim, claimed, deletePost } = useApp()

  const handlePostFood = () => {
    if (!user) {
      navigate('/auth', { state: { from: '/post' } })
    } else {
      navigate('/post')
    }
  }

  const [q, setQ] = useState('')
  const [sort, setSort] = useState('newest')
  const [now, setNow] = useState(Date.now())
  const [me, setMe] = useState(null)
  const [sel, setSel] = useState(null)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMe({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setSort('nearest')
      },
      () => {},
      { enableHighAccuracy: false, timeout: 8000 }
    )
  }, [])

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    const list = activePosts.filter(
      (p) =>
        !query ||
        p.food.toLowerCase().includes(query) ||
        (p.donor || '').toLowerCase().includes(query) ||
        (p.note || '').toLowerCase().includes(query)
    )
    return [...list].sort((a, b) => {
      if (sort === 'expiring') return a.expiresAt - b.expiresAt
      if (sort === 'nearest' && me) return distKm(me, a) - distKm(me, b)
      return b.createdAt - a.createdAt
    })
  }, [activePosts, q, sort, me])

  const leftOf = (p) => Math.max(0, Math.round((p.expiresAt - now) / 60000))

  const ClaimBtn = ({ p, big = false }) => {
    const isClaimed = claimed.includes(p.id)
    return (
      <button
        onClick={() => claim(p.id)}
        disabled={isClaimed}
        className={`font-bold ${big ? 'py-3.5 text-sm' : 'py-2.5 text-xs'} rounded-xl transition ${
          isClaimed
            ? 'bg-green-100 text-green-800'
            : 'btn-brand text-white'
        }`}
      >
        {isClaimed ? `✓ ${t('map.claimed')}` : t('map.imGoing')}
      </button>
    )
  }

  const sortOpts = [
    ['newest', t('findpage.sortNewest')],
    ['expiring', t('findpage.sortExpiring')],
    ['nearest', t('findpage.sortNearest')],
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      <SiteHeader />

      {/* hero strip */}
      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-green-600/25 bg-green-50 px-4 py-1.5 text-xs font-bold tracking-widest text-green-700">
          <span className="dot-live" />
          {activePosts.length} {t('findpage.live')}
        </div>
        <h2 className="mt-4 font-display text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          {t('find.title')}
        </h2>
        <p className="mt-2 max-w-xl text-sm text-slate-600 sm:text-base">{t('findpage.sub')}</p>

        {/* controls */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('findpage.search')}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-green-500"
          >
            {sortOpts.map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </select>
          <button
            onClick={handlePostFood}
            className="btn-brand flex items-center justify-center gap-1.5 whitespace-nowrap px-5 py-3 text-sm cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} />
            Post Food
          </button>
        </div>
      </section>

      {/* posts grid */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {filtered.length === 0 ? (
          <Reveal>
            <div className="card-dark mx-auto max-w-lg border border-slate-200 bg-white p-12 text-center shadow-xs">
              <div className="text-5xl">🍽️</div>
              <h3 className="mt-4 font-display text-xl font-bold text-slate-900">{t('findpage.empty')}</h3>
              <div className="mt-6 flex justify-center">
                <button onClick={handlePostFood} className="btn-brand px-8 py-3 text-sm cursor-pointer">
                  + Post Food Now
                </button>
              </div>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => {
              const left = leftOf(p)
              const km = me ? distKm(me, p) : null
              return (
                <Reveal key={p.id} delay={(i % 3) * 80}>
                  <div className="card-dark card-hover flex h-full flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-2xl">
                        {foodEmoji(p.food)}
                      </div>
                      <TimeChip left={left} t={t} />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold text-slate-900">{p.food}</h3>
                    <div className="mt-1 text-sm font-bold text-green-600">{p.qty}</div>
                    {p.note && <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.note}</p>}
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1">👤 {p.donor || 'Community'}</span>
                      {km != null && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                          <MapPin size={10} /> {fmtDist(km)}
                        </span>
                      )}
                    </div>
                    <div className="mt-auto space-y-2 pt-4">
                      <ClaimBtn p={p} />
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={gmaps(p)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 transition hover:border-green-500/50 hover:bg-green-50 hover:text-green-700"
                        >
                          <Navigation size={13} /> {t('map.directions')}
                        </a>
                        <button
                          onClick={() => setSel(p)}
                          className="rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 transition hover:border-green-500/50 hover:bg-green-50 hover:text-green-700"
                        >
                          {t('findpage.details')}
                        </button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        )}
      </section>

      {/* detail modal */}
      {sel && (
        <div className="fixed inset-0 z-[30000] flex items-end justify-center sm:items-center sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSel(null)} />
          <div className="nice-scroll relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/15 sm:rounded-3xl">
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-3xl">
                {foodEmoji(sel.food)}
              </div>
              <button
                onClick={() => setSel(null)}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <X size={16} />
              </button>
            </div>
            <h3 className="mt-4 font-display text-2xl font-extrabold text-slate-900">{sel.food}</h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-green-600">{sel.qty}</span>
              <TimeChip left={leftOf(sel)} t={t} />
            </div>
            {sel.note && <p className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">{sel.note}</p>}

            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">{t('findpage.by')}</dt>
                <dd className="font-semibold text-slate-800">{sel.donor || 'Community member'}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-500">{t('findpage.pickup')}</dt>
                <dd className="font-mono text-xs font-semibold text-slate-800">
                  {sel.lat.toFixed(5)}, {sel.lng.toFixed(5)}
                </dd>
              </div>
              {me && (
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-500">{t('stats.nearest')}</dt>
                  <dd className="font-semibold text-green-600">{fmtDist(distKm(me, sel))}</dd>
                </div>
              )}
            </dl>

            <div className="mt-5 space-y-2">
              <ClaimBtn p={sel} big />
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={gmaps(sel)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-bold text-slate-700 transition hover:border-green-500/50 hover:bg-green-50 hover:text-green-700"
                >
                  <Navigation size={14} /> {t('map.directions')}
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(waText(sel, leftOf(sel)))}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-green-200 bg-green-50 py-3 text-sm font-bold text-green-700 transition hover:bg-green-100"
                >
                  {t('findpage.share')}
                </a>
              </div>
            </div>

            {user && sel.donor === user.name && (
              <button
                onClick={() => {
                  deletePost(sel.id)
                  setSel(null)
                }}
                className="mt-4 flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-red-500 transition hover:text-red-600"
              >
                <Trash2 size={13} /> {t('findpage.youPosted')}
              </button>
            )}
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  )
}
