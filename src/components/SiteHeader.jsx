import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Globe, Plus } from 'lucide-react'
import Logo from './Logo.jsx'
import { useLang } from '../i18n.jsx'
import { useApp } from '../store.jsx'

export default function SiteHeader() {
  const { t, toggle, lang } = useLang()
  const { user } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  const handlePostFood = () => {
    if (!user) {
      navigate('/auth', { state: { from: '/post' } })
    } else {
      navigate('/post')
    }
  }

  const navItems = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.findFood'), to: '/find' },
    { label: t('nav.postFood'), onClick: handlePostFood, isAction: true },
    ...(user
      ? [
          {
            label: user.role === 'ngo' ? 'NGO Dashboard' : 'Dashboard',
            to: user.role === 'ngo' ? '/ngo/dashboard' : '/dashboard',
          },
        ]
      : []),
    { label: t('nav.features'), to: '/features' },
    { label: t('nav.about'), to: '/about' },
    { label: t('nav.ngo'), to: '/ngo' },
    { label: t('nav.donate'), to: '/donate' },
    { label: t('nav.feedback'), to: '/feedback' },
  ]

  return (
    <header className="sticky top-0 z-[10000] border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <Logo size={36} />
          <span className="font-display text-xl font-extrabold tracking-tight text-slate-900">
            Food<span className="text-green-600">ResQ</span>
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {navItems.map((item) => {
            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-green-600 px-3 py-2 text-xs lg:text-sm font-bold text-white shadow-xs hover:bg-green-500 hover:shadow-md transition cursor-pointer"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  {item.label}
                </button>
              )
            }
            const active = location.pathname === item.to
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`rounded-xl px-2.5 py-2 text-xs lg:text-sm font-semibold transition ${
                  active
                    ? 'bg-green-50 text-green-700 font-bold border border-green-200/60'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-green-700'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Language Switcher & Auth */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggle}
            aria-label="Language switcher"
            className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-xs transition hover:border-green-500/50 hover:bg-green-50 hover:text-green-700"
          >
            <Globe size={15} className="text-green-600" />
            <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
          <button
            onClick={() => {
              if (user) {
                navigate(user.role === 'ngo' ? '/ngo/dashboard' : '/dashboard')
              } else {
                navigate('/auth', { state: { from: '/dashboard' } })
              }
            }}
            className="flex h-9 items-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-xs transition hover:border-green-500/50 hover:bg-green-50 hover:text-green-700 cursor-pointer"
          >
            {user
              ? user.role === 'ngo'
                ? 'NGO Dashboard 🏛️'
                : user.name
                ? `${user.name.split(' ')[0]}'s Dashboard`
                : 'Dashboard'
              : 'Login'}
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar Strip */}
      <div className="flex md:hidden overflow-x-auto nice-scroll border-t border-slate-100 bg-white/95 px-3 py-2 gap-1.5 scrollbar-none">
        {navItems.map((item) => {
          if (item.onClick) {
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                type="button"
                className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs whitespace-nowrap transition cursor-pointer"
              >
                <Plus size={12} strokeWidth={2.5} />
                {item.label}
              </button>
            )
          }
          const active = location.pathname === item.to
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                active
                  ? 'bg-green-50 text-green-700 border border-green-200/60 font-bold'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-green-700'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </header>
  )
}
