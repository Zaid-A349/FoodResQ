import express from 'express'
import Review from '../models/Review.js'

const router = express.Router()

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(50)
    const formatted = reviews.map((r) => ({
      id: r._id.toString(),
      _id: r._id.toString(),
      name: r.name,
      email: r.email,
      rating: r.rating,
      message: r.message,
      role: r.role,
      date: r.date,
    }))
    return res.json({ ok: true, reviews: formatted })
  } catch (error) {
    console.error('Fetch reviews error:', error)
    return res.status(500).json({ ok: false, error: error.message })
  }
})

// Post a review
router.post('/', async (req, res) => {
  try {
    const { name, email = '', rating, message, role = 'Community Member' } = req.body

    if (!name || !rating || !message) {
      return res.status(400).json({ ok: false, error: 'Name, rating, and message are required.' })
    }

    const review = new Review({
      name: name.trim(),
      email: email.trim(),
      rating: Number(rating),
      message: message.trim(),
      role,
    })

    await review.save()

    return res.status(201).json({
      ok: true,
      review: {
        id: review._id.toString(),
        name: review.name,
        email: review.email,
        rating: review.rating,
        message: review.message,
        role: review.role,
        date: review.date,
      },
    })
  } catch (error) {
    console.error('Create review error:', error)
    return res.status(500).json({ ok: false, error: error.message })
  }
})

export default router
