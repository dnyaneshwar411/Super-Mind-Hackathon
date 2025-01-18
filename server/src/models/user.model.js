import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  user_id: {
    type: Number,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    required: true
  },
  profile_photo: {
    type: String
  },
  gender: {
    type: String,
    enum: ["male", "female"]
  },
  password: {
    type: String,
  },
  user_type: {
    type: String,
    enum: ["b2b", "member"],
    default: "member"
  },
  bookings: [{
    type: Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  wallet_balance: {
    type: Number,
    default: 0
  },
  referral_code: {
    type: String,
  },
  refreshToken: {
    type: String
  },
  fcm_token: {
    type: String
  },
  wishlist_doc_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wishlist"
  },
  price_beat_requests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PriceBeatRequest"
    }
  ],
  otp: {
    type: Number
  },
  otpExpiry: {
    type: Number
  }
}, { timestamps: true });

const User = model('User', userSchema);

export default User;
