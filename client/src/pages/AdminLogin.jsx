import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
const AdminLogin = () => {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedin, userData, getUserData, isLoggedin } =
    useContext(AppContext);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        `${backendUrl}/api/admin/login`,
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-xl border border-gray-300 p-10 rounded-lg  w-full sm:w-96 text-black text-sm">
        {/* Logo */}
        <img
          className="w-40 mx-auto mb-6"
          src="/src/assets/healthsenselogo.jpg"
          alt="Logo"
        />

        {/* Heading */}
        <h2 className="text-3xl font-semibold text-black text-center mb-3">
          Login <p className="text-lg">(As an Admin)</p>
        </h2>

        <form onSubmit={onSubmitHandler}>
          {/* Email Address */}
          <div className="mb-4 relative">
            <img
              src={assets.person_icon}
              alt=""
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
            />
            <input
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
              value={loginForm.email}
              className="w-full pl-12 pr-5 py-2.5 rounded-full border border-gray-400 bg-white  focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="email"
              placeholder="Email"
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
      </div>
    </div>
  );
};

export default AdminLogin;
