import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState("");
  const [otp, setOtp] = useState(0);
  const [isOptSubmitted, setIsOptSubmitted] = useState(false);

  const inputRefs = React.useRef([]);

  const inputHandler = (e, i) => {
    if (e.target.value.length > 0 && i < inputRefs.current.length - 1) {
      inputRefs.current[i + 1].focus();
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && e.target.value === "" && i > 0) {
      inputRefs.current[i - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email }
      );
      if (data.success) {
        setIsEmailSent(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    setOtp(otpArray.join(""));
    setIsOptSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { email, otp, newPassword }
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex  justify-center px-4 py-12">
      {/* <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      /> */}

      {/* Email Form */}
      {!isEmailSent && (
        <div className="bg-white  p-10 rounded-lg shadow-xl border border-gray-300 w-full sm:w-96 text-black text-sm">
          {/* Logo */}
          <img
            className="w-40 mx-auto mb-6"
            src="/src/assets/healthsenselogo.jpg"
            alt="Logo"
          />

          <h1 className="text-3xl font-semibold text-black text-center mb-3">
            Reset password
          </h1>
          <p className="text-center text-sm mb-6 text-indigo-300">
            Enter your registered email address
          </p>
          <form onSubmit={onSubmitEmail}>
            <div className="mb-4 relative">
              <img
                src={assets.mail_icon}
                alt=""
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
              />
              <input
                className="w-full pl-12 pr-5 py-2.5 rounded-full border border-gray-400 bg-white  focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="email"
                placeholder="Email id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button className="w-full py-2.5 rounded-full bg-[#1599aa] text-white font-medium cursor-pointer">
              Submit
            </button>
          </form>
        </div>
      )}

      {/* OTP Form */}
      {!isOptSubmitted && isEmailSent && (
        <div className="bg-white  p-10 rounded-lg shadow-xl border border-gray-300 w-full sm:w-96 text-black text-sm">
          {/* Logo */}
          <img
            className="w-40 mx-auto mb-6"
            src="/src/assets/healthsenselogo.jpg"
            alt="Logo"
          />
          <h1 className="text-3xl font-semibold text-black text-center mb-3">
            Password Reset OTP
          </h1>
          <p className="text-center mb-6 text-indigo-300">
            Enter the 6-digit code sent to your email id.
          </p>

          <form onSubmit={onSubmitOtp}>
            <div className="flex justify-between mb-8" onPaste={handlePaste}>
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <input
                    ref={(e) => (inputRefs.current[i] = e)}
                    className="w-12 h-12 border border-gray-400 bg-white  focus:outline-none focus:ring-2 focus:ring-blue-400 text-center text-xl rounded-md"
                    type="text"
                    maxLength="1"
                    key={i}
                    required
                    onInput={(e) => inputHandler(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                  />
                ))}
            </div>
            <button className="w-full py-2.5 rounded-full bg-[#1599aa] text-white font-medium cursor-pointer">
              Submit
            </button>
          </form>
        </div>
      )}

      {/* Enter new Password */}
      {isOptSubmitted && isEmailSent && (
        <div className="bg-white  p-10 rounded-lg shadow-xl border border-gray-300 w-full sm:w-96 text-black text-sm">
          {/* Logo */}
          <img
            className="w-40 mx-auto mb-6"
            src="/src/assets/healthsenselogo.jpg"
            alt="Logo"
          />
          <h1 className="text-3xl font-semibold text-black text-center mb-3">
              New password
            </h1>
            <p className="text-center mb-6 text-indigo-300">
              Enter the new password below
            </p>
          <form onSubmit={onSubmitNewPassword}>

            <div className="mb-4 relative">
              <img src={assets.lock_icon} alt="" className="absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                className="w-full pl-12 pr-5 py-2.5 rounded-full border border-gray-400 bg-white  focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button className="w-full py-2.5 rounded-full bg-[#1599aa] text-white font-medium cursor-pointer">
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
