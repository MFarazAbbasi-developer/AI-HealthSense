import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();

  const { backendUrl, isLoggedin, setIsLoggedin, userData, getUserData } =
    useContext(AppContext);

  const [sigUpForm, setSignUpForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nicNumber: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      setLoading(true);

      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        `${backendUrl}/api/auth/register`,
        sigUpForm
      );

      if (data.success) {
        setIsLoggedin(true);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isLoggedin && userData && navigate("/");
  }, [isLoggedin, userData]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-white  p-10 rounded-lg shadow-xl border border-gray-300 w-full sm:w-96 text-black text-sm">
        {/* Logo */}
        <img
          className="w-40 mx-auto mb-6"
          src="/src/assets/healthsenselogo.jpg"
          alt="Logo"
        />

        <h2 className="text-3xl font-semibold text-black text-center mb-3">
          Create Account
        </h2>

        {/* <p className="text-center text-sm mb-6">Create your account</p> */}

        <form onSubmit={onSubmitHandler}>
          {/* FirstName */}
          <div className="mb-4 relative">
            <img
              src={assets.person_icon}
              alt=""
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
            />
            <input
              onChange={(e) =>
                setSignUpForm({ ...sigUpForm, firstName: e.target.value })
              }
              value={sigUpForm.firstName}
              className="w-full pl-12 pr-5 py-2.5 rounded-full border border-gray-400 bg-white  focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              placeholder="First Name"
              required
            />
          </div>
          {/* LastName */}
          <div className="mb-4 relative">
            <img
              src={assets.person_icon}
              alt=""
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
            />
            <input
              onChange={(e) =>
                setSignUpForm({ ...sigUpForm, lastName: e.target.value })
              }
              value={sigUpForm.lastName}
              className="w-full pl-12 pr-5 py-2.5 rounded-full border border-gray-400 bg-white  focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              placeholder="Last Name"
              required
            />
          </div>
          {/* Email */}
          <div className="mb-4 relative">
            <img
              src={assets.mail_icon}
              alt=""
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
            />
            <input
              onChange={(e) =>
                setSignUpForm({ ...sigUpForm, email: e.target.value })
              }
              value={sigUpForm.email}
              className="w-full pl-12 pr-5 py-2.5 rounded-full border border-gray-400 bg-white  focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="email"
              placeholder="Email id"
              required
            />
          </div>
          {/* Phone */}
          <div className="mb-4 relative">
            <img
              src={assets.lock_icon}
              alt=""
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
            />
            <input
              onChange={(e) =>
                setSignUpForm({ ...sigUpForm, phone: e.target.value })
              }
              value={sigUpForm.phone}
              className="w-full pl-12 pr-5 py-2.5 rounded-full border border-gray-400 bg-white  focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="tel"
              placeholder="Phone Number"
              required
            />
          </div>
          {/* NIC Number */}
          <div className="mb-4 relative">
            <img
              src={assets.person_icon}
              alt=""
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
            />
            <input
              onChange={(e) =>
                setSignUpForm({ ...sigUpForm, nicNumber: e.target.value })
              }
              value={sigUpForm.nicNumber}
              className="w-full pl-12 pr-5 py-2.5 rounded-full border border-gray-400 bg-white  focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              maxLength={15}
              placeholder="NIC Number"
              required
            />
          </div>
          {/* Password */}
          <div className="mb-4 relative">
            <img
              src={assets.lock_icon}
              alt=""
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
            />
            <input
              onChange={(e) =>
                setSignUpForm({ ...sigUpForm, password: e.target.value })
              }
              value={sigUpForm.password}
              className="w-full pl-12 pr-5 py-2.5 rounded-full border border-gray-400 bg-white  focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          {/* <p onClick={() => navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>Forgot password?</p> */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#1599aa] hover:bg-[#1590aa] text-white font-semibold py-2 px-4 rounded-full disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                  />
                </svg>
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p
          onClick={() => navigate("/login")}
          className="text-gray-400 text-center text-xs mt-4"
        >
          Already have an account?{" "}
          <span className="text-blue-400 cursor-pointer underline">
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
