import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedin, userData, getUserData, isLoggedin } =
    useContext(AppContext);

  const [loginForm, setLoginForm] = useState({
    nicNumber: "",
    password: "",
    role: "patient",
  });

    const [loading, setLoading] = useState(false);
  

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        `${backendUrl}/api/auth/login`,
        loginForm
      );
      console.log(loginForm);

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

  const [role, setRole] = useState("patient");

  const handleToggle = (newRole) => {
    setRole(newRole);
    setLoginForm({ ...loginForm, role: newRole });
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4 py-12">
      <div className="bg-white shadow-xl border border-gray-300  p-10 rounded-lg w-full sm:w-96 text-black text-sm">
        {/* Logo */}
        <img
          className="w-40 mx-auto mb-6"
          src="/src/assets/healthsenselogo.jpg"
          alt="Logo"
        />

        <h2 className="text-3xl font-semibold text-black text-center mb-3">
          Login
        </h2>

        <p className="text-center text-sm mb-6">
          Login as a doctor or patient?
        </p>
        {/* Login as a Doctor Or Patient */}
        <div className="mb-6 m-auto w-fit flex items-center justify-center gap-0 bg-white rounded-full p-0.5 shadow-md">
          <button
            className={`px-5 py-2 rounded-full text-sm font-semibold transition duration-200 ${
              role === "doctor"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-200 text-gray-700 cursor-pointer"
            }`}
            onClick={() => handleToggle("doctor")}
          >
            Doctor
          </button>
          <button
            className={`px-5 py-2 rounded-full text-sm font-semibold transition duration-200 ${
              role === "patient"
                ? "bg-green-600 text-white shadow"
                : "bg-gray-200 text-gray-700 cursor-pointer"
            }`}
            onClick={() => handleToggle("patient")}
          >
            Patient
          </button>
        </div>

        <form onSubmit={onSubmitHandler}>
          {/* NIC Number */}
          <div className="mb-4 relative">
            <img
              src={assets.person_icon}
              alt=""
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
            />
            <input
              onChange={(e) =>
                setLoginForm({ ...loginForm, nicNumber: e.target.value })
              }
              value={loginForm.nicNumber}
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
              alt="lock icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
            />
            <input
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              value={loginForm.password}
              className="w-full pl-12 pr-5 py-2.5 rounded-full border border-gray-400 bg-white  focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <p
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-500 hover:underline w-fit cursor-pointer"
          >
            Forgot password?
          </p>
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
                Logging In...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p
          onClick={() => navigate("/signup")}
          className="text-gray-400 text-center text-xs mt-4"
        >
          Don't have an account?{" "}
          <span className="text-blue-400 cursor-pointer underline">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
