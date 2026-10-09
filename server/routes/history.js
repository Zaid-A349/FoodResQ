import express from 'express'
import RescueHistory from '../models/RescueHistory.js'

const router = express.Router()

// Get rescue history
router.get('/', async (req, res) => {
  try {
    const { donorEmail, donor } = req.query
    const filter = {}

    if (donorEmail) filter.donorEmail = donorEmail.toLowerCase().trim()
    else if (donor) filter.donor = new RegExp(donor, 'i')

    const items = await RescueHistory.find(filter).sort({ completedAt: -1 }).limit(100)

    const formatted = items.map((item) => ({
      id: item._id.toString(),
      _id: item._id.toString(),
      food: item.food,
      qty: item.qty,
      mins: item.mins,
      donor: item.donor,
      donorEmail: item.donorEmail,
      recipient: item.recipient,
      address: item.address,
      status: item.status,
      completedAt: new Date(item.completedAt).getTime(),
      completionNotes: item.completionNotes,
    }))

    return res.json({ ok: true, history: formatted })
  } catch (error) {
    console.error('Fetch history error:', error)
    return res.status(500).json({ ok: false, error: error.message })
  }
})

export default router
