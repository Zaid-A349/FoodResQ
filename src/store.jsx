import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { api } from './api.js'

const AppContext = createContext(null)

const SEED_POSTS = [
  { id: 'mrt1', food: 'Chole Bhature + Raj Kachori', qty: '35 plates', note: 'Evening counter surplus, freshly packed.', lat: 28.9899, lng: 77.6851, mins: 90, createdAt: Date.now() - 12 * 60000, donor: 'Bikanervala, Delhi Road' },
  { id: 'mrt2', food: 'Red Sauce Pasta + Garlic Bread', qty: '20 boxes', note: 'Cafe closing surplus. Pickup at main entrance.', lat: 28.9951, lng: 77.691, mins: 60, createdAt: Date.now() - 15 * 60000, donor: "Anaicha's, West End Road" },
  { id: 'mrt3', food: 'Dal Makhani, Paneer Tikka + Roti', qty: '60 meals', note: 'Wedding buffet surplus, hot & packed.', lat: 29.0155, lng: 77.6645, mins: 120, createdAt: Date.now() - 6 * 60000, donor: 'The Grand 5, Delhi Road' },
  { id: 'mrt4', food: 'Veg Thali (Dal, Rice, Sabzi, Roti)', qty: '80 meals', note: 'Banquet function leftover, untouched.', lat: 28.996, lng: 77.673, mins: 100, createdAt: Date.now() - 20 * 60000, donor: 'Hotel Meriton, Garh Road' },
]

const SEED_REVIEWS = [
  { id: 'r1', name: 'Premkumar', rating: 5, message: 'Saved over 30 kg of banquet food from going to waste yesterday! Seamless pickup.', date: '10 Sept 2026' },
  { id: 'r2', name: 'Mohan Verma', rating: 5, message: 'Real-time surplus food rescue infrastructure for cities. Meerut urgently needed this.', date: '2 Mar 2026' },
]

