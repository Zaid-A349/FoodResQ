import Reveal from './Reveal.jsx'

export default function SectionHead({ pill, title, sub, align = 'center' }) {
  const alignCls = align === 'center' ? 'text-center mx-auto' : 'text-left'
  return (
    <Reveal className={`max-w-2xl ${alignCls}`}>
      {pill && <div className="pill-label">{pill}</div>}
      <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">{title}</h2>
      {sub && <p className="mt-4 text-base leading-relaxed text-slate-600">{sub}</p>}
    </Reveal>
  )
}
