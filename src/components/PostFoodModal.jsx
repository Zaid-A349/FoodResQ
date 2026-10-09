import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Navigation, Clock, CheckCircle2, Share2, Sparkles, AlertCircle, MapPin } from 'lucide-react'
import { useApp } from '../store.jsx'
import { reverseGeocode } from '../utils/geo.js'

const QUICK_TYPES = [
  '🍛 Cooked Meals',
  '🥖 Bakery Surplus',
  '🥪 Sandwiches & Snacks',
  '🍎 Fresh Produce',
  '🍰 Sweets & Desserts',
]

export default function PostFoodModal() {
  const navigate = useNavigate()
  const { user, addPost, postModalOpen, closePostModal } = useApp()

  const [food, setFood] = useState('')
  const [qty, setQty] = useState('')
  const [mins, setMins] = useState('60')
  const [donorName, setDonorName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [coords, setCoords] = useState({ lat: 28.9845, lng: 77.7064 })
  const [locating, setLocating] = useState(false)
  const [gpsSuccess, setGpsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [successPost, setSuccessPost] = useState(null)

  // sync user name if available
  useEffect(() => {
    if (user?.name) setDonorName(user.name)
  }, [user])

  if (!postModalOpen) return null

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

        // 1. Immediately write formatted coordinates into address box
        const coordString = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
        setAddress(coordString)

        // 2. Resolve exact street / area / landmark via reverse geocoding
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
        setError('Could not detect location automatically. You can type your landmark/area.')
      },
      { timeout: 9000, enableHighAccuracy: true }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!food.trim()) {
      setError('Please enter the food name.')
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
      donor: donorName.trim() || 'Generous Donor',
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
    setNote('')
    setAddress('')
    setGpsSuccess(false)
    setError('')
    setSuccessPost(null)
  }

  const handleClose = () => {
    resetForm()
    closePostModal()
  }

  return (
    <div className="fixed inset-0 z-[50000] flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-50 text-xl border border-green-200/60 shadow-xs">
              🍲
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                {successPost ? 'Food Listed Successfully!' : 'Post Surplus Food'}
              </h2>
              <p className="text-xs text-slate-500">
                {successPost
                  ? 'Your post is now live and reachable by seekers nearby'
                  : 'Takes 30 seconds • Broadcasts instantly to nearby seekers & NGOs'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success View */}
        {successPost ? (
          <div className="p-6 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-3xl text-green-600 border border-green-200">
              🎉
            </div>
            <h3 className="font-display text-xl font-black text-slate-900">
              Thank You for Fighting Hunger!
            </h3>
            <p className="mt-1.5 text-sm text-slate-600">
              <span className="font-bold text-slate-900">{successPost.qty}</span> of{' '}
              <span className="font-bold text-green-700">{successPost.food}</span> is now active on FoodResQ.
            </p>

            <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200/80 p-4 text-left text-xs space-y-1.5 text-slate-600">
              <div>
                <span className="font-semibold text-slate-700">Donor:</span> {successPost.donor}
              </div>
              <div>
                <span className="font-semibold text-slate-700">Pickup Window:</span> {successPost.mins} minutes (Auto-expires)
              </div>
              {successPost.address && (
                <div>
                  <span className="font-semibold text-slate-700">Location:</span> {successPost.address}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <button
                onClick={() => {
                  handleClose()
                  navigate('/find')
                }}
                className="btn-brand flex-1 py-3 text-sm"
              >
                View on Find Food List 📋
              </button>
              <button
                onClick={() => {
                  handleClose()
                  navigate('/map')
                }}
                className="btn-outline flex-1 py-3 text-sm"
              >
                View on Live Map 🗺️
              </button>
            </div>

            <button
              onClick={resetForm}
              className="mt-3 text-xs font-semibold text-green-700 hover:underline"
            >
              + Post Another Surplus Food Item
            </button>
          </div>
        ) : (
          /* Input Form */
          <form onSubmit={handleSubmit} className="max-h-[78vh] overflow-y-auto p-5 sm:p-6 space-y-4 nice-scroll">
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-600">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Food Name & Quick Chips */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Food Name & Description *
              </label>
              <input
                value={food}
                onChange={(e) => setFood(e.target.value)}
                placeholder="e.g. Veg Biryani with Raita, Dal Makhani + Rotis"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
                autoFocus
              />
              {/* Quick Suggest Chips */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {QUICK_TYPES.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setFood((prev) => (prev ? `${prev}, ${chip.slice(3)}` : chip.slice(3)))}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 transition hover:border-green-500/50 hover:bg-green-50 hover:text-green-700"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Expiry Window */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Quantity / Portions *
                </label>
                <input
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  placeholder="e.g. 40 plates / 15 boxes"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Pickup Window (Expiry)
                </label>
                <select
                  value={mins}
                  onChange={(e) => setMins(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-green-500 focus:bg-white"
                >
                  <option value="30">30 min (Urgent Pickup)</option>
                  <option value="60">1 Hour (Recommended)</option>
                  <option value="120">2 Hours</option>
                  <option value="240">4 Hours</option>
                </select>
              </div>
            </div>

            {/* Donor Name & Contact Phone */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Donor / Restaurant Name
                </label>
                <input
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Bikanervala / Rohan"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Contact / Phone (Optional)
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Location & GPS Detection */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Pickup Location / Landmark
                </label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={locating}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-green-600 hover:text-green-700 disabled:opacity-50"
                >
                  <Navigation size={12} className={locating ? 'animate-spin' : ''} />
                  {locating ? 'Detecting…' : gpsSuccess ? '✓ GPS Captured' : 'Detect My GPS'}
                </button>
              </div>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Near PVS Mall, Delhi Road, Meerut (or tap Detect My GPS)"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white"
              />
              {gpsSuccess && (
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                    <MapPin size={11} className="text-emerald-600" />
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

            {/* Special Pickup Note */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Special Instructions (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="e.g. Freshly cooked buffet surplus, packed in foil boxes. Please bring carry bags."
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white"
              />
            </div>

            {/* Live Auto-Expiry info */}
            <div className="flex items-center gap-2 rounded-xl bg-green-50/70 border border-green-200/60 p-3 text-xs text-green-800">
              <Clock size={15} className="shrink-0 text-green-600" />
              <span>Posts automatically delete when the pickup window finishes. Always fresh, zero stale posts.</span>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="btn-brand w-full py-3.5 text-base font-bold shadow-md hover:shadow-lg transition"
            >
              Post Food Now — Go Live 🚀
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
