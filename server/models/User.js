import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 4,
    },
    role: {
      type: String,
      enum: ['donor', 'taker', 'volunteer', 'restaurant', 'ngo'],
      default: 'donor',
    },
    phone: {
      type: String,
      default: '',
    },
    organization: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: 'Meerut',
    },
    darpanId: {
      type: String,
      default: '',
    },
    capacity: {
      type: String,
      default: '',
    },
    verified: {
      type: Boolean,
      default: true,
    },
    address: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('User', userSchema)
