import express from 'express'
import User from '../models/User.js'
import FoodPost from '../models/FoodPost.js'
import RescueHistory from '../models/RescueHistory.js'
import Review from '../models/Review.js'

const router = express.Router()

// Helper to format user payload
const formatUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role || 'donor',
  organization: user.organization || '',
  phone: user.phone || '',
  city: user.city || 'Meerut',
  darpanId: user.darpanId || '',
  capacity: user.capacity || '',
  address: user.address || '',
  verified: user.verified ?? true,
})

// Register new user (donor, individual, or NGO)
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = 'donor',
      organization = '',
      phone = '',
      city = 'Meerut',
      darpanId = '',
      capacity = '',
      address = '',
    } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ ok: false, error: 'Name, email, and password are required.' })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() })
    if (existingUser) {
      return res.status(409).json({ ok: false, error: 'An account with this email already exists. Please login.' })
    }

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      organization: organization.trim(),
      phone: phone.trim(),
      city: city.trim(),
      darpanId: darpanId.trim(),
      capacity: capacity.trim(),
      address: address.trim(),
      verified: true,
    })

    await user.save()

    return res.status(201).json({
      ok: true,
      user: formatUser(user),
    })
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({ ok: false, error: error.message || 'Server error during registration.' })
  }
})

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ ok: false, error: 'Email and password are required.' })
    }

    const normalizedEmail = email.toLowerCase().trim()
    let user = await User.findOne({ email: normalizedEmail })

    // Auto-create demo donor if missing
    if (!user && normalizedEmail === 'donor@foodresq.org') {
      user = await User.create({
        name: 'Rohan Sharma',
        email: 'donor@foodresq.org',
        password: 'password123',
        role: 'donor',
        phone: '+91 98765 43210',
        organization: 'Green Meerut Community',
        city: 'Meerut',
        verified: true,
      })
    }

    // Auto-create demo NGO if missing
    if (!user && normalizedEmail === 'ngo@foodresq.org') {
      user = await User.create({
        name: 'Priya Mehra',
        email: 'ngo@foodresq.org',
        password: 'password123',
        role: 'ngo',
        organization: 'Robin Hood Army Meerut',
        phone: '+91 94123 45678',
        city: 'Meerut',
        darpanId: 'UP/2022/0314892',
        capacity: '250 meals/day',
        address: 'Near Begum Bridge, Meerut',
        verified: true,
      })
    }

    if (!user) {
      return res.status(401).json({ ok: false, error: 'Invalid email or password.' })
    }

    // Support standard password123 and demo alias for donor
    const isPasswordValid =
      user.password === password ||
      (normalizedEmail === 'donor@foodresq.org' && (password === 'foodhero123' || password === 'password123')) ||
      (normalizedEmail === 'ngo@foodresq.org' && password === 'password123')

    if (!isPasswordValid) {
      return res.status(401).json({ ok: false, error: 'Invalid email or password.' })
    }

    return res.json({
      ok: true,
      user: formatUser(user),
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ ok: false, error: error.message || 'Server error during login.' })
  }
})

// 1-Click Demo Donor Login endpoint
router.post('/demo', async (req, res) => {
  try {
    let user = await User.findOne({ email: 'donor@foodresq.org' })
    if (!user) {
      user = await User.create({
        name: 'Rohan Sharma',
        email: 'donor@foodresq.org',
        password: 'password123',
        role: 'donor',
        phone: '+91 98765 43210',
        organization: 'Green Meerut Community',
        city: 'Meerut',
        verified: true,
      })
    }

    return res.json({
      ok: true,
      user: formatUser(user),
    })
  } catch (error) {
    console.error('Demo login error:', error)
    return res.status(500).json({ ok: false, error: error.message })
  }
})

// 1-Click Demo NGO Login endpoint
router.post('/demo-ngo', async (req, res) => {
  try {
    let user = await User.findOne({ email: 'ngo@foodresq.org' })
    if (!user) {
      user = await User.create({
        name: 'Priya Mehra',
        email: 'ngo@foodresq.org',
        password: 'password123',
        role: 'ngo',
        organization: 'Robin Hood Army Meerut',
        phone: '+91 94123 45678',
        city: 'Meerut',
        darpanId: 'UP/2022/0314892',
        capacity: '250 meals/day',
        address: 'Near Begum Bridge, Meerut',
        verified: true,
      })
    } else {
      user.role = 'ngo'
      user.organization = user.organization || 'Robin Hood Army Meerut'
      user.password = 'password123'
      user.verified = true
      await user.save()
    }

    return res.json({
      ok: true,
      user: formatUser(user),
    })
  } catch (error) {
    console.error('Demo NGO login error:', error)
    return res.status(500).json({ ok: false, error: error.message })
  }
})

// Explicit seed demo user and sample listings
router.post('/seed-demo', async (req, res) => {
  try {
    // Seed Donor
    let donor = await User.findOne({ email: 'donor@foodresq.org' })
    if (!donor) {
      donor = await User.create({
        name: 'Rohan Sharma',
        email: 'donor@foodresq.org',
        password: 'password123',
        role: 'donor',
        phone: '+91 98765 43210',
        organization: 'Green Meerut Community',
        city: 'Meerut',
        verified: true,
      })
    } else {
      donor.password = 'password123'
      await donor.save()
    }

    // Seed NGO
    let ngo = await User.findOne({ email: 'ngo@foodresq.org' })
    if (!ngo) {
      ngo = await User.create({
        name: 'Priya Mehra',
        email: 'ngo@foodresq.org',
        password: 'password123',
        role: 'ngo',
        organization: 'Robin Hood Army Meerut',
        phone: '+91 94123 45678',
        city: 'Meerut',
        darpanId: 'UP/2022/0314892',
        capacity: '250 meals/day',
        address: 'Near Begum Bridge, Meerut',
        verified: true,
      })
    } else {
      ngo.password = 'password123'
      ngo.role = 'ngo'
      await ngo.save()
    }

    return res.json({
      ok: true,
      message: 'Demo users (Donor & NGO) seeded successfully in MongoDB.',
      donor: formatUser(donor),
      ngo: formatUser(ngo),
    })
  } catch (error) {
    console.error('Seed demo error:', error)
    return res.status(500).json({ ok: false, error: error.message })
  }
})

// Get active donors and NGOs count
router.get('/donors/count', async (req, res) => {
  try {
    const donors = await User.countDocuments({ role: { $in: ['donor', 'restaurant'] } })
    const ngos = await User.countDocuments({ role: 'ngo' })
    return res.json({ ok: true, donors: Math.max(donors, 2), ngos: Math.max(ngos, 1) })
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message })
  }
})

export default router