const SEED_HISTORY = [
  {
    id: 'h1',
    food: 'Paneer Butter Masala + 40 Rotis',
    qty: '40 plates',
    mins: 90,
    donor: 'Rohan Sharma',
    donorEmail: 'donor@foodresq.org',
    address: 'Near Delhi Road, Meerut',
    completedAt: Date.now() - 2 * 86400000,
    recipient: 'Local Community Shelter',
    status: 'completed',
  },
  {
    id: 'h2',
    food: 'Veg Pulao + Mix Veg Curry',
    qty: '25 boxes',
    mins: 60,
    donor: 'Rohan Sharma',
    donorEmail: 'donor@foodresq.org',
    address: 'Near West End Road, Meerut',
    completedAt: Date.now() - 5 * 86400000,
    recipient: 'Night Shift Volunteers',
    status: 'completed',
  },
]

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function expiresAt(post) {
  return post.createdAt + (post.mins || 60) * 60000
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => load('frm_user', null))
  const [posts, setPosts] = useState(() => {
    const existing = load('frm_posts', null)
    if (existing) return existing
    const seeded = SEED_POSTS.map((p) => ({ ...p, expiresAt: expiresAt(p) }))
    localStorage.setItem('frm_posts', JSON.stringify(seeded))
    return seeded
  })
  const [reviews, setReviews] = useState(() => load('frm_reviews', SEED_REVIEWS))
  const [claimed, setClaimed] = useState(() => load('frm_claimed', []))
  const [history, setHistory] = useState(() => load('frm_history', SEED_HISTORY))
  const [stats, setStats] = useState({ mealsRescued: 11, activeDonors: 2, citiesReached: 1 })
  const [isDbConnected, setIsDbConnected] = useState(false)

  // Sync with MongoDB backend on initial mount
  useEffect(() => {
    let mounted = true
    async function syncWithBackend() {
      try {
        const [serverPosts, serverHistory, serverReviews, serverStats] = await Promise.all([
          api.getPosts(),
          api.getHistory(),
          api.getReviews(),
          api.getStats(),
        ])

        if (!mounted) return

        if (serverPosts && Array.isArray(serverPosts) && serverPosts.length > 0) {
          setPosts(serverPosts)
          setIsDbConnected(true)
        }
        if (serverHistory && Array.isArray(serverHistory)) {
          setHistory(serverHistory)
        }
        if (serverReviews && Array.isArray(serverReviews) && serverReviews.length > 0) {
          setReviews(serverReviews)
        }
        if (serverStats) {
          setStats(serverStats)
        }
      } catch (err) {
        console.warn('Initial DB sync notice:', err.message)
      }
    }

    syncWithBackend()
    return () => {
      mounted = false
    }
  }, [])

  // Local storage persistence fallbacks
  useEffect(() => localStorage.setItem('frm_posts', JSON.stringify(posts)), [posts])
  useEffect(() => localStorage.setItem('frm_reviews', JSON.stringify(reviews)), [reviews])
  useEffect(() => localStorage.setItem('frm_claimed', JSON.stringify(claimed)), [claimed])
  useEffect(() => localStorage.setItem('frm_history', JSON.stringify(history)), [history])
  useEffect(() => {
    if (user) localStorage.setItem('frm_user', JSON.stringify(user))
    else localStorage.removeItem('frm_user')
  }, [user])

  // Auto-expire posts in memory
  const activePosts = useMemo(() => posts.filter((p) => p.expiresAt > Date.now()), [posts])

  useEffect(() => {
    const t = setInterval(() => {
      setPosts((prev) => {
        const alive = prev.filter((p) => p.expiresAt > Date.now())
        return alive.length === prev.length ? prev : alive
      })
    }, 30000)
    return () => clearInterval(t)
  }, [])

  const addPost = useCallback(async (post) => {
    const tempId = 'p' + Date.now()
    const full = {
      ...post,
      id: tempId,
      createdAt: Date.now(),
      expiresAt: Date.now() + (post.mins || 60) * 60000,
    }
    setPosts((prev) => [full, ...prev])

    // Persist to MongoDB
    const saved = await api.createPost(post)
    if (saved && saved.id) {
      setPosts((prev) => prev.map((p) => (p.id === tempId ? { ...saved } : p)))
      return saved
    }
    return full
  }, [])

  const deletePost = useCallback(async (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id))
    await api.deletePost(id)
  }, [])

  const claim = useCallback(async (id, seekerInfo) => {
    setClaimed((prev) => (prev.includes(id) ? prev : [...prev, id]))
    await api.claimPost(id, seekerInfo)
  }, [])

  const markCompleted = useCallback(async (id, notes = '') => {
    setPosts((prev) => {
      const found = prev.find((p) => p.id === id)
      if (found) {
        setHistory((h) => [{ ...found, completedAt: Date.now(), status: 'completed', completionNotes: notes }, ...h])
      }
      return prev.filter((p) => p.id !== id)
    })
    setClaimed((c) => c.filter((cid) => cid !== id))
    await api.completePost(id, notes)
  }, [])

  const register = useCallback(async (name, email, password, extra = {}) => {
    const res = await api.register(name, email, password, extra)
    if (res) {
      if (res.ok && res.user) {
        setUser(res.user)
        return { ok: true, user: res.user }
      }
      return { ok: false, error: res.error || 'Registration failed' }
    }

    // LocalStorage fallback
    const users = load('frm_users', [])
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'Account already exists. Please login.' }
    }
    const u = { name, email, password, role: extra.role || 'donor', ...extra }
    localStorage.setItem('frm_users', JSON.stringify([...users, u]))
    setUser(u)
    return { ok: true, user: u }
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await api.login(email, password)
    if (res) {
      if (res.ok && res.user) {
        setUser(res.user)
        return { ok: true, user: res.user }
      }
      return { ok: false, error: res.error || 'Invalid email or password.' }
    }

    // LocalStorage fallback
    const users = load('frm_users', [])
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (!found) return { ok: false, error: 'Invalid email or password.' }
    setUser(found)
    return { ok: true, user: found }
  }, [])

  const loginDemo = useCallback(async () => {
    // 1. Try server demo login directly on MongoDB
    const res = await api.loginDemo()
    if (res && res.ok && res.user) {
      setUser(res.user)
      setIsDbConnected(true)
      return { ok: true, user: res.user }
    }
    // 2. Try regular login with demo credentials
    const loginRes = await login('donor@foodresq.org', 'password123')
    if (loginRes && loginRes.ok) {
      return loginRes
    }
    // 3. Fallback: local session
    const demoUser = { name: 'Rohan Sharma', email: 'donor@foodresq.org', role: 'donor' }
    setUser(demoUser)
    return { ok: true, user: demoUser }
  }, [login])

  const loginDemoNgo = useCallback(async () => {
    // 1. Try server demo NGO login directly on MongoDB
    const res = await api.loginDemoNgo()
    if (res && res.ok && res.user) {
      setUser(res.user)
      setIsDbConnected(true)
      return { ok: true, user: res.user }
    }
    // 2. Try regular login with demo credentials
    const loginRes = await login('ngo@foodresq.org', 'password123')
    if (loginRes && loginRes.ok) {
      return loginRes
    }
    // 3. Fallback: local session
    const demoNgo = {
      name: 'Priya Mehra',
      email: 'ngo@foodresq.org',
      role: 'ngo',
      organization: 'Robin Hood Army Meerut',
      phone: '+91 94123 45678',
      city: 'Meerut',
      darpanId: 'UP/2022/0314892',
      capacity: '250 meals/day',
      verified: true,
    }
    setUser(demoNgo)
    return { ok: true, user: demoNgo }
  }, [login])

  const logout = useCallback(() => setUser(null), [])

  const addReview = useCallback(async (review) => {
    const full = {
      ...review,
      id: 'r' + Date.now(),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    }
    setReviews((prev) => [full, ...prev])
    const saved = await api.createReview(review)
    if (saved && saved.id) {
      setReviews((prev) => prev.map((r) => (r.id === full.id ? saved : r)))
    }
  }, [])

  const [postModalOpen, setPostModalOpen] = useState(false)
  const openPostModal = useCallback(() => setPostModalOpen(true), [])
  const closePostModal = useCallback(() => setPostModalOpen(false), [])

  const value = {
    user, posts, activePosts, reviews, claimed, history, stats, isDbConnected,
    addPost, deletePost, claim, markCompleted, register, login, loginDemo, loginDemoNgo, logout, addReview,
    postModalOpen, openPostModal, closePostModal,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
