import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Navigation, CheckCircle2, Plus, Sparkles, AlertCircle, HeartHandshake, ShieldCheck, MapPin } from 'lucide-react'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import Reveal from '../components/Reveal.jsx'
import { useApp } from '../store.jsx'
import { useLang } from '../i18n.jsx'
import { reverseGeocode } from '../utils/geo.js'

const QUICK_TYPES = [
  '🍛 Cooked Meals',
  '🥖 Bakery Surplus',
  '🥪 Sandwiches & Snacks',
  '🍎 Fresh Produce',
  '🍰 Sweets & Desserts',
  '🍲 Rice & Curries',
]

export default function PostFood() {
  const navigate = useNavigate()
  const { t } = useLang()
  const { user, addPost } = useApp()

  const [food, setFood] = useState('')
  const [qty, setQty] = useState('')
  const [mins, setMins] = useState('60')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [coords, setCoords] = useState({ lat: 28.9845, lng: 77.7064 })
  const [locating, setLocating] = useState(false)
  const [gpsSuccess, setGpsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [successPost, setSuccessPost] = useState(null)

  // Route guard: if not logged in, redirect to auth with return destination
  useEffect(() => {
    if (!user) {
      navigate('/auth', { state: { from: '/post' }, replace: true })
    }
  }, [user, navigate])

  if (!user) {
    return null
  }

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }
    setLocating(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setCoords({ lat, lng })
        setGpsSuccess(true)

        // 1. Immediately write formatted coordinates into the address box
        const coordString = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
        setAddress(coordString)

        // 2. Resolve exact street / area / city name via reverse geocoding
        try {
          const locationName = await reverseGeocode(lat, lng)
          if (locationName) {
            setAddress(locationName)
          }
        } catch {
          // Keep coordinates fallback
        } finally {
          setLocating(false)
        }
      },
      () => {
        setLocating(false)
        setError('Could not detect GPS location automatically. Please enter your landmark or area name.')
      },
      { timeout: 9000, enableHighAccuracy: true }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!food.trim()) {
      setError('Please enter the food name or description.')
      return
    }
    if (!qty.trim()) {
      setError('Please specify the quantity or number of servings.')
      return
    }

    setError('')
    const created = await addPost({
      food: food.trim(),
      qty: qty.trim(),
      mins: parseInt(mins, 10) || 60,
      donor: user?.name || 'Generous Donor',
      donorEmail: user?.email,
      phone: phone.trim(),
      address: address.trim() || 'Near City Center',
      note: note.trim(),
      lat: coords.lat,
      lng: coords.lng,
    })

    setSuccessPost(created)
  }

  const resetForm = () => {
    setFood('')
    setQty('')
    setMins('60')
    setPhone('')
    setAddress('')
    setNote('')
    setGpsSuccess(false)
    setError('')
    setSuccessPost(null)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
            <span className="dot-live" /> Live Posting Mode
          </span>
        </div>

        {successPost ? (
          /* Success Screen */
          <Reveal>
            <div className="card-dark border border-slate-200 bg-white p-6 sm:p-10 text-center shadow-xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-3xl text-green-600 border border-green-200 shadow-sm">
                🎉
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
                Surplus Food Listed Live!
              </h1>
              <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
                Thank you, <span className="font-bold text-slate-800">{user.name}</span>! Your post is now live and reachable by seekers and NGOs near you.
              </p>

              <div className="mx-auto mt-6 max-w-md rounded-2xl bg-slate-50 border border-slate-200/90 p-5 text-left text-xs sm:text-sm space-y-2 text-slate-700">
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500 font-medium">Food Item:</span>
                  <span className="font-bold text-slate-900">{successPost.food}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500 font-medium">Quantity:</span>
                  <span className="font-bold text-green-700">{successPost.qty}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500 font-medium">Pickup Window:</span>
                  <span className="font-semibold">{successPost.mins} minutes</span>
                </div>
                {successPost.address && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Location:</span>
                    <span className="font-semibold text-right max-w-[60%]">{successPost.address}</span>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col gap-2.5 sm:flex-row justify-center max-w-lg mx-auto">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-brand flex-1 py-3 text-sm font-bold shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  Go to Donor Dashboard 📊
                </button>
                <button
                  onClick={() => navigate('/find')}
                  className="btn-outline flex-1 py-3 text-sm font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  View on Find Food 📋
                </button>
                <button
                  onClick={resetForm}
                  className="btn-outline flex-1 py-3 text-sm font-bold hover:bg-slate-50 transition cursor-pointer text-slate-600"
                >
                  + Post Another
                </button>
              </div>
            </div>
          </Reveal>
        ) : (
          /* Post Form */
          <Reveal>
            <div className="card-dark border border-slate-200 bg-white p-6 sm:p-8 shadow-xl">
              {/* Header */}
              <div className="border-b border-slate-100 pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-2xl border border-green-200/70 shadow-xs">
                    🍲
                  </div>
                  <div>
                    <h1 className="font-display text-xl sm:text-2xl font-black text-slate-900">
                      Post Surplus Food
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Share untouched food in 30 seconds • Broadcasts instantly to nearby seekers
                    </p>
                  </div>
                </div>

                {/* Donor Status Bar */}
                <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200/80 px-3.5 py-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-green-600 shrink-0" />
                    <span>
                      Logged in as: <strong className="text-slate-900">{user.name}</strong> ({user.email})
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-green-700 bg-green-100/70 px-2 py-0.5 rounded-md">
                    Verified Donor
                  </span>
                </div>
              </div>

              {error && (
                <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs font-semibold text-red-600">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Food Name & Quick Chips */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Food Name & Description *
                  </label>
                  <input
                    value={food}
                    onChange={(e) => setFood(e.target.value)}
                    placeholder="e.g. Veg Biryani with Raita, Dal Makhani + 50 Rotis"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
                    autoFocus
                  />
                  {/* Quick Chips */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {QUICK_TYPES.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setFood((prev) => (prev ? `${prev}, ${chip.slice(3)}` : chip.slice(3)))}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:border-green-500/50 hover:bg-green-50 hover:text-green-700 cursor-pointer"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity and Expiry */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Quantity / Servings *
                    </label>
                    <input
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      placeholder="e.g. 40 plates / 15 meal boxes"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Pickup Window (Auto-Expires)
                    </label>
                    <select
                      value={mins}
                      onChange={(e) => setMins(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-green-500 focus:bg-white"
                    >
                      <option value="30">30 min (Urgent Pickup)</option>
                      <option value="60">1 Hour (Standard)</option>
                      <option value="120">2 Hours</option>
                      <option value="240">4 Hours</option>
                    </select>
                  </div>
                </div>

                {/* Location & GPS */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Pickup Location / Landmark *
                    </label>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={locating}
                      className="inline-flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-700 disabled:opacity-50 cursor-pointer"
                    >
                      <Navigation size={13} className={locating ? 'animate-spin' : ''} />
                      {locating ? 'Detecting…' : gpsSuccess ? '✓ GPS Captured' : 'Detect My GPS'}
                    </button>
                  </div>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Bikanervala, Near Delhi Road, Meerut (or tap Detect My GPS)"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
                  />
                  {gpsSuccess && (
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                        <MapPin size={12} className="text-emerald-600" />
                        Exact GPS: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAddress(`${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`)}
                        className="text-slate-400 hover:text-slate-700 underline cursor-pointer"
                      >
                        Use raw coordinates
                      </button>
                    </div>
                  )}
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Contact Phone (Optional)
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210 (For takers to coordinate arrival)"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
                  />
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Special Pickup Instructions (Optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    placeholder="e.g. Freshly cooked buffet surplus, packed in foil boxes. Please bring clean carry bags."
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white"
                  />
                </div>

                {/* Auto-Expiry Notice */}
                <div className="flex items-center gap-2 rounded-xl bg-green-50/70 border border-green-200/60 p-3 text-xs text-green-800">
                  <Clock size={16} className="shrink-0 text-green-600" />
                  <span>Posts automatically delete when the pickup window finishes. Fresh listings only, zero stale food.</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn-brand w-full py-4 text-base font-bold shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  🚀 Publish Live Food Post Now
                </button>
              </form>
            </div>
          </Reveal>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
