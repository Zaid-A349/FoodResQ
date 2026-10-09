import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import L from 'leaflet'
import {
  Home, Menu as MenuIcon, X, LayoutList, Map as MapIcon, Plus, Navigation, Clock,
  MessageCircle, CheckCircle2, Trash2, Globe, Lock, Search,
} from 'lucide-react'
import Logo from '../components/Logo.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { useApp } from '../store.jsx'
import { useLang } from '../i18n.jsx'
import { reverseGeocode } from '../utils/geo.js'

const DEFAULT_CENTER = [28.9845, 77.7064] // Meerut

function pinIcon() {
  return L.divIcon({ className: '', html: '<div class="food-pin"><span>🍛</span></div>', iconSize: [34, 34], iconAnchor: [17, 34], popupAnchor: [0, -32] })
}

function userIcon() {
  return L.divIcon({ className: '', html: '<div class="user-dot"></div>', iconSize: [16, 16], iconAnchor: [8, 8] })
}

export default function MapPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t, toggle, lang } = useLang()
  const { user, activePosts, addPost, deletePost, claim, claimed, openPostModal } = useApp()

  const mapRef = useRef(null)
  const mapInst = useRef(null)
  const markersLayer = useRef(null)
  const userMarker = useRef(null)
  const clickHandler = useRef(null)

  const [view, setView] = useState('map') // map | list
  const [formOpen, setFormOpen] = useState(false)
  const [locating, setLocating] = useState(false)
  const [picked, setPicked] = useState(null)

  const [food, setFood] = useState('')
  const [qty, setQty] = useState('')
  const [mins, setMins] = useState('60')
  const [note, setNote] = useState('')
  const [formMsg, setFormMsg] = useState('')

  // init map
  useEffect(() => {
    if (mapInst.current || !mapRef.current) return
    const map = L.map(mapRef.current, { zoomControl: false }).setView(DEFAULT_CENTER, 13)
    L.control.zoom({ position: 'topleft' }).addTo(map)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)
    markersLayer.current = L.layerGroup().addTo(map)
    mapInst.current = map
    return () => {
      map.remove()
      mapInst.current = null
    }
  }, [])

  // user location
  useEffect(() => {
    if (!mapInst.current) return
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const ll = [pos.coords.latitude, pos.coords.longitude]
        if (userMarker.current) userMarker.current.setLatLng(ll)
        else userMarker.current = L.marker(ll, { icon: userIcon() }).addTo(mapInst.current)
        mapInst.current.setView(ll, 14)
      },
      () => {},
      { enableHighAccuracy: false, timeout: 8000 }
    )
  }, [mapInst.current])

  // render post markers
  useEffect(() => {
    if (!markersLayer.current) return
    markersLayer.current.clearLayers()
    activePosts.forEach((p) => {
      const m = L.marker([p.lat, p.lng], { icon: pinIcon() })
      const left = Math.max(0, Math.round((p.expiresAt - Date.now()) / 60000))
      m.bindPopup(
        `<div style="min-width:200px">
          <div style="font-family:Outfit;font-weight:800;font-size:15px;color:#0f172a">${escapeHtml(p.food)}</div>
          <div style="margin-top:2px;color:#16a34a;font-weight:700;font-size:12px">${escapeHtml(p.qty)} · ${left} min left</div>
          ${p.note ? `<div style="margin-top:6px;color:#475569;font-size:12px">${escapeHtml(p.note)}</div>` : ''}
          <div style="margin-top:6px;color:#64748b;font-size:11px">by ${escapeHtml(p.donor || 'Community member')}</div>
          <div style="display:flex;gap:6px;margin-top:10px">
            <button data-claim="${p.id}" style="flex:1;background:#16a34a;color:#ffffff;border:none;border-radius:8px;padding:7px 0;font-weight:800;font-size:12px;cursor:pointer">${t('map.imGoing')}</button>
            <a href="https://wa.me/?text=${encodeURIComponent(waText(p))}" target="_blank" rel="noreferrer" style="flex:1;background:#22c55e;color:#ffffff;border:none;border-radius:8px;padding:7px 0;font-weight:800;font-size:12px;text-align:center;text-decoration:none;display:block">WhatsApp</a>
          </div>
        </div>`
      )
      markersLayer.current.addLayer(m)
    })
  }, [activePosts, claimed, t])

  // popup claim clicks (delegated)
  useEffect(() => {
    const el = mapRef.current
    if (!el) return
    const onClick = (e) => {
      const btn = e.target.closest('[data-claim]')
      if (btn) {
        claim(btn.dataset.claim)
        const b = btn
        b.textContent = '✓ ' + t('map.claimed')
        b.style.background = '#15803d'
        b.style.color = '#ffffff'
      }
    }
    el.addEventListener('click', onClick)
    return () => el.removeEventListener('click', onClick)
  }, [claim, t])

  const startShare = () => {
    if (!user) {
      navigate('/auth')
      return
    }
    setFormOpen(true)
    setFormMsg('')
    // let user click map to set location
    if (mapInst.current && clickHandler.current == null) {
      setPicked(null)
      clickHandler.current = async (e) => {
        const lat = e.latlng.lat
        const lng = e.latlng.lng
        const name = await reverseGeocode(lat, lng)
        setPicked({ lat, lng, address: name })
        L.popup().setLatLng(e.latlng).setContent(`📍 ${name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`}`).openOn(mapInst.current)
        mapInst.current.off('click', clickHandler.current)
        clickHandler.current = null
      }
      mapInst.current.on('click', clickHandler.current)
    }
  }

  // CTAs elsewhere land here with state { post: true } — open the post modal directly
  useEffect(() => {
    if (!location.state?.post) return
    navigate(location.pathname, { replace: true, state: null })
    openPostModal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const useMyLocation = () => {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        const name = await reverseGeocode(lat, lng)
        const ll = { lat, lng, address: name }
        setPicked(ll)
        mapInst.current?.setView([ll.lat, ll.lng], 15)
        setLocating(false)
      },
      () => setLocating(false),
      { timeout: 8000 }
    )
  }

  const submitPost = (e) => {
    e.preventDefault()
    if (!food.trim() || !qty.trim()) {
      setFormMsg('Please fill food name and quantity.')
      return
    }
    const loc = picked || (userMarker.current ? { lat: userMarker.current.getLatLng().lat, lng: userMarker.current.getLatLng().lng } : null)
    if (!loc) {
      setFormMsg('Set location: tap the map or use "Use my location".')
      return
    }
    addPost({
      food: food.trim(),
      qty: qty.trim(),
      note: note.trim(),
      mins: parseInt(mins, 10) || 60,
      lat: loc.lat,
      lng: loc.lng,
      address: loc.address || `${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`,
      donor: user?.name || 'Me',
      donorEmail: user?.email,
    })
    setFormOpen(false)
    setFood('')
    setQty('')
    setNote('')
    setPicked(null)
  }


  return (
    <div className="flex h-screen flex-col bg-[#f8fafc] text-slate-800">
      {/* header */}
      <SiteHeader />

      {/* body */}
      <div className="relative flex-1 overflow-hidden">
        {/* Floating Map Controls */}
        <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-2xl border border-slate-200/90 bg-white/95 p-1 shadow-md backdrop-blur">
            <button
              onClick={() => setView('map')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                view === 'map' ? 'bg-green-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <MapIcon size={14} /> Map
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                view === 'list' ? 'bg-green-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LayoutList size={14} /> List ({activePosts.length})
            </button>
          </div>
          <button
            onClick={locateUser}
            aria-label="Find my location"
            title="Find my location"
            className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200/90 bg-white/95 text-slate-700 shadow-md backdrop-blur transition hover:border-green-500/50 hover:bg-green-50 hover:text-green-700"
          >
            <Navigation size={15} className={locating ? 'animate-spin text-green-600' : ''} />
          </button>
        </div>

        <div ref={mapRef} className="absolute inset-0 z-0" style={{ display: view === 'map' ? 'block' : 'none' }} />

        {view === 'list' && (
          <div className="nice-scroll absolute inset-0 z-10 overflow-y-auto bg-[#f8fafc] p-4">
            <h2 className="font-display text-lg font-bold text-slate-900">{activePosts.length} {t('map.posts')}</h2>
            <div className="mt-4 space-y-3">
              {activePosts.length === 0 && (
                <p className="text-sm text-slate-500">No active food posts right now. Be the first to share!</p>
              )}
              {activePosts.map((p) => {
                const left = Math.max(0, Math.round((p.expiresAt - Date.now()) / 60000))
                const isClaimed = claimed.includes(p.id)
                return (
                  <div key={p.id} className="card-dark p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-display text-base font-bold text-slate-900">{p.food}</div>
                        <div className="mt-0.5 text-xs font-bold text-green-600">{p.qty} · {left} min left</div>
                        {p.note && <p className="mt-2 text-sm text-slate-600">{p.note}</p>}
                      </div>
                      <div className="flex shrink-0 flex-col gap-2">
                        <button
                          onClick={() => claim(p.id)}
                          disabled={isClaimed}
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${isClaimed ? 'bg-green-100 text-green-800' : 'btn-brand'}`}
                        >
                          {isClaimed ? '✓ ' + t('map.claimed') : t('map.imGoing')}
                        </button>
                      </div>
                    </div>
                    {user && p.donor === user.name && (
                      <button onClick={() => deletePost(p.id)} className="mt-3 flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
                        <Trash2 size={12} /> Mark as picked up / delete
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-8 pb-20">
              <SiteFooter />
            </div>
          </div>
        )}

        {/* share CTA */}
        <div className="absolute inset-x-3 bottom-4 z-[14000]">
          <button
            onClick={openPostModal}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 py-4 font-display text-base font-extrabold text-white shadow-xl shadow-green-600/30 transition hover:brightness-105 active:scale-[0.99] cursor-pointer"
          >
            <Plus size={20} strokeWidth={3} /> {t('map.share')}
          </button>
        </div>

        {/* post form sheet */}
        {formOpen && (
          <div className="absolute inset-x-0 bottom-0 z-[16000] max-h-[80%] overflow-y-auto rounded-t-3xl border-t border-slate-200 bg-white p-5 shadow-2xl nice-scroll">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-slate-900">{t('map.share')}</h3>
              <button
                onClick={() => {
                  setFormOpen(false)
                  setPicked(null)
                  if (mapInst.current && clickHandler.current) {
                    mapInst.current.off('click', clickHandler.current)
                    clickHandler.current = null
                  }
                }}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={submitPost} className="space-y-3">
              <input
                value={food}
                onChange={(e) => setFood(e.target.value)}
                placeholder="Food name (e.g. Veg Biryani)"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  placeholder="Quantity (e.g. 50 plates)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white"
                />
                <select
                  value={mins}
                  onChange={(e) => setMins(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-green-500 focus:bg-white"
                >
                  <option value="30">Available 30 min</option>
                  <option value="60">Available 1 hour</option>
                  <option value="120">Available 2 hours</option>
                  <option value="240">Available 4 hours</option>
                </select>
              </div>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Pickup note (optional)"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white"
              />
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                <Navigation size={15} className="shrink-0 text-green-600" />
                <span className="flex-1 text-slate-600">
                  {picked ? `📍 ${picked.lat.toFixed(5)}, ${picked.lng.toFixed(5)}` : 'Tap the map to set pickup location'}
                </span>
                <button type="button" onClick={useMyLocation} className="shrink-0 font-semibold text-green-600 hover:text-green-700">
                  {locating ? 'Locating…' : 'Use my location'}
                </button>
              </div>
              {formMsg && <p className="text-sm font-medium text-red-500">{formMsg}</p>}
              <button type="submit" className="btn-brand w-full py-3.5 text-sm">
                Post — goes live instantly
              </button>
              <p className="flex items-center justify-center gap-1.5 pb-1 text-center text-xs text-slate-500">
                <Clock size={12} /> Auto-deletes when time is up
              </p>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}

function waText(p) {
  return `🍛 FREE FOOD ALERT!\n${p.qty} of ${p.food}\n📍 ${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}\n⏰ Pickup in ${p.mins} mins\nVia FoodResQ`
}

function escapeHtml(s = '') {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}
