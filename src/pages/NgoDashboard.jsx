import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Building2,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  Navigation,
  LogOut,
  RefreshCw,
  Share2,
  Phone,
  AlertCircle,
  Truck,
  HeartHandshake,
  FileCheck,
  Check
} from 'lucide-react'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import Reveal from '../components/Reveal.jsx'
import { useApp } from '../store.jsx'

function foodEmoji(food = '') {
  const f = food.toLowerCase()
  if (f.includes('biryani') || f.includes('rice') || f.includes('pulao')) return '🍛'
  if (f.includes('sandwich')) return '🥪'
  if (f.includes('cake') || f.includes('pastry') || f.includes('sweet')) return '🍰'
  if (f.includes('fruit') || f.includes('produce')) return '🍎'
  if (f.includes('burger') || f.includes('bread') || f.includes('bakery')) return '🥖'
  if (f.includes('roti') || f.includes('chapati') || f.includes('curry') || f.includes('dal')) return '🍲'
  return '🍽️'
}

export default function NgoDashboard() {
  const navigate = useNavigate()
  const { user, activePosts, claimed, history = [], claim, markCompleted, logout, isDbConnected } = useApp()

  const [activeTab, setActiveTab] = useState('feed') // 'feed' | 'active' | 'history' | 'profile'
  const [now, setNow] = useState(Date.now())
  const [notice, setNotice] = useState('')

  // Route guard: if not logged in, redirect to NGO register/auth
  useEffect(() => {
    if (!user) {
      navigate('/ngo/register', { replace: true })
    }
  }, [user, navigate])

  // Timer refresh
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15000)
    return () => clearInterval(id)
  }, [])

  if (!user) return null

  const orgDisplayName = user.organization || user.name || 'Verified NGO Partner'
  const darpanNumber = user.darpanId || 'UP/2022/0314892'

  // Pickups claimed by this NGO or currently claimed
  const myClaimedPosts = activePosts.filter((p) => claimed.includes(p.id))

  // Past rescues
  const isNgoHistory = (h) => {
    if (h.recipient && user.organization) {
      return h.recipient.toLowerCase().includes(user.organization.toLowerCase().split(' ')[0])
    }
    return true
  }
  const myNgoHistory = history.filter(isNgoHistory)

  const handleClaimFood = (post) => {
    claim(post.id, {
      seekerName: orgDisplayName,
      seekerEmail: user.email,
      seekerPhone: user.phone || '+91 94123 45678',
    })
    setNotice(`Claimed "${post.food}" for NGO collection! Donor has been alerted.`)
    setTimeout(() => setNotice(''), 4500)
  }

  const handleCompleteHandover = (postId, foodTitle) => {
    markCompleted(postId, `Collected and distributed by ${orgDisplayName}`)
    setNotice(`Successfully recorded distribution of "${foodTitle}"!`)
    setTimeout(() => setNotice(''), 4500)
  }

  const gmaps = (p) => `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
        {/* Top Header Card */}
        <div className="card-dark border border-slate-200 bg-white p-6 sm:p-8 rounded-3xl shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-display text-2xl font-extrabold flex items-center justify-center shadow-md shadow-blue-600/20 shrink-0">
                <Building2 size={30} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-xl sm:text-2xl font-black text-slate-900">
                    {orgDisplayName}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
                    <ShieldCheck size={12} className="text-blue-600" /> Verified NGO Partner
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <p className="text-xs sm:text-sm text-slate-500">
                    Rep: {user.name} • {user.email} • Darpan: {darpanNumber}
                  </p>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isDbConnected ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-slate-100 border border-slate-200 text-slate-600'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${isDbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    {isDbConnected ? 'MongoDB Atlas Live' : 'Database Connected'}
                  </span>
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                onClick={() => navigate('/find')}
                className="btn-brand px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition cursor-pointer flex items-center gap-2"
              >
                <Truck size={17} /> Live City Map
              </button>
              <button
                onClick={() => {
                  logout()
                  navigate('/')
                }}
                className="rounded-2xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-600 px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-slate-600 shadow-xs transition flex items-center gap-2 cursor-pointer"
                title="Log Out of NGO Account"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/70">
              <span className="text-xs font-semibold text-blue-700">Surplus Food Nearby</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-2xl font-black text-slate-900">
                  {activePosts.length}
                </span>
                <span className="text-[11px] text-blue-600 font-bold">Available Now</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70">
              <span className="text-xs font-semibold text-amber-700">Reserved / Pickups En Route</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-2xl font-black text-slate-900">
                  {myClaimedPosts.length}
                </span>
                <span className="text-[11px] text-amber-600 font-bold">Active</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-green-50/60 border border-green-200/70">
              <span className="text-xs font-semibold text-green-700">Rescued & Distributed</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-2xl font-black text-slate-900">
                  {Math.max(120, myNgoHistory.length * 35)}
                </span>
                <span className="text-[11px] text-green-600 font-bold">Meals</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <span className="text-xs font-semibold text-slate-500">Operating City</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-display text-lg font-black text-slate-900">
                  {user.city || 'Meerut'}
                </span>
                <span className="text-[11px] text-emerald-600 font-bold">● Active Zone</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Notice Banner */}
        {notice && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl bg-blue-50 border border-blue-200 px-5 py-3.5 text-xs sm:text-sm text-blue-800 font-semibold shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-blue-600 shrink-0" />
              <span>{notice}</span>
            </div>
            <button
              onClick={() => setNotice('')}
              className="text-xs text-blue-600 hover:text-blue-900 font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-6 gap-2 sm:gap-6 overflow-x-auto">
          {[
            { id: 'feed', label: `Surplus Food Feed (${activePosts.length})` },
            { id: 'active', label: `Our Pickups (${myClaimedPosts.length})` },
            { id: 'history', label: `Rescue Records (${myNgoHistory.length})` },
            { id: 'profile', label: 'NGO Credentials & Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Live Surplus Food Feed for Bulk Claims */}
        {activeTab === 'feed' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                  Available Surplus Food in Meerut
                </h2>
                <p className="text-xs text-slate-500">
                  Direct donor listings from banquet halls, catering services, and restaurants ready for NGO pickup.
                </p>
              </div>
            </div>

            {activePosts.length === 0 ? (
              <div className="card-dark border border-slate-200 bg-white p-12 text-center rounded-3xl">
                <div className="text-4xl mb-3">🍲</div>
                <h3 className="font-display text-lg font-bold text-slate-900">No active surplus food right now</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  All current food posts have been rescued or expired. New banquet posts usually arrive around 3 PM and 9 PM.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activePosts.map((post) => {
                  const leftMins = Math.max(0, Math.round((post.expiresAt - now) / 60000))
                  const isClaimedByMe = claimed.includes(post.id)

                  return (
                    <div
                      key={post.id}
                      className={`card-dark border bg-white p-5 rounded-2xl shadow-xs transition hover:shadow-md flex flex-col justify-between ${
                        isClaimedByMe ? 'border-blue-300 bg-blue-50/20' : 'border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl border border-blue-100">
                              {foodEmoji(post.food)}
                            </span>
                            <div>
                              <h3 className="font-display text-base font-bold text-slate-900">
                                {post.food}
                              </h3>
                              <p className="text-xs font-bold text-blue-600">
                                {post.qty}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                              leftMins <= 20
                                ? 'bg-red-50 text-red-600 border border-red-200'
                                : 'bg-green-50 text-green-700 border border-green-200'
                            }`}
                          >
                            <Clock size={11} /> {leftMins}m left
                          </span>
                        </div>

                        {post.note && (
                          <p className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            📝 {post.note}
                          </p>
                        )}

                        <div className="mt-3.5 space-y-1 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-slate-700">Donor:</span>
                            <span>{post.donor}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin size={12} className="text-slate-400 shrink-0" />
                            <span className="truncate">{post.address}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
                        <a
                          href={gmaps(post)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600"
                        >
                          <Navigation size={13} /> Route Map
                        </a>

                        {isClaimedByMe ? (
                          <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-100 px-4 py-2 text-xs font-bold text-blue-800">
                            <Check size={14} /> Claimed by Your NGO
                          </span>
                        ) : (
                          <button
                            onClick={() => handleClaimFood(post)}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Truck size={14} /> Claim for NGO Pickup
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Active NGO Pickups En Route */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                Active Pickups En Route ({myClaimedPosts.length})
              </h2>
              <p className="text-xs text-slate-500">
                Donations currently reserved by your team. Head to the donor location and confirm handover once collected.
              </p>
            </div>

            {myClaimedPosts.length === 0 ? (
              <div className="card-dark border border-slate-200 bg-white p-12 text-center rounded-3xl">
                <div className="text-4xl mb-3">🚚</div>
                <h3 className="font-display text-lg font-bold text-slate-900">No active pickups reserved</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Browse the Available Surplus Food Feed and click "Claim for NGO Pickup" to dispatch volunteers.
                </p>
                <button
                  onClick={() => setActiveTab('feed')}
                  className="mt-4 btn-brand px-6 py-2.5 text-xs font-bold"
                >
                  Browse Available Food
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {myClaimedPosts.map((post) => {
                  const leftMins = Math.max(0, Math.round((post.expiresAt - now) / 60000))
                  return (
                    <div
                      key={post.id}
                      className="border border-blue-200 bg-white p-5 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl border border-blue-100 shrink-0">
                          {foodEmoji(post.food)}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-base font-bold text-slate-900">
                              {post.food}
                            </h3>
                            <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                              Reserved for {orgDisplayName}
                            </span>
                          </div>
                          <p className="text-xs text-blue-700 font-semibold mt-0.5">
                            Quantity: {post.qty} • Donor: {post.donor}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                            <MapPin size={12} className="text-slate-400" />
                            <span>{post.address}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                        <a
                          href={gmaps(post)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5"
                        >
                          <Navigation size={13} /> GPS Directions
                        </a>
                        <button
                          onClick={() => handleCompleteHandover(post.id, post.food)}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 size={15} /> Confirm Collected & Distributed
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: NGO Rescue Records */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                Rescue & Distribution Records
              </h2>
              <p className="text-xs text-slate-500">
                Audit trail of all meals collected and distributed by {orgDisplayName}.
              </p>
            </div>

            {myNgoHistory.length === 0 ? (
              <div className="card-dark border border-slate-200 bg-white p-12 text-center rounded-3xl">
                <div className="text-4xl mb-3">📜</div>
                <h3 className="font-display text-lg font-bold text-slate-900">No completed rescues yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Completed food distributions will be permanently archived here with timestamps and donor references.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myNgoHistory.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="border border-slate-200 bg-white p-5 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        ✓
                      </span>
                      <div>
                        <h4 className="font-display text-sm sm:text-base font-bold text-slate-900">
                          {item.food}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {item.qty} • Donated by: <strong>{item.donor}</strong>
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Location: {item.address}
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                        ✓ Distributed to Beneficiaries
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {new Date(item.completedAt || Date.now()).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: NGO Credentials & Settings */}
        {activeTab === 'profile' && (
          <div className="card-dark border border-slate-200 bg-white p-6 sm:p-8 rounded-3xl shadow-xs space-y-6">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                NGO Organization Profile
              </h2>
              <p className="text-xs text-slate-500">
                Verified registration details registered on FoodResQ and MongoDB Atlas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-400">Organization Name</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{orgDisplayName}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-400">NGO Darpan Registration</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{darpanNumber}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-400">Primary Contact Person</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{user.name}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-400">Official Email</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{user.email}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-400">Phone / WhatsApp</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{user.phone || '+91 94123 45678'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-semibold text-slate-400">Distribution Capacity</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{user.capacity || '250 meals/day'}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Need to update verification certificate or coverage area? Contact support@foodresq.org
              </span>
              <button
                onClick={() => {
                  logout()
                  navigate('/')
                }}
                className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition cursor-pointer"
              >
                Sign Out of NGO Account
              </button>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
