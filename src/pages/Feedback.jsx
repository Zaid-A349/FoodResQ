import { useState } from 'react'
import { Star, Send } from 'lucide-react'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Reveal from '../components/Reveal.jsx'
import { useApp } from '../store.jsx'

function Stars({ value, onChange, size = 22 }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className="transition hover:scale-110"
        >
          <Star size={size} className={n <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
        </button>
      ))}
    </div>
  )
}

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20'

export default function Feedback() {
  const { reviews, addReview } = useApp()
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (name.trim().length < 2) return setError('Please enter your name.')
    if (message.trim().length < 2) return setError('Please write a short message.')
    addReview({ name: name.trim(), rating, message: message.trim() })
    setName('')
    setMessage('')
    setRating(5)
    setError('')
    setDone(true)
    setTimeout(() => setDone(false), 2500)
  }

  const sorted = [...reviews].sort((a, b) => b.rating - a.rating)

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      <SiteHeader />

      <section className="mx-auto max-w-3xl px-4 pt-16 pb-4 text-center sm:px-6">
        <SectionHead
          pill="Your Voice Matters"
          title="Community Feedback"
          sub="Share your experience with FoodResQ. Your thoughts help us improve the platform and serve our community better."
        />
      </section>

      {/* Form */}
      <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <Reveal>
          <div className="card-dark border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-slate-900">Leave a Review</h3>
              <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-green-700">High-rated reviews get featured</span>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Name</label>
                <input className={inputCls} value={name} onChange={(e) => { setName(e.target.value); setError('') }} placeholder="Your name..." />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Rating</label>
                <Stars value={rating} onChange={setRating} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">Message</label>
                <textarea
                  className={`${inputCls} min-h-[110px] resize-y`}
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); setError('') }}
                  placeholder="Tell us what you think..."
                />
              </div>
              {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">{error}</p>}
              {done && <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">Thanks! Your review is on the wall.</p>}
              <button type="submit" className="btn-brand inline-flex w-full items-center justify-center gap-2 py-3 text-sm">
                <Send size={15} /> Submit Review
              </button>
            </form>
          </div>
        </Reveal>
      </section>

      {/* Wall */}
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <div className="text-center">
          <SectionHead pill="COMMUNITY WALL" title="What Users Say" />
        </div>
        <Reveal className="mt-4 text-center">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500 shadow-xs">Top Reviews Only</span>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {sorted.map((r, i) => (
            <Reveal key={r.id} delay={(i % 2) * 100} className="h-full">
              <div className="card-dark card-hover relative h-full p-6">
                <span className="absolute -top-1 left-5 font-display text-6xl font-extrabold text-slate-100 select-none pointer-events-none">"</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={14} className={n <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">"{r.message}"</p>
                <div className="mt-4 flex items-center gap-2.5 border-t border-slate-100 pt-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-emerald-600 font-display text-sm font-extrabold text-white">
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{r.name}</div>
                    <div className="text-xs text-slate-500">{r.date}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
