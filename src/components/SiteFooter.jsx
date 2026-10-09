import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { useLang } from '../i18n.jsx'

export default function SiteFooter() {
  const { t } = useLang()

  const links = [
    { label: t('nav.postFood'), to: '/post' },
    { label: t('nav.findFood'), to: '/find' },
    { label: t('nav.features'), to: '/features' },
    { label: t('nav.ngo'), to: '/ngo' },
    { label: t('nav.about'), to: '/about' },
    { label: 'Donate', to: '/donate' },
    { label: t('nav.feedback'), to: '/feedback' },
    { label: t('nav.legal'), to: '/legal' },
  ]

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-4 py-7 sm:flex-row sm:px-6">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <Logo size={32} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-extrabold text-slate-900">
                Food<span className="text-green-600">ResQ</span>
              </span>
              <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700">
                #ZeroWaste
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Developed by <span className="font-semibold text-slate-700">Team BrainBytes</span>
            </p>
          </div>
        </div>

        {/* Smart Inline Navigation */}
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-600">
          {links.map((l) => (
            <Link
              key={l.to + l.label}
              to={l.to}
              className="transition hover:text-green-600"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Compact Status & Copyright */}
        <div className="text-center text-xs text-slate-400 sm:text-right">
          <p className="font-medium text-slate-600">© 2026 FoodResQ</p>
          <p className="text-[11px] text-slate-400">100% Free • Fighting Food Waste</p>
        </div>
      </div>
    </footer>
  )
}
