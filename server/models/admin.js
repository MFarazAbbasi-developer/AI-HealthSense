import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  email: { type: String, required: true},
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },


  isAccountVerified: {type: Boolean, default: true},



  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const adminModel = mongoose.models.admin || mongoose.model("admin", adminSchema);
export default adminModel;