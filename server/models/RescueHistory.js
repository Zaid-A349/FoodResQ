import mongoose from 'mongoose'

const rescueHistorySchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      default: '',
    },
    food: {
      type: String,
      required: true,
      trim: true,
    },
    qty: {
      type: String,
      required: true,
      trim: true,
    },
    mins: {
      type: Number,
      default: 60,
    },
    donor: {
      type: String,
      required: true,
      trim: true,
    },
    donorEmail: {
      type: String,
      default: '',
      lowercase: true,
      trim: true,
    },
    recipient: {
      type: String,
      default: 'Community Seeker',
    },
    address: {
      type: String,
      default: '',
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: 'completed',
    },
    completionNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('RescueHistory', rescueHistorySchema)
