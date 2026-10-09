import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Plus, Clock, CheckCircle2, AlertCircle, HeartHandshake,
  ShieldCheck, ArrowRight, Trash2, Share2, Sparkles, User,
  UtensilsCrossed, History, RefreshCw, LogOut, Check
} from 'lucide-react'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import Reveal from '../components/Reveal.jsx'
import { useApp } from '../store.jsx'
import { useLang } from '../i18n.jsx'

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

export default function DonorDashboard() {
  const navigate = useNavigate()
  const { t } = useLang()
  const { user, posts, activePosts, claimed, history = [], deletePost, markCompleted, logout, isDbConnected } = useApp()

  const [activeTab, setActiveTab] = useState('active') // 'active' | 'history' | 'profile'
  const [now, setNow] = useState(Date.now())
  const [successNotice, setSuccessNotice] = useState('')

  // Route guard: if not logged in, redirect to auth
  useEffect(() => {
    if (!user) {
      navigate('/auth', { state: { from: '/dashboard' }, replace: true })
    }
  }, [user, navigate])

  // Timer refresh
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15000)
    return () => clearInterval(id)
  }, [])

  if (!user) return null

  // Filter donor's posts: either matching email or name (or all if demo session)
  const isDonorPost = (p) => {
    if (p.donorEmail && user.email) return p.donorEmail.toLowerCase() === user.email.toLowerCase()
    if (p.donor && user.name) return p.donor.toLowerCase().includes(user.name.toLowerCase().split(' ')[0])
    return true // Fallback so demo users always see their entries
  }

  const myActivePosts = activePosts.filter(isDonorPost)
  const incomingPickups = myActivePosts.filter((p) => claimed.includes(p.id))

  const isDonorHistory = (h) => {
    if (h.donorEmail && user.email) return h.donorEmail.toLowerCase() === user.email.toLowerCase()
    if (h.donor && user.name) return h.donor.toLowerCase().includes(user.name.toLowerCase().split(' ')[0])
    return true
  }

  const myHistory = history.filter(isDonorHistory)

  const handleMarkCompleted = (postId) => {
    markCompleted(postId, 'Handed over to seeker')
    setSuccessNotice('Marked as handed over and saved to rescue history!')
    setTimeout(() => setSuccessNotice(''), 4000)
  }

  const handleRepost = (item) => {
    navigate('/post', {
      state: {
        prefill: {
          food: item.food,
          qty: item.qty,
          mins: item.mins || 60,
          address: item.address,
        },
      },
    })
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
        {/* Top Header Card */}
        <div className="card-dark border border-slate-200 bg-white p-6 sm:p-8 rounded-3xl shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white font-display text-2xl font-extrabold flex items-center justify-center shadow-md shadow-green-600/20 shrink-0">
                {user.name ? user.name[0].toUpperCase() : 'D'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-xl sm:text-2xl font-black text-slate-900">
                    {user.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-[11px] font-bold text-green-700">
                    <ShieldCheck size={12} className="text-green-600" /> Verified Donor
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <p className="text-xs sm:text-sm text-slate-500">
                    {user.email} • Community Surplus Food Contributor
                  </p>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isDbConnected ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-slate-100 border border-slate-200 text-slate-600'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${isDbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    {isDbConnected ? 'MongoDB Atlas Live' : 'Database Ready'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                onClick={() => navigate('/post')}
                className="btn-brand px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition cursor-pointer flex items-center gap-2"
              >
                <Plus size={18} strokeWidth={2.5} /> Post Surplus Food
              </button>
              <button
                onClick={() => {
                  logout()
                  navigate('/')
                }}
                className="rounded-2xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-600 px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-slate-600 shadow-xs transition flex items-center gap-2 cursor-pointer"
                title="Log Out of FoodResQ"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Stat Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <span className="text-xs font-semibold text-slate-500">Live Posts Now</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-2xl font-black text-slate-900">
                  {myActivePosts.length}
                </span>
                <span className="text-[11px] text-green-600 font-bold">Active</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70">
              <span className="text-xs font-semibold text-emerald-800">Seekers Coming</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-2xl font-black text-emerald-700">
                  {incomingPickups.length}
                </span>
                <span className="text-[11px] text-emerald-700 font-bold">
                  {incomingPickups.length > 0 ? 'En route!' : 'None yet'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <span className="text-xs font-semibold text-slate-500">Rescues Completed</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-2xl font-black text-slate-900">
                  {myHistory.length}
                </span>
                <span className="text-[11px] text-slate-500 font-bold">Past meals</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70">
              <span className="text-xs font-semibold text-slate-500">Reliability Score</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-2xl font-black text-green-600">100%</span>
                <span className="text-[11px] text-amber-500 font-bold">⭐⭐⭐⭐⭐</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {successNotice && (
          <div className="mb-6 flex items-center gap-2 rounded-2xl bg-green-50 border border-green-200 p-4 text-xs font-bold text-green-800 shadow-xs animate-fadeIn">
            <CheckCircle2 size={18} className="text-green-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* LIVE INCOMING PICKUP SECTION ("If someone is coming") */}
        {incomingPickups.length > 0 && (
          <div className="mb-8 rounded-3xl border-2 border-emerald-500/80 bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 p-6 sm:p-7 shadow-lg shadow-emerald-500/10">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="font-display text-lg font-black text-emerald-950">
                🚨 Someone is Coming! ({incomingPickups.length} Active Pickup in Progress)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-800 mt-1">
              A community taker tapped <strong>"I'm Going"</strong> and is heading to pick up this surplus food. Please keep it ready.
            </p>

            <div className="mt-4 space-y-3">
              {incomingPickups.map((p) => {
                const leftMins = Math.max(0, Math.round((p.expiresAt - now) / 60000))
                return (
                  <div
                    key={p.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white border border-emerald-200 p-4.5 shadow-xs"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl shrink-0">
                        {foodEmoji(p.food)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-base text-slate-900">{p.food}</h3>
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-800">
                            {p.qty}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          📍 {p.address || 'Pickup point'} • ⏰ {leftMins} min remaining on window
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleMarkCompleted(p.id)}
                        className="btn-brand px-4 py-2.5 text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <Check size={14} strokeWidth={3} /> Mark Handed Over
                      </button>
                      <button
                        onClick={() => deletePost(p.id)}
                        className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 hover:text-red-600 hover:border-red-200 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('active')}
              className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-green-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Active Listings ({myActivePosts.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-green-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Rescue History ({myHistory.length})
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-green-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Donor Options
            </button>
          </div>

          <Link
            to="/find"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-green-700 hover:underline"
          >
            Browse Public Feed →
          </Link>
        </div>

        {/* TAB 1: ACTIVE LISTINGS */}
        {activeTab === 'active' && (
          <div>
            {myActivePosts.length === 0 ? (
              <div className="card-dark border border-slate-200 bg-white p-12 text-center rounded-3xl shadow-xs">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-3xl">
                  🍲
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  No Active Food Posts Right Now
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                  Have surplus meals, bakery items, or snacks? Post them in 30 seconds to connect with nearby seekers.
                </p>
                <button
                  onClick={() => navigate('/post')}
                  className="btn-brand mt-5 px-6 py-3 text-sm font-bold cursor-pointer"
                >
                  + Post Free Food Now
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myActivePosts.map((p) => {
                  const leftMins = Math.max(0, Math.round((p.expiresAt - now) / 60000))
                  const isClaimed = claimed.includes(p.id)
                  return (
                    <div
                      key={p.id}
                      className="card-dark card-hover flex flex-col justify-between p-5.5 rounded-2xl border border-slate-200/90 bg-white shadow-xs"
                    >
                      <div>
                        {/* Status Chip */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-2xl">
                            {foodEmoji(p.food)}
                          </div>
                          {isClaimed ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" /> Seeker on the way!
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                              <Clock size={11} /> {leftMins} min left
                            </span>
                          )}
                        </div>

                        <h3 className="font-display text-base font-bold text-slate-900">{p.food}</h3>
                        <div className="text-xs font-bold text-green-700 mt-0.5">{p.qty}</div>
                        {p.note && <p className="mt-2 text-xs text-slate-600 line-clamp-2">{p.note}</p>}
                        <div className="mt-2.5 text-[11px] text-slate-500">
                          📍 {p.address || 'Meerut, Uttar Pradesh'}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleMarkCompleted(p.id)}
                          className="btn-brand flex-1 py-2 text-xs font-bold cursor-pointer"
                        >
                          ✓ Handed Over
                        </button>
                        <button
                          onClick={() => deletePost(p.id)}
                          className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:text-red-500 hover:border-red-200 transition cursor-pointer"
                          title="Delete Listing"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RESCUE HISTORY */}
        {activeTab === 'history' && (
          <div>
            {myHistory.length === 0 ? (
              <div className="card-dark border border-slate-200 bg-white p-12 text-center rounded-3xl shadow-xs">
                <History size={36} className="mx-auto text-slate-300 mb-2" />
                <h3 className="font-display text-lg font-bold text-slate-900">
                  No Past Rescues Recorded Yet
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Whenever an active food post is completed or handed over, it will be safely archived in your history.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myHistory.map((h) => (
                  <div
                    key={h.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white border border-slate-200/90 p-4.5 shadow-xs"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-2xl shrink-0">
                        {foodEmoji(h.food)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-sm sm:text-base text-slate-900">{h.food}</h3>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                            {h.qty}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>📍 {h.address || 'Nearby Area'}</span>
                          <span>•</span>
                          <span>Completed on {new Date(h.completedAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span>•</span>
                          <span className="text-green-700 font-semibold">✓ Rescued</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRepost(h)}
                      className="btn-outline px-3.5 py-2 text-xs font-semibold text-green-700 hover:bg-green-50 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <RefreshCw size={13} /> Re-Post This Item
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DONOR OPTIONS & PROFILE */}
        {activeTab === 'profile' && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card-dark border border-slate-200 bg-white p-6 sm:p-7 rounded-3xl shadow-xs">
              <h3 className="font-display text-base font-bold text-slate-900 mb-4">
                Donor Profile Details
              </h3>
              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="flex justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-slate-400">Donor Name:</span>
                  <span className="font-bold text-slate-900">{user.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-slate-400">Account Email:</span>
                  <span className="font-bold text-slate-900">{user.email}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-slate-400">Active City:</span>
                  <span className="font-bold text-slate-900">Meerut, Uttar Pradesh</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-slate-400">Donor Status:</span>
                  <span className="font-bold text-green-600">Verified Platform Donor</span>
                </div>
              </div>

              <button
                onClick={() => logout()}
                className="mt-6 w-full rounded-xl border border-red-200 bg-red-50/50 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut size={14} /> Log Out of Donor Account
              </button>
            </div>

            <div className="card-dark border border-slate-200 bg-white p-6 sm:p-7 rounded-3xl shadow-xs">
              <h3 className="font-display text-base font-bold text-slate-900 mb-4">
                Quick Platform Shortcuts
              </h3>
              <div className="space-y-2.5">
                <button
                  onClick={() => navigate('/post')}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-green-500 hover:bg-green-50/40 transition text-left text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <span>Post Surplus Food Form</span>
                  <ArrowRight size={14} className="text-green-600" />
                </button>
                <button
                  onClick={() => navigate('/find')}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-green-500 hover:bg-green-50/40 transition text-left text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <span>Browse Live Food Feed (Seeker View)</span>
                  <ArrowRight size={14} className="text-green-600" />
                </button>
                <button
                  onClick={() => navigate('/features')}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-green-500 hover:bg-green-50/40 transition text-left text-xs font-bold text-slate-800 cursor-pointer"
                >
                  <span>View Platform Features & Zomato/Swiggy API</span>
                  <ArrowRight size={14} className="text-green-600" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
