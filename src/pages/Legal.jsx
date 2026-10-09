import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, MessageCircle } from 'lucide-react'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import Reveal from '../components/Reveal.jsx'

const TABS = ['Privacy Policy', 'Terms of Service', 'Cookie Policy']

const CONTENT = {
  'Privacy Policy': {
    updated: 'Last Updated: February 2026',
    sections: [
      {
        h: 'Our Data Commitment',
        paras: [
          'We believe privacy is a fundamental human right. FoodResQ is built with "privacy by design." We do not sell, trade, or share your personal information with third-party advertisers or data brokers.',
        ],
      },
      {
        h: '1. Information We Collect',
        paras: ['We collect the minimum amount of data required to make the service functional:'],
        items: [
          ['Location Data:', 'To show you food posts nearby. We do not store your location history.'],
          ['Contact Info:', 'Phone numbers or emails provided when posting food, solely so people can coordinate pickups with you.'],
          ['User Inputs:', 'Food descriptions, quantities, and photos you explicitly share.'],
        ],
      },
      {
        h: '2. How We Use Data',
        paras: ['Data is used only for:'],
        bullets: ['Facilitating food rescues in your immediate area.', 'Preventing platform abuse and ensuring safety.', 'Improving app performance and accessibility.'],
      },
    ],
  },
  'Terms of Service': {
    updated: null,
    intro: 'By using FoodResQ, you agree to these basic community rules designed to keep everyone safe.',
    sections: [
      {
        h: 'Community Safety First',
        paras: [
          'Food safety is the responsibility of the donor. Please only share food that is fresh, hygienic, and safe for consumption. If you are uncertain about the quality of food, do not post it.',
        ],
      },
      {
        h: '1. User Responsibilities',
        bullets: [
          'Provide accurate information about the food being shared.',
          'Be respectful and punctual when coordinating pickups.',
          'Do not use the platform for commercial purposes or spam.',
        ],
      },
      {
        h: '2. Limitation of Liability',
        paras: [
          'FoodResQ acts as a connector between donors and recipients. We are not a food vendor and cannot guarantee the quality of food shared by community members. Users accept all risks associated with the transfer and consumption of food.',
        ],
      },
    ],
  },
  'Cookie Policy': {
    updated: null,
    intro: 'We use "cookies" sparingly to improve your experience. We don\'t use tracking cookies for advertising.',
    sections: [
      {
        h: 'Essential Cookies Only',
        paras: [
          'Our cookies simply remember your preferences (like your last viewed location or "I\'m Going" status) so you don\'t have to re-enter them every time.',
        ],
      },
      {
        h: 'Third-Party Cookies',
        paras: [
          'We may use basic analytics (like Google Analytics) to understand how the site is used and which cities need more support. These tools use cookies to provide us with aggregated, anonymous data.',
        ],
      },
    ],
  },
}

export default function Legal() {
  const [tab, setTab] = useState('Privacy Policy')
  const c = CONTENT[tab]

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Reveal>
          <div className="mb-8 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {TABS.map((tb) => (
              <button
                key={tb}
                onClick={() => setTab(tb)}
                className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                  tab === tb
                    ? 'bg-green-600 text-white shadow-md shadow-green-600/25'
                    : 'border border-slate-200 bg-white text-slate-600 shadow-xs hover:border-green-500/50 hover:text-green-700'
                }`}
              >
                {tb}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="card-dark border border-slate-200 bg-white p-6 shadow-xs sm:p-10">
            <h2 className="font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">{tab}</h2>
            {c.updated && <p className="mt-1.5 text-sm text-slate-500">{c.updated}</p>}
            {c.intro && <p className="mt-3 text-sm leading-relaxed text-slate-600">{c.intro}</p>}

            <div className="mt-8 space-y-8">
              {c.sections.map((s) => (
                <div key={s.h}>
                  <h3 className="font-display text-lg font-bold text-green-700">{s.h}</h3>
                  {s.paras?.map((p) => (
                    <p key={p.slice(0, 40)} className="mt-2.5 text-sm leading-relaxed text-slate-600">{p}</p>
                  ))}
                  {s.items && (
                    <div className="mt-3 space-y-2.5">
                      {s.items.map(([label, text]) => (
                        <div key={label} className="flex gap-2 text-sm leading-relaxed">
                          <span className="shrink-0 font-bold text-slate-800">{label}</span>
                          <span className="text-slate-600">{text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {s.bullets && (
                    <ul className="mt-3 space-y-2">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-600" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 border-t border-slate-100 pt-8">
              <h3 className="font-display text-lg font-bold text-slate-900">Have Legal Questions?</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                We're happy to clarify any part of our policies. Reach out to Team BrainBytes through our feedback page.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href="mailto:brainbytes.team@gmail.com" className="btn-outline inline-flex items-center gap-2 px-5 py-2.5 text-sm">
                  <Mail size={15} /> Email Us
                </a>
                <Link
                  to="/feedback"
                  className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-5 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                >
                  <MessageCircle size={15} /> Leave Feedback
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </main>

      <SiteFooter />
    </div>
  )
}
