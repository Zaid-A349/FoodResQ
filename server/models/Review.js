import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      default: '',
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: 'Community Member',
    },
    photo: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      default: () =>
        new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Review', reviewSchema)
