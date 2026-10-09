import mongoose from 'mongoose'

const foodPostSchema = new mongoose.Schema(
  {
    food: {
      type: String,
      required: [true, 'Food description is required'],
      trim: true,
    },
    qty: {
      type: String,
      required: [true, 'Quantity is required'],
      trim: true,
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    lat: {
      type: Number,
      required: [true, 'Latitude is required'],
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required'],
    },
    mins: {
      type: Number,
      default: 60,
    },
    donor: {
      type: String,
      required: [true, 'Donor name is required'],
      trim: true,
    },
    donorEmail: {
      type: String,
      default: '',
      lowercase: true,
      trim: true,
    },
    donorPhone: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['available', 'claimed', 'completed', 'expired'],
      default: 'available',
      index: true,
    },
    claimedBy: [
      {
        name: { type: String, default: 'Community Seeker' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        claimedAt: { type: Date, default: Date.now },
      },
    ],
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('FoodPost', foodPostSchema)
