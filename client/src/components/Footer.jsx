import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaYoutube,
  FaWhatsapp,
  FaTiktok,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white px-6 py-10">
  <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

    {/* Branding */}
    <div>
      <img
        className="w-36 mb-4"
        src="/src/assets/healthsenselogo.jpg"
        alt="AI HealthSense Logo"
      />
      <p className="text-sm text-gray-300 leading-relaxed">
        Your AI-powered platform for eye health prediction, dietary guidance, and smart doctor recommendations.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
      <ul className="space-y-2 text-gray-400 text-sm">
        <NavLink to={"/"} onClick={() => scrollTo(0, 0)} className="hover:text-white transition">
          <li>Home</li>
        </NavLink>
        <NavLink to={"/disease-predictor"} onClick={() => scrollTo(0, 0)} className="hover:text-white transition">
          <li>Disease Predictor</li>
        </NavLink>
        <NavLink to={"/doctors"} onClick={() => scrollTo(0, 0)} className="hover:text-white transition">
          <li>Find a Doctor</li>
        </NavLink>
        <NavLink to={"/about"} onClick={() => scrollTo(0, 0)} className="hover:text-white transition">
          <li>About Us</li>
        </NavLink>
        <NavLink to={"/contact"} onClick={() => scrollTo(0, 0)} className="hover:text-white transition">
          <li>Contact Us</li>
        </NavLink>
      </ul>
    </div>

    {/* Contact */}
    <div>
      <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
      <ul className="space-y-2 text-sm text-gray-400">
        <li className="flex items-center gap-2"><FaEnvelope className="text-blue-600 text-sm " />aihealthsense@gmail.com</li>
        <li className="flex items-center gap-2"><FaPhoneAlt className="text-green-600 text-sm " />+92 301 3235277</li>
        <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-red-500 text-sm " />Nawabshah, Pakistan</li>
      </ul>
    </div>

    {/* Social Media */}
    <div>
      <h3 className="text-lg font-semibold mb-4 text-white">Connect with Us</h3>
      <div className="flex flex-wrap gap-4 text-2xl">
        <a href="#" className="hover:text-blue-600 transition"><FaFacebook /></a>
        <a href="#" className="hover:text-gray-400 transition"><FaXTwitter /></a>
        <a href="#" className="hover:text-pink-500 transition"><FaInstagram /></a>
        <a href="https://www.linkedin.com/in/muhammadfaraz-abbasi/" target="blank" className="hover:text-blue-700 transition"><FaLinkedin /></a>
        <a href="#" className="hover:text-red-600 transition"><FaYoutube /></a>
        <a href="#" className="hover:text-green-500 transition"><FaWhatsapp /></a>
      </div>
    </div>
  </div>

  {/* Bottom Bar */}
  <div className="text-center text-xs text-gray-500 mt-10 border-t border-gray-800 pt-4">
    &copy; {new Date().getFullYear()} AI HealthSense. All rights reserved.
  </div>
</footer>

  );
}
