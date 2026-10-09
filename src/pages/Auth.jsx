import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
  UtensilsCrossed,
  ShieldCheck,
  Phone
} from 'lucide-react'
import { useLang } from '../i18n.jsx'
import { useApp } from '../store.jsx'
import Logo from '../components/Logo.jsx'

export default function Auth({ initialTab }) {
  const navigate = useNavigate()
  const location = useLocation()
  const destination = location.state?.from || '/dashboard'
  const { t } = useLang()
  const { user, login, register, loginDemo, loginDemoNgo, logout } = useApp()

  // Determine starting tab from prop, location query, or default
  const searchParams = new URLSearchParams(location.search)
  const queryTab = searchParams.get('tab')
  const defaultTab = initialTab || (queryTab === 'ngo' ? 'ngo' : queryTab === 'donor' || queryTab === 'register' ? 'donor' : 'login')

  const [tab, setTab] = useState(defaultTab) // 'login' | 'donor' | 'ngo'
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState('')
  const [loading, setLoading] = useState(false)

  // Form fields
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    phone: '',
    orgName: '',
    darpanId: '',
    capacity: '100-250 meals/day',
    city: 'Meerut',
  })

  // Synchronize when initialTab or route query changes
  useEffect(() => {
    if (initialTab) setTab(initialTab)
    else if (queryTab) {
      if (queryTab === 'ngo') setTab('ngo')
      else if (queryTab === 'donor' || queryTab === 'register') setTab('donor')
      else setTab('login')
    }
  }, [initialTab, queryTab])

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setError('')
  }

  const switchTab = (nextTab) => {
    setTab(nextTab)
    setError('')
    setDone('')
  }

  // 1-Click Demo Donor Login
  const handleDemoDonor = async () => {
    setError('')
    setLoading(true)
    try {
      setForm((prev) => ({
        ...prev,
        email: 'donor@foodresq.org',
        password: 'password123',
      }))
      const res = await loginDemo()
      if (res && res.ok) {
        setDone('Signed in as Rohan Sharma (Demo Donor)')
        setTimeout(() => navigate('/dashboard'), 400)
      } else {
        setError(res?.error || 'Demo login failed. Please try again.')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // 1-Click Demo NGO Login
  const handleDemoNgo = async () => {
    setError('')
    setLoading(true)
    try {
      setForm((prev) => ({
        ...prev,
        email: 'ngo@foodresq.org',
        password: 'password123',
      }))
      const res = await loginDemoNgo()
      if (res && res.ok) {
        setDone('Signed in as Robin Hood Army Meerut (Verified NGO)')
        setTimeout(() => navigate('/ngo/dashboard'), 400)
      } else {
        setError(res?.error || 'Demo NGO login failed. Please try again.')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Mode 1: Login
    if (tab === 'login') {
      if (!form.email.trim() || !form.password) {
        setLoading(false)
        return setError('Please enter your email and password.')
      }
      const res = await login(form.email.trim(), form.password)
      setLoading(false)
      if (!res.ok) return setError(res.error)
      setDone('Welcome back!')
      const nextPath = res.user?.role === 'ngo' ? '/ngo/dashboard' : destination
      setTimeout(() => navigate(nextPath), 400)
      return
    }

    // Mode 2: Donor Register
    if (tab === 'donor') {
      if (form.name.trim().length < 2) {
        setLoading(false)
        return setError('Please enter your name or business name.')
      }
      if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
        setLoading(false)
        return setError('Please enter a valid email address.')
      }
      if (form.password.length < 6) {
        setLoading(false)
        return setError('Password must be at least 6 characters.')
      }
      if (form.password !== form.confirm) {
        setLoading(false)
        return setError('Passwords do not match.')
      }

      const res = await register(form.name.trim(), form.email.trim(), form.password, {
        role: 'donor',
        phone: form.phone.trim(),
        city: form.city.trim() || 'Meerut',
      })
      setLoading(false)
      if (!res.ok) return setError(res.error)
      setDone('Donor account registered successfully!')
      setTimeout(() => navigate('/dashboard'), 400)
      return
    }

    // Mode 3: NGO Register
    if (tab === 'ngo') {
      if (!form.orgName.trim()) {
        setLoading(false)
        return setError('Please enter the NGO / Organization name.')
      }
      if (!form.name.trim()) {
        setLoading(false)
        return setError('Please enter the representative contact person name.')
      }
      if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
        setLoading(false)
        return setError('Please enter a valid official email address.')
      }
      if (form.password.length < 6) {
        setLoading(false)
        return setError('Password must be at least 6 characters.')
      }
      if (form.password !== form.confirm) {
        setLoading(false)
        return setError('Passwords do not match.')
      }
      if (!form.phone.trim()) {
        setLoading(false)
        return setError('Please enter a contact phone or WhatsApp number.')
      }

      const res = await register(form.name.trim(), form.email.trim(), form.password, {
        role: 'ngo',
        organization: form.orgName.trim(),
        phone: form.phone.trim(),
        city: form.city.trim() || 'Meerut',
        darpanId: form.darpanId.trim() || 'VERIFIED-NGO-2026',
        capacity: form.capacity,
      })
      setLoading(false)
      if (!res.ok) return setError(res.error)
      setDone('Verified NGO profile registered successfully!')
      setTimeout(() => navigate('/ngo/dashboard'), 400)
    }
  }

  // Logged-in View
  if (user) {
    const isNgo = user.role === 'ngo'
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between">
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200/70 bg-white">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={32} />
            <span className="font-display font-extrabold text-lg text-slate-900">
              Food<span className="text-green-600">ResQ</span>
            </span>
          </Link>
          <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center p-4 py-8">
          <div className="w-full max-w-lg bg-white border border-slate-200/80 rounded-3xl p-8 text-center shadow-xl shadow-slate-900/5">
            <div className={`mx-auto mb-4 h-16 w-16 rounded-2xl flex items-center justify-center font-display text-2xl font-bold shadow-sm ${
              isNgo
                ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                : 'bg-green-50 text-green-700 border border-green-200/60'
            }`}>
              {isNgo ? <Building2 size={32} /> : user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="flex items-center justify-center gap-2">
              <h1 className="font-display text-xl font-bold text-slate-900">
                {isNgo ? (user.organization || user.name) : user.name}
              </h1>
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                isNgo
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                <ShieldCheck size={12} /> {isNgo ? 'Verified NGO' : 'Donor Partner'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{user.email}</p>

            <div className="mt-7 space-y-3">
              <button
                onClick={() => navigate(isNgo ? '/ngo/dashboard' : '/dashboard')}
                className={`w-full py-3 text-sm font-bold rounded-xl shadow-md transition cursor-pointer text-white ${
                  isNgo ? 'bg-blue-600 hover:bg-blue-700' : 'btn-brand'
                }`}
              >
                {isNgo ? 'Go to NGO Dashboard 🏛️' : 'Go to Donor Dashboard 📊'}
              </button>
              <button
                onClick={() => navigate('/find')}
                className="w-full py-2.5 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
              >
                Browse Live Surplus Food 🍲
              </button>
              <button
                onClick={() => logout()}
                className="w-full text-xs font-semibold text-slate-400 hover:text-red-500 transition pt-2 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut size={13} /> Sign Out
              </button>
            </div>
          </div>
        </main>

        <footer className="py-4 text-center text-xs text-slate-400">
          FoodResQ • Free Surplus Food Rescue
        </footer>
      </div>
    )
  }

  // Header icon & titles per tab
  const tabMeta = {
    login: {
      icon: '🍽️',
      title: 'Welcome Back',
      sub: 'Sign in to manage surplus food donations or NGO pickups',
      badgeColor: 'bg-green-50 text-green-700 border-green-200',
    },
    donor: {
      icon: '🍲',
      title: 'Donor Registration',
      sub: 'For restaurants, banquet halls, caterers & community cooks',
      badgeColor: 'bg-green-50 text-green-700 border-green-200',
    },
    ngo: {
      icon: '🏛️',
      title: 'NGO Partner Registration',
      sub: 'For verified charities, community kitchens & relief teams',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
  }[tab]

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between">
      {/* Symmetrical Minimal Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200/70 bg-white">
        <Link to="/" className="flex items-center gap-2">
          <Logo size={32} />
          <span className="font-display font-extrabold text-lg text-slate-900">
            Food<span className="text-green-600">ResQ</span>
          </span>
        </Link>
        <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </header>

      {/* Symmetrical Centered Form Card */}
      <main className="flex-1 flex items-center justify-center p-4 py-8 sm:py-12">
        <div className="w-full max-w-lg">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5">
            {/* Symmetrical Card Top Title */}
            <div className="text-center mb-6">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-2xl border border-slate-200/70 shadow-2xs">
                {tabMeta.icon}
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
                {tabMeta.title}
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-xs sm:max-w-sm mx-auto">
                {tabMeta.sub}
              </p>
            </div>

            {/* Symmetrical 3-Way Segmented Switcher */}
            <div className="flex rounded-xl bg-slate-100 p-1 mb-5 text-xs font-bold gap-1">
              <button
                type="button"
                onClick={() => switchTab('login')}
                className={`flex-1 py-2.5 rounded-lg transition text-center cursor-pointer ${
                  tab === 'login'
                    ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchTab('donor')}
                className={`flex-1 py-2.5 rounded-lg transition text-center cursor-pointer ${
                  tab === 'donor'
                    ? 'bg-white text-green-700 shadow-xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Donor Register
              </button>
              <button
                type="button"
                onClick={() => switchTab('ngo')}
                className={`flex-1 py-2.5 rounded-lg transition text-center cursor-pointer ${
                  tab === 'ngo'
                    ? 'bg-white text-blue-700 shadow-xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                NGO Register
              </button>
            </div>

            {/* Alert Banners */}
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs text-red-600 font-medium">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {done && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-3.5 py-2.5 text-xs text-green-700 font-medium">
                <CheckCircle2 size={15} className="shrink-0" />
                <span>{done}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* TAB 1: LOGIN */}
              {tab === 'login' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={set('email')}
                      placeholder="name@example.com"
                      autoComplete="email"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/10"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setError('Use demo login below or register a new test account.')}
                        className="text-[11px] font-semibold text-green-600 hover:text-green-700 cursor-pointer"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={form.password}
                        onChange={set('password')}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: DONOR REGISTER */}
              {tab === 'donor' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name or Caterer / Restaurant Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={set('name')}
                      placeholder="e.g. Rohan Sharma or Green Leaf Caterers"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/10"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={set('email')}
                        placeholder="donor@example.com"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={set('phone')}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Password (min 6) *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={form.password}
                          onChange={set('password')}
                          placeholder="••••••••"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={form.confirm}
                        onChange={set('confirm')}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/10"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* TAB 3: NGO REGISTER */}
              {tab === 'ngo' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      NGO / Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.orgName}
                      onChange={set('orgName')}
                      placeholder="e.g. Robin Hood Army Meerut, Roti Bank"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Representative Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={set('name')}
                        placeholder="e.g. Priya Mehra"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={set('phone')}
                        placeholder="+91 94123 45678"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={set('email')}
                      placeholder="ngo@organization.org"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        NGO Darpan ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={form.darpanId}
                        onChange={set('darpanId')}
                        placeholder="UP/2022/0314892"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Daily Capacity
                      </label>
                      <select
                        value={form.capacity}
                        onChange={set('capacity')}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                      >
                        <option value="50-100 meals/day">50 - 100 meals</option>
                        <option value="100-250 meals/day">100 - 250 meals</option>
                        <option value="250-500 meals/day">250 - 500 meals</option>
                        <option value="500+ meals/day">500+ meals</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Password (min 6) *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={form.password}
                          onChange={set('password')}
                          placeholder="••••••••"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={form.confirm}
                        onChange={set('confirm')}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Symmetrical Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 text-sm font-bold shadow-sm hover:shadow-md transition cursor-pointer disabled:opacity-60 rounded-xl !mt-5 ${
                  tab === 'ngo'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'btn-brand'
                }`}
              >
                {loading
                  ? 'Please wait…'
                  : tab === 'login'
                  ? 'Sign In'
                  : tab === 'donor'
                  ? 'Create Donor Account'
                  : 'Register Verified NGO'}
              </button>
            </form>

            {/* Symmetrical 1-Click Demo Logins */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs font-semibold">
              <button
                type="button"
                onClick={handleDemoDonor}
                disabled={loading}
                className="text-green-700 hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>⚡ Demo Donor</span>
                <span className="text-slate-400 font-normal">(Rohan)</span>
              </button>
              <span className="hidden sm:inline text-slate-300">•</span>
              <button
                type="button"
                onClick={handleDemoNgo}
                disabled={loading}
                className="text-blue-700 hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>🏛️ Demo NGO</span>
                <span className="text-slate-400 font-normal">(Robin Hood Army)</span>
              </button>
            </div>
          </div>

          {/* Simple Note for Seekers */}
          <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
            Taking food? Seekers don't need an account to view and claim food nearby.
          </p>
        </div>
      </main>

      {/* Symmetrical Minimal Footer */}
      <footer className="py-4 text-center text-xs text-slate-400">
        FoodResQ • Free Surplus Food Rescue
      </footer>
    </div>
  )
}
