// API helper for communicating with MongoDB backend
const BASE_URL = '' // Uses Vite proxy in development, or relative in production

export const api = {
  // Posts
  async getPosts() {
    try {
      const res = await fetch(`${BASE_URL}/api/posts`)
      if (!res.ok) throw new Error('Failed to fetch posts')
      const data = await res.json()
      return data.posts || []
    } catch (err) {
      console.warn('[FoodResQ API] Using fallback/local posts:', err.message)
      return null
    }
  },

  async createPost(post) {
    try {
      const res = await fetch(`${BASE_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed to create post')
      return data.post
    } catch (err) {
      console.warn('[FoodResQ API] Error creating post on server:', err.message)
      return null
    }
  },

  async claimPost(id, seekerInfo = {}) {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${id}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seekerInfo),
      })
      const data = await res.json()
      return data.ok ? data.post : null
    } catch (err) {
      console.warn('[FoodResQ API] Error claiming post on server:', err.message)
      return null
    }
  },

  async completePost(id, notes = '') {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })
      const data = await res.json()
      return data.ok ? data.historyItem : null
    } catch (err) {
      console.warn('[FoodResQ API] Error completing post on server:', err.message)
      return null
    }
  },

  async deletePost(id) {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      return data.ok
    } catch (err) {
      console.warn('[FoodResQ API] Error deleting post on server:', err.message)
      return false
    }
  },

  // Rescue History
  async getHistory(donorEmail) {
    try {
      const q = donorEmail ? `?donorEmail=${encodeURIComponent(donorEmail)}` : ''
      const res = await fetch(`${BASE_URL}/api/history${q}`)
      if (!res.ok) throw new Error('Failed to fetch history')
      const data = await res.json()
      return data.history || []
    } catch (err) {
      console.warn('[FoodResQ API] Using fallback history:', err.message)
      return null
    }
  },

  // Auth
  async register(name, email, password, extra = {}) {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, ...extra }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        return { ok: false, error: data.error || 'Registration failed' }
      }
      return { ok: true, user: data.user }
    } catch (err) {
      console.warn('[FoodResQ API] Backend unavailable for registration:', err.message)
      return null
    }
  },

  async login(email, password) {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        return { ok: false, error: data.error || 'Login failed' }
      }
      return { ok: true, user: data.user }
    } catch (err) {
      console.warn('[FoodResQ API] Backend unavailable for login:', err.message)
      return null
    }
  },

  async loginDemo() {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        return { ok: true, user: data.user }
      }
    } catch (err) {
      console.warn('[FoodResQ API] Backend demo login fallback:', err.message)
    }
    return null
  },

  async loginDemoNgo() {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/demo-ngo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        return { ok: true, user: data.user }
      }
    } catch (err) {
      console.warn('[FoodResQ API] Backend demo NGO login fallback:', err.message)
    }
    return null
  },

  async seedDemo() {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/seed-demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      return await res.json()
    } catch (err) {
      console.warn('[FoodResQ API] Seed demo error:', err.message)
      return null
    }
  },

  // Platform Stats
  async getStats() {
    try {
      const res = await fetch(`${BASE_URL}/api/stats`)
      if (!res.ok) throw new Error('Failed to fetch stats')
      const data = await res.json()
      return data.stats
    } catch (err) {
      console.warn('[FoodResQ API] Using default stats:', err.message)
      return null
    }
  },

  // Reviews / Feedback
  async getReviews() {
    try {
      const res = await fetch(`${BASE_URL}/api/reviews`)
      if (!res.ok) throw new Error('Failed to fetch reviews')
      const data = await res.json()
      return data.reviews || []
    } catch (err) {
      console.warn('[FoodResQ API] Using default reviews:', err.message)
      return null
    }
  },

  async createReview(review) {
    try {
      const res = await fetch(`${BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      })
      const data = await res.json()
      return data.ok ? data.review : null
    } catch (err) {
      console.warn('[FoodResQ API] Error submitting review:', err.message)
      return null
    }
  },
}
