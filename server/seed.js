import FoodPost from './models/FoodPost.js'
import User from './models/User.js'
import RescueHistory from './models/RescueHistory.js'
import Review from './models/Review.js'

export async function seedInitialData() {
  try {
    const postCount = await FoodPost.countDocuments()
    if (postCount === 0) {
      console.log('[MongoDB Seed] Seeding initial surplus food posts in Meerut...')
      const now = Date.now()
      const initialPosts = [
        {
          food: 'Chole Bhature + Raj Kachori',
          qty: '35 plates',
          note: 'Evening counter surplus, freshly packed.',
          address: 'Bikanervala, Delhi Road, Meerut',
          lat: 28.9899,
          lng: 77.6851,
          mins: 90,
          donor: 'Bikanervala, Delhi Road',
          donorEmail: 'bikanervala.mrt@gmail.com',
          status: 'available',
          expiresAt: new Date(now + 90 * 60000),
          createdAt: new Date(now - 12 * 60000),
        },
        {
          food: 'Red Sauce Pasta + Garlic Bread',
          qty: '20 boxes',
          note: 'Cafe closing surplus. Pickup at main entrance.',
          address: "Anaicha's, West End Road, Meerut",
          lat: 28.9951,
          lng: 77.691,
          mins: 60,
          donor: "Anaicha's, West End Road",
          donorEmail: 'anaichas.cafe@gmail.com',
          status: 'available',
          expiresAt: new Date(now + 60 * 60000),
          createdAt: new Date(now - 15 * 60000),
        },
        {
          food: 'Dal Makhani, Paneer Tikka + Roti',
          qty: '60 meals',
          note: 'Wedding banquet surplus, hot & packed in trays.',
          address: 'The Grand 5, Delhi Road, Meerut',
          lat: 29.0155,
          lng: 77.6645,
          mins: 120,
          donor: 'The Grand 5, Delhi Road',
          donorEmail: 'grand5.events@gmail.com',
          status: 'available',
          expiresAt: new Date(now + 120 * 60000),
          createdAt: new Date(now - 6 * 60000),
        },
        {
          food: 'Veg Thali (Dal, Rice, Sabzi, Roti)',
          qty: '80 meals',
          note: 'Banquet function leftover, untouched.',
          address: 'Hotel Meriton, Garh Road, Meerut',
          lat: 28.996,
          lng: 77.673,
          mins: 100,
          donor: 'Hotel Meriton, Garh Road',
          donorEmail: 'meriton.banquets@gmail.com',
          status: 'available',
          expiresAt: new Date(now + 100 * 60000),
          createdAt: new Date(now - 20 * 60000),
        },
      ]
      await FoodPost.insertMany(initialPosts)
      console.log('[MongoDB Seed] Active food posts seeded.')
    }

    const donorExists = await User.findOne({ email: 'donor@foodresq.org' })
    if (!donorExists) {
      console.log('[MongoDB Seed] Seeding demo donor account...')
      await User.create({
        name: 'Rohan Sharma',
        email: 'donor@foodresq.org',
        password: 'password123',
        role: 'donor',
        phone: '+91 98765 43210',
        organization: 'Green Meerut Community',
        city: 'Meerut',
        verified: true,
      })
      console.log('[MongoDB Seed] Demo donor created: donor@foodresq.org / password123')
    }

    const ngoExists = await User.findOne({ email: 'ngo@foodresq.org' })
    if (!ngoExists) {
      console.log('[MongoDB Seed] Seeding demo NGO account...')
      await User.create({
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
      console.log('[MongoDB Seed] Demo NGO created: ngo@foodresq.org / password123')
    }

    const historyCount = await RescueHistory.countDocuments()
    if (historyCount === 0) {
      console.log('[MongoDB Seed] Seeding past rescue history...')
      await RescueHistory.insertMany([
        {
          food: 'Paneer Butter Masala + 40 Rotis',
          qty: '40 plates',
          mins: 90,
          donor: 'Rohan Sharma',
          donorEmail: 'donor@foodresq.org',
          recipient: 'Local Community Shelter',
          address: 'Near Delhi Road, Meerut',
          completedAt: new Date(Date.now() - 2 * 86400000),
          status: 'completed',
          completionNotes: 'Handed over directly to shelter representative',
        },
        {
          food: 'Veg Pulao + Mix Veg Curry',
          qty: '25 boxes',
          mins: 60,
          donor: 'Rohan Sharma',
          donorEmail: 'donor@foodresq.org',
          recipient: 'Night Shift Volunteers',
          address: 'Near West End Road, Meerut',
          completedAt: new Date(Date.now() - 5 * 86400000),
          status: 'completed',
          completionNotes: 'Cleanly distributed',
        },
      ])
      console.log('[MongoDB Seed] Rescue history seeded.')
    }

    const reviewCount = await Review.countDocuments()
    if (reviewCount === 0) {
      console.log('[MongoDB Seed] Seeding initial reviews...')
      await Review.insertMany([
        {
          name: 'Premkumar',
          rating: 5,
          message: 'Saved over 30 kg of banquet food from going to waste yesterday! Seamless pickup.',
          role: 'Catering Manager',
        },
        {
          name: 'Mohan Verma',
          rating: 5,
          message: 'Real-time surplus food rescue infrastructure for cities. Meerut urgently needed this.',
          role: 'Community Volunteer',
        },
      ])
      console.log('[MongoDB Seed] Reviews seeded.')
    }
  } catch (error) {
    console.error('[MongoDB Seed] Seed error (non-fatal):', error.message)
  }
}
