import { useEffect, useState } from 'react'
import { Cookie } from 'lucide-react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('frm_cookie')) setVisible(true)
  }, [])

  if (!visible) return null

  const set = (v) => {
    localStorage.setItem('frm_cookie', v)
    setVisible(false)
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-[100000] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-md">
      <div className="card-dark border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/15">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <Cookie size={20} />
          </div>
          <div>
            <h4 className="font-display text-base font-bold text-slate-900">Cookie Preference</h4>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              We use essential cookies to ensure the best experience on FoodResQ. No tracking for ads, ever.
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => set('all')}
            className="rounded-xl bg-green-600 py-2.5 text-sm font-bold text-white shadow-md shadow-green-600/25 transition hover:bg-green-500"
          >
            ✓ Accept All
          </button>
          <button
            onClick={() => set('essential')}
            className="rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Reject Optional
          </button>
        </div>
      </div>
    </div>
  )
}
