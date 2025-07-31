import { v2 as cloudinary } from "cloudinary";
// import fs from 'fs';
// import path from 'path';
import doctorModel from "../models/doctor.js";
import adminModel from "../models/admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import contactMessageModel from "../models/contactMessage.js";

// API for adding Doctor

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      specialization,
      clinicAddress,
      consultationFee,
      education,
      description,
    } = req.body;
    const imageFile = req.file;

    if (
      !name ||
      !specialization ||
      !clinicAddress ||
      !consultationFee ||
      !education ||
      !description
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      // name: JSON.parse(name),
      name,
      doctorImageUrl: imageUrl,
      specialization,
      clinicAddress: JSON.parse(clinicAddress),
      consultationFee: JSON.parse(consultationFee),
      education,
      description,
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel
      .find({})
      .populate("reviews.patientId", "name"); // .selesct('-password')
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    console.log(req.body);
    console.log("first");
    const { comment, rating, docId, patientId } = req.body;
    // const {docId} = req.params;

    if (!comment || !rating) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const doctor = await doctorModel.findById(docId);
    console.log(doctor);
    if (doctor) {
      doctor.reviews.push({ patientId, comment, rating });
      // Calculate the new average rating
      const totalRatings = doctor.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      doctor.rating = totalRatings / doctor.reviews.length;

      await doctor.save();

      res.json({ success: true, message: "Review added" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//  For updating doctor images
import mongoose from "mongoose";
const updateDoctorImageUrls = async (req, res) => {
  try {
    const doctors = await doctorModel.find();

    let maleCount = 1;
    let femaleCount = 1;

    for (const doctor of doctors) {
      const gender = doctor.gender?.toLowerCase();

      // 👇 convert patientId strings to ObjectId
      doctor.reviews = doctor.reviews.map((review) => ({
        ...review,
        patientId: new mongoose.Types.ObjectId(review.patientId),
      }));
      if (!["male", "female"].includes(gender)) continue;

      const paddedIndex =
        gender === "male"
          ? String(maleCount++).padStart(2, "0")
          : String(femaleCount++).padStart(2, "0");

      const imageUrl = `https://res.cloudinary.com/dwb9intbs/image/upload/v1751299476/ai_healthsense_doctors/${gender}_doc_${paddedIndex}.jpg`;
      // https://res.cloudinary.com/dwb9intbs/image/upload/v1751299476/ai_healthsense_doctors/female_doc_22.jpg

      doctor.doctorImageUrl = imageUrl;
      await doctor.save();
    }

    res.status(200).json({ message: "Doctor images updated successfully" });
  } catch (error) {
    console.error("❌ Error updating images:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const addPreHashedPasswordToDoctors = async () => {
  try {
    // Password is 2 (hashed)
    const preHashedPassword =
      "$2a$10$pfYsD/qQNpyNQb/zKGejde.URFeKr5oOv4cJOLBdXrXPK7sOLxCkO"; // Hashed value

    // Update all doctors with the pre-hashed password
    // const result = await doctorModel.updateMany(
    //   // { password: { $exists: false } }, // Only update those without a password
    //   {}, // All update
    //   { $set: { password: preHashedPassword } }
    // );

    // add security fields to all doctor
    const result = await doctorModel.updateMany(
      {}, // Match all doctors
      {
        $set: {
          verifyOtp: "",
          verifyOtpExpireAt: 0,
          isAccountVerified: false,
          resetOtp: "",
          resetOtpExpireAt: 0,
        },
      }
    );

    // console.log(`Updated ${result.modifiedCount} doctors with hashed password.`);
    console.log(
      `Updated ${result.modifiedCount} doctors with security fields.`
    );
  } catch (err) {
    console.error("Error updating doctors:", err);
  }
};

// Update Doctor Profile Information
const updateDoctorProfile = async (req, res) => {
  try {
    const { userId, role, ...updates } = req.body;

    if (role !== "doctor") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Not a doctor." });
    }

    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    );

    if (!updatedDoctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found." });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Valid Email and Password are required",
    });
  }

  try {
    let user = await adminModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: user._id, email: email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete Doctor
const deleteDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;

    const doctor = await doctorModel.findByIdAndDelete(doctorId);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    console.error("Delete Doctor Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting doctor",
    });
  }
};

// Delete Review
const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const doctor = await doctorModel.findOne({ "reviews._id": reviewId });
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    // Step 2: Remove the review
    doctor.reviews = doctor.reviews.filter(
      (review) => review._id.toString() !== reviewId
    );

    // Step 3: Recalculate average rating
    if (doctor.reviews.length > 0) {
      const total = doctor.reviews.reduce((sum, r) => sum + r.rating, 0);
      doctor.rating = total / doctor.reviews.length;
    } else {
      doctor.rating = 0;
    }

    // Step 4: Save doctor
    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting review",
    });
  }
};

import transpoter from "../config/nodemailer.js";
const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.json({
      success: false,
      message: "All fields are required.",
    });
  }

  try {
    const newMessage = new contactMessageModel({ name, email, message });
    await newMessage.save();

    // Sending Welcome Email
    const mailOptions = {
      from: `"AI HealthSense" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "We received your message!",
      html: `
        <p>Dear <strong>${name}</strong>,</p>
        <p>Thank you for contacting us. We’ve received your message and will respond as soon as possible.</p>
        <p><em>Your message:</em></p>
        <blockquote>${message}</blockquote>
        <p>Regards,<br/>AI HealthSense Team</p>
      `
    };

    await transpoter.sendMail(mailOptions);

    return res.json({ success: true });
  } catch (error) {
    console.error("Error saving message:", error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addDoctor,
  allDoctors,
  addReview,
  updateDoctorImageUrls,
  addPreHashedPasswordToDoctors,
  updateDoctorProfile,
  adminLogin,
  deleteDoctor,
  deleteReview,
  sendMessage,
};
