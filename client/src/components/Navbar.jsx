import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { ShieldCheck, Crown, Settings, UserCog, Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin, doctors } =
    useContext(AppContext);

  const logoutHandler = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setIsLoggedin(false);
        setUserData(false);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`
      );

      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const [mobileOpen, setMobileOpen] = useState(false);
  // const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="sticky top-0 z-40 bg-white shadow-md h-18 w-full flex justify-between items-center text-sm py-4 border-b border-b-gray-400 sm:p-6 sm:px-24 px-6">
      {/* HAMBURGER ON SMALL SCREENS (LEFT SIDE) */}
      <button onClick={() => setMobileOpen(true)} className="md:hidden mr-2">
        <Menu size={24} />
      </button>

      {/* LOGO */}
      <img
        src={assets.healthsenselogo}
        alt="logo"
        className="w-28 sm:w-36 cursor-pointer"
        onClick={() => {
          navigate("/");
          scrollTo(0, 0);
        }}
      />

      {/* DESKTOP NAVLINKS */}
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to={"/"} onClick={() => scrollTo(0, 0)}>
          <li className="py-1">Home</li>
          <hr className="border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to={"/disease-predictor"} onClick={() => scrollTo(0, 0)}>
          <li className="py-1">Disease Predictor</li>
          <hr className="border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to={"/doctors"} onClick={() => scrollTo(0, 0)}>
          <li className="py-1">Find Doctor</li>
          <hr className="border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to={"/about"} onClick={() => scrollTo(0, 0)}>
          <li className="py-1">About Us</li>
          <hr className="border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to={"/contact"} onClick={() => scrollTo(0, 0)}>
          <li className="py-1">Contact Us</li>
          <hr className="border-none outline-none h-0.5 bg-[#5f6FFF] w-3/5 m-auto hidden" />
        </NavLink>
      </ul>

      {/* USER / LOGIN BUTTON */}
      {userData ? (
        <div
          className="relative group cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {userData.role === "patient" ? (
            <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white ">
              {userData.name[0].toUpperCase()}
            </div>
          ) : userData.role === "doctor" ? (
            <img
              src={
                doctors.find((doc) => doc._id === userData.userId)
                  ?.doctorImageUrl
              }
              alt=""
              className="w-8 h-8 rounded-full border border-blue-500"
            />
          ) : (
            <div className="flex items-center gap-1 text-blue-700 font-semibold">
              <UserCog className="h-5 w-5" />
              Admin
            </div>
          )}

          <div
            onClick={() => setIsOpen((prev) => !prev)}
            className={`absolute group-hover:block ${
              isOpen ? "block" : "hidden"
            }  top-0 right-0 z-10 text-gray-700 font-medium rounded pt-10`}
          >
            <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                >
                  Verify Email
                </li>
              )}
              {userData.role === "doctor" && (
                <li
                  onClick={() => {
                    userData.role === "doctor"
                      ? navigate(`/doctors/profile/${userData.userId}`)
                      : navigate("/my-profile");
                  }}
                  className="py-1 px-2 hover:bg-gray-200  cursor-pointer"
                >
                  My Profile
                </li>
              )}
              <li
                onClick={logoutHandler}
                className="py-1 px-2 text-red-500 hover:bg-gray-200 cursor-pointer pr-10"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="hidden md:flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer transition-all"
        >
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      )}

      {/* LOGIN BUTTON (VISIBLE ON SMALL SCREEN) */}
      {!userData && (
        <button
          onClick={() => navigate("/login")}
          className="md:hidden border border-gray-500 rounded-full px-4 py-1 text-sm text-gray-800"
        >
          Login
        </button>
      )}

      {/* OVERLAY BACKGROUND */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* MOBILE SLIDE-IN MENU */}
      {mobileOpen && (
        <div className="fixed top-0 left-0 w-64 h-full bg-white z-50 p-6 shadow-lg animate-slide-in-left">
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4"
          >
            <X size={22} />
          </button>

          <ul className="mt-10 space-y-4 font-medium text-gray-800">
            {[
              { label: "Home", to: "/" },
              { label: "Disease Predictor", to: "/disease-predictor" },
              { label: "Find Doctor", to: "/doctors" },
              { label: "About Us", to: "/about" },
              { label: "Contact Us", to: "/contact" },
            ].map(({ label, to }) => (
              <li
                key={label}
                onClick={() => {
                  navigate(to);
                  scrollTo(0, 0);
                  setMobileOpen(false);
                }}
                className="hover:text-blue-600 cursor-pointer"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Animation CSS */}
      <style>{`
    @keyframes slideInLeft {
      0% { transform: translateX(-100%); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in-left {
      animation: slideInLeft 0.3s ease-out forwards;
    }
  `}</style>
    </div>
  );
};

export default Navbar;
