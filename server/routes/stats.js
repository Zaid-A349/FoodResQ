import express from 'express'
import FoodPost from '../models/FoodPost.js'
import RescueHistory from '../models/RescueHistory.js'
import User from '../models/User.js'

const router = express.Router()

// Get platform impact stats
router.get('/', async (req, res) => {
  try {
    const rescuedCount = await RescueHistory.countDocuments()
    const activeDonorsFromUsers = await User.countDocuments({ role: { $in: ['donor', 'restaurant'] } })
    const activeDonorsFromPosts = await FoodPost.distinct('donor')
    const activeDonors = Math.max(2, activeDonorsFromUsers, activeDonorsFromPosts.length)
    const mealsRescued = Math.max(11, 11 + rescuedCount)

    return res.json({
      ok: true,
      stats: {
        mealsRescued,
        activeDonors,
        citiesReached: 1,
        city: 'Meerut',
        note: 'Currently in startup phase in Meerut, actively onboarding local food partners and expanding rapidly.',
      },
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      stats: {
        mealsRescued: 11,
        activeDonors: 2,
        citiesReached: 1,
      },
      error: error.message,
    })
  }
})

export default router
