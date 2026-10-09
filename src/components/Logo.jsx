export default function Logo({ size = 36 }) {
  return (
    <img
      src="/logo.png"
      alt="Logo"
      width={size}
      height={size}
      className="rounded-xl object-contain"
      style={{ filter: 'drop-shadow(0 0 12px rgba(132,204,22,.35))' }}
    />
  )
}
