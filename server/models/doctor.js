import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  email: { type: String, required: true},
  phone: { type: String, required: true},
  nicNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["doctor"], default: "doctor" },
  specialization: { type: String, required: true },
  experienceYears: { type: Number, required: true, default: 0 },
  clinicAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  description: { type: String, required: true },
  availability: {
    days: [{ type: String, required: true }],
    timeSlots: [
      {
        start: { type: String, required: true },
        end: { type: String, required: true },
      },
    ],
  },
  available: { type: Boolean, default: true },
  consultationFee: {
    currency: { type: String, default: "PKR" },
    amount: { type: Number, required: true },
  },
  rating: { type: Number, default: 0 },
  reviews: [
    {
      patientId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      comment: String,
      rating: Number,
      date: { type: Date, default: Date.now },
    },
  ],
  languages: [{ type: String, required: true }],
  educationBackground: [
    {
      degree: String,
      institution: String,
      yearCompleted: Number,
    },
  ],
  certifications: [
    {
      title: String,
      issuingOrganization: String,
      yearIssued: Number,
    },
  ],
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  doctorImageUrl: { type: String, required: true },
  servicesOffered: [{ type: String, required: true }],
  tags: [{ type: String }],
  socialMediaLinks: {
    facebook: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
  },

  // **Security & Account Management**
  verifyOtp: {type: String, default: ''},
  verifyOtpExpireAt: {type: Number, default: 0},
  isAccountVerified: {type: Boolean, default: false},
  resetOtp: {type: String, default: ''},
  resetOtpExpireAt: {type: Number, default: 0},

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const doctorModel =
  mongoose.models.doctor || mongoose.model("doctor", doctorSchema);

export default doctorModel;
