import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  email: { type: String, unique: true, required: true },
  phone: { type: String, unique: true, required: true },
  nicNumber: { type: String, unique: true, required: true }, 
  password: { type: String, required: true },
  role: { type: String, enum: ["patient"], default: "patient" }, 

  // **Security & Account Management**
  verifyOtp: {type: String, default: ''},
  verifyOtpExpireAt: {type: Number, default: 0},
  isAccountVerified: {type: Boolean, default: false},
  resetOtp: {type: String, default: ''},
  resetOtpExpireAt: {type: Number, default: 0},


  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;