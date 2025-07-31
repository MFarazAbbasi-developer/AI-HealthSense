import axios from "axios";
import React, { useState, useContext } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaUser,
  FaPaperPlane,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const Contact = () => {
  const { backendUrl } = useContext(AppContext);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.email || !form.message) {
      setStatus("Please fill in all fields.");
      return;
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/send-message`, form);

      if (data.success) {
        toast.success("Message sent successfully!");
    setForm({ name: "", email: "", message: "" });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen  py-16 px-6">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-xl p-10">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Contact Us
        </h2>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Contact Info */}
          <div className="md:w-1/2 space-y-6 text-gray-700">
            <div className="flex items-start gap-4">
              <FaEnvelope className="text-blue-600 text-xl mt-1" />
              <div>
                <p className="font-semibold">Email</p>
                <p>aihealthsense@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FaPhoneAlt className="text-green-600 text-xl mt-1" />
              <div>
                <p className="font-semibold">Phone</p>
                <p>+92 301 3235277</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FaMapMarkerAlt className="text-red-500 text-xl mt-1" />
              <div>
                <p className="font-semibold">Address</p>
                <p>
                  Software Engineering Department, QUEST Nawabshah, Sindh,
                  Pakistan
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="md:w-1/2 space-y-5">
            <div className="relative">
              <FaUser className="absolute top-3.5 left-3 text-gray-400" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Your Name"
                className="pl-10 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>

            <div className="relative">
              <FaEnvelope className="absolute top-3.5 left-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Your Email"
                className="pl-10 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </div>

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Your Message"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
            ></textarea>

            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition duration-300 flex items-center gap-2"
            >
              <FaPaperPlane />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
