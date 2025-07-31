import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.js";
import doctorModel from "../models/doctor.js";
import transpoter from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/emailTemplate.js";

export const register = async (req, res) => {
  if (
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.email ||
    !req.body.phone ||
    !req.body.nicNumber ||
    !req.body.password 
  ) {
    return res.json({ success: false, message: "Missing Information" });
  }
  const { firstName, lastName, email, phone, nicNumber, password } = req.body;

  try {
    let existingUser;
    // if (role === 'patient') {
      existingUser = await userModel.findOne({
        $or: [{ email }, { phone }, { nicNumber }],
      });
    // }
    // else if (role === 'doctor') {
    //   existingUser = await doctorModel.findOne({
    //     $or: [{ email }, { phone }, { nicNumber }],
    //   });
    // }

    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    let user;
    // if (role === 'patient') {
      user = await userModel.create({
        name: {
          firstName,
          lastName
        },
        email,
        phone,
        nicNumber,
        password: hashedPassword,
      });
    // }
    // else if (role === 'doctor') {
    //   user = await doctorModel.create({
    //     name: {
    //       firstName,
    //       lastName
    //     },
    //     email,
    //     phone,
    //     nicNumber,
    //     password: hashedPassword,
    //   });
    // }


    const token = jwt.sign(
      { id: user._id, nic: nicNumber},
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: true,
      // sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Sending Welcome Email
    const mailOptions = {
      from: `"AI HealthSense" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to AI HealthSense",
      text: `testing tha project with ${email} and ${process.env.SMTP_USER}`,
    };

    await transpoter.sendMail(mailOptions);

    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { nicNumber, password, role } = req.body;

  if (!nicNumber || !password || !role) {
    return res.json({
      success: false,
      message: "Valid NIC and Password are required",
    });
  }

  try {

    let user;
    if (role === "patient") {
      user = await userModel.findOne({ nicNumber });
    }
    else if (role === "doctor") {
      user = await doctorModel.findOne({ nicNumber });
    }
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: user._id, nic: nicNumber, role: role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: true,
      // sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: true,
      // sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      sameSite: "None",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId , role } = req.body;

    let user;
    // if (role === 'patient') {
      user = await userModel.findById(userId);
    // }
    // else if (role === 'doctor') {
    //   user = await doctorModel.findById(userId);
    // }

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account is already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    // Expires after 1 minute
    user.verifyOtpExpireAt = Date.now() + 60 * 1000;
    await user.save();

    // Send Verfication email
    const mailOptions = {
      from: `"AI HealthSense" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Account Verification - AI HealthSense",
      text: `Your OTP is ${otp}. Verify your account using OTP`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
    };
    await transpoter.sendMail(mailOptions);

    return res.json({ success: true, message: "OTP sent on email " });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Verify the email using OTP
export const verifyEmail = async (req, res) => {
  const { userId, otp, role } = req.body;

  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Details" });

  }

  try {

    let user;
    if (role === 'patient') {
      user = await userModel.findById(userId);
    }
    else if (role === 'doctor') {
      user = await doctorModel.findById(userId);
    }

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    } else if (user.verifyOtp === '' || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }else if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP is Expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.json({ success: true, message: "Email Verified Successfully" });





  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// Check if user is authenticated
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({success: true})
  } catch (error) {
    return res.json({success: false, message: error.message})
  }
}


// Send Password Reset OTP
export const sendResetOtp = async (req, res) => {
  const {email, role} = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {

    let user;
    // if (role === 'patient') {
      user = await userModel.findOne({email});
    // }
    // else if (role === 'doctor') {
    //   user = await doctorModel.findOne({email});
    // }
    if (!user) {
      return res.json({success: false, message: "User not found"})
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    // Expires after 1 minute
    user.resetOtpExpireAt = Date.now() + 60 * 1000;
    await user.save();

    // Send Verfication email
    const mailOptions = {
      from: `"AI HealthSense" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Password Reset OTP - AI HealthSense",
      // text: `Your OTP is ${otp}. Reset your password using this OTP`,
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
    };
    await transpoter.sendMail(mailOptions);

    return res.json({success: true, message: "OTP sent to your email"})

  } catch (error) {
    return res.json({success: false, message: error.message})

  }
}


// Reset User Password
export const resetPassword = async (req, res) => {
  const {email, otp, newPassword, role} = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: "Email, OTP and new password are required" });
  }

  try {

    let user;
    // if (role === 'patient') {
      user = await userModel.findOne({email});
    // }
    // else if (role === 'doctor') {
    //   user = await doctorModel.findOne({email});
    // }
    if (!user) {
      return res.json({success: false, message: "User not found"});
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({success: false, message: "Invalid OTP"});
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({success: false, message: "OTP is Expired"});
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();




    return res.json({success: true, message: "Password has been reset successfully"})


  } catch (error) {
    return res.json({success: false, message: error.message})

  }
}