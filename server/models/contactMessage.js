import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
}, { timestamps: true });  // adds createdAt and updatedAt

const contactMessageModel = mongoose.models.contactMessage || mongoose.model("contactMessage", contactMessageSchema);
export default contactMessageModel;