import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodresq'

export async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI)
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`)
    return conn
  } catch (error) {
    console.error(`[MongoDB] Connection error:`, error.message)
    // Don't kill process immediately so server can still serve or retry
    return null
  }
}
