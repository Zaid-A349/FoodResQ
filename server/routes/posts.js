import express from 'express'
import FoodPost from '../models/FoodPost.js'
import RescueHistory from '../models/RescueHistory.js'

const router = express.Router()

// Get all active, unexpired food posts
router.get('/', async (req, res) => {
  try {
    const now = new Date()
    const posts = await FoodPost.find({
      expiresAt: { $gt: now },
      status: { $ne: 'completed' },
    }).sort({ createdAt: -1 })

    // Normalize IDs for frontend compatibility
    const formatted = posts.map((p) => ({
      id: p._id.toString(),
      _id: p._id.toString(),
      food: p.food,
      qty: p.qty,
      note: p.note,
      address: p.address,
      lat: p.lat,
      lng: p.lng,
      mins: p.mins,
      donor: p.donor,
      donorEmail: p.donorEmail,
      donorPhone: p.donorPhone,
      status: p.status,
      claimedBy: p.claimedBy,
      expiresAt: new Date(p.expiresAt).getTime(),
      createdAt: new Date(p.createdAt).getTime(),
    }))

    return res.json({ ok: true, posts: formatted })
  } catch (error) {
    console.error('Fetch posts error:', error)
    return res.status(500).json({ ok: false, error: error.message })
  }
})

// Create a new surplus food post
router.post('/', async (req, res) => {
  try {
    const { food, qty, note = '', address, lat, lng, mins = 60, donor, donorEmail = '', donorPhone = '' } = req.body

    if (!food || !qty || !address || lat === undefined || lng === undefined || !donor) {
      return res.status(400).json({ ok: false, error: 'Please provide food, quantity, address, coordinates, and donor name.' })
    }

    const durationMins = Number(mins) || 60
    const expiresAt = new Date(Date.now() + durationMins * 60000)

    const post = new FoodPost({
      food,
      qty,
      note,
      address,
      lat: Number(lat),
      lng: Number(lng),
      mins: durationMins,
      donor,
      donorEmail,
      donorPhone,
      status: 'available',
      expiresAt,
    })

    await post.save()

    const formatted = {
      id: post._id.toString(),
      _id: post._id.toString(),
      food: post.food,
      qty: post.qty,
      note: post.note,
      address: post.address,
      lat: post.lat,
      lng: post.lng,
      mins: post.mins,
      donor: post.donor,
      donorEmail: post.donorEmail,
      donorPhone: post.donorPhone,
      status: post.status,
      claimedBy: post.claimedBy,
      expiresAt: new Date(post.expiresAt).getTime(),
      createdAt: new Date(post.createdAt).getTime(),
    }

    return res.status(201).json({ ok: true, post: formatted })
  } catch (error) {
    console.error('Create post error:', error)
    return res.status(500).json({ ok: false, error: error.message })
  }
})

// Claim a food post (Seeker is en route)
router.post('/:id/claim', async (req, res) => {
  try {
    const { id } = req.params
    const { seekerName = 'Community Seeker', seekerEmail = '', seekerPhone = '' } = req.body

    const post = await FoodPost.findById(id)
    if (!post) {
      return res.status(404).json({ ok: false, error: 'Food post not found.' })
    }

    post.status = 'claimed'
    post.claimedBy.push({
      name: seekerName,
      email: seekerEmail,
      phone: seekerPhone,
      claimedAt: new Date(),
    })

    await post.save()

    return res.json({ ok: true, post: { ...post.toObject(), id: post._id.toString() } })
  } catch (error) {
    console.error('Claim post error:', error)
    return res.status(500).json({ ok: false, error: error.message })
  }
})

// Complete handover and archive to RescueHistory
router.post('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params
    const { notes = 'Handed over successfully' } = req.body

    const post = await FoodPost.findById(id)
    if (!post) {
      return res.status(404).json({ ok: false, error: 'Food post not found.' })
    }

    // Create history entry
    const historyItem = new RescueHistory({
      postId: post._id.toString(),
      food: post.food,
      qty: post.qty,
      mins: post.mins,
      donor: post.donor,
      donorEmail: post.donorEmail,
      recipient: post.claimedBy.length > 0 ? post.claimedBy[post.claimedBy.length - 1].name : 'Community Seeker',
      address: post.address,
      completedAt: new Date(),
      status: 'completed',
      completionNotes: notes,
    })

    await historyItem.save()

    // Mark post as completed or delete from active feed
    await FoodPost.findByIdAndDelete(id)

    return res.json({
      ok: true,
      message: 'Meal marked as handed over and saved to rescue history.',
      historyItem: {
        id: historyItem._id.toString(),
        ...historyItem.toObject(),
      },
    })
  } catch (error) {
    console.error('Complete post error:', error)
    return res.status(500).json({ ok: false, error: error.message })
  }
})

// Delete a food post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    await FoodPost.findByIdAndDelete(id)
    return res.json({ ok: true, message: 'Post deleted successfully.' })
  } catch (error) {
    console.error('Delete post error:', error)
    return res.status(500).json({ ok: false, error: error.message })
  }
})

export default router
