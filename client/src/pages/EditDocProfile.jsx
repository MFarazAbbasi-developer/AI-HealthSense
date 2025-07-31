import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

import {
  Trash2,
  Plus,
  X,
  Tag,
  CheckCircle,
  Globe,
  CalendarDays,
  UploadCloud,
  PencilLine,
} from "lucide-react";

const EditDocProfile = () => {
  const navigate = useNavigate();
  const { docId } = useParams();
  const { doctors, backendUrl } = useContext(AppContext);

  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({});
  // Function to convert 12-hour format to 24-hour format
  function to24Hour(time12) {
    const [t, m] = time12.split(" ");
    let [h, min] = t.split(":");
    h = parseInt(h);
    if (m === "PM" && h !== 12) h += 12;
    if (m === "AM" && h === 12) h = 0;
    return `${h.toString().padStart(2, "0")}:${min}`;
  }
  // Function to convert 24-hour format to 12-hour format
  function to12Hour(time24) {
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  }
  // Fetch doctor info on page load
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const docInfo = await doctors.find((doc) => doc._id === docId);

        setDoctor(docInfo);
        const convertedTimeSlots =
          docInfo.availability?.timeSlots?.map((slot) => ({
            start: to24Hour(slot.start),
            end: to24Hour(slot.end),
          })) || [];

        setFormData({
          ...docInfo,
          availability: {
            ...docInfo.availability,
            timeSlots: convertedTimeSlots,
          },
        });
        // setFormData(docInfo);
        console.log(docInfo);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDoctor();
  }, [doctors, docId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested fields like name.first
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Convert time slots back to 12-hour format before sending
    const updatedFormData = {
      ...formData,
      availability: {
        ...formData.availability,
        timeSlots: formData.availability.timeSlots.map((slot) => ({
          start: to12Hour(slot.start),
          end: to12Hour(slot.end),
        })),
      },
      phone: formData.phone.replace(/\s/g, ""), // Remove spaces from phone
    };
    try {
      const res = await axios.put(
        `${backendUrl}/api/doctors/update-profile`,
        updatedFormData,
        {
          withCredentials: true, // ✅ VERY IMPORTANT for sending cookies
        }
      );
      if (res.data.success) {
        toast.success(res.data.message || "Profile updated successfully!");
        navigate(`/doctors/profile/${docId}`);
        setTimeout(() => window.location.reload(), 1000); // slight delay
      } else {
        toast.error(res.data.message || "Profile update failed!");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Something went wrong while updating profile!");
    } finally {
      setLoading(false);
    }
  };

  const handleNestedArrayChange = (section, index, key, value) => {
    setFormData((prev) => {
      const updated = [...(prev[section] || [])];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, [section]: updated };
    });
  };

  const addToArray = (section, newObj) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), newObj],
    }));
  };

  const removeFromArray = (section, index) => {
    setFormData((prev) => {
      const updated = [...(prev[section] || [])];
      updated.splice(index, 1); // remove one element at index
      return { ...prev, [section]: updated };
    });
  };

  //   Function to handle adding tags
  const handleAddTag = (field, value) => {
    if (!value.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], value.trim()],
    }));
  };

  //   Function to handle removing tags
  const handleRemoveTag = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const [uploading, setUploading] = useState(false);
  // Function to handle image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append("file", file);
    formDataObj.append("upload_preset", "ai_healthsense_unsigned"); // Your unsigned preset
    // formDataObj.append("cloud_name", "dwb9intbs"); // Your Cloudinary cloud name

    try {
      setUploading(true); // 🔁 Show loader / disable button

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dwb9intbs/image/upload",
        formDataObj,
        {
          withCredentials: false, // ✅ Force it OFF
        }
      );

      const imageUrl = res.data.secure_url;
      setFormData({ ...formData, doctorImageUrl: imageUrl });
      toast.success("Image uploaded successfully!");
      console.log(imageUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed!");
    } finally {
      setUploading(false); // ✅ Reset loader state
    }
  };

  if (!doctor) return <div className="text-center py-10">Loading...</div>;

  return (
    formData && (
      <div className="max-w-4xl mx-auto p-8 bg-white shadow rounded mt-10">
        <h1 className="text-center text-2xl font-bold mb-6 text-blue-700">
          Edit Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset disabled={loading} className={loading ? "opacity-60 cursor-not-allowed" : ""}>
          {/* Profile Picture and Description */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Left - Profile picture */}
            <div className="md:w-1/2 flex justify-center md:justify-start ">
              <div className="mb-6">
                <label className="block font-semibold mb-2 text-gray-700">
                  Profile Image
                </label>

                {formData.doctorImageUrl ? (
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-3 group">
                    <img
                      src={formData.doctorImageUrl}
                      alt="Doctor"
                      className={`w-full h-full object-cover rounded-xl border shadow-md ${
                        uploading ? "opacity-50 blur-[1px]" : ""
                      }`}
                    />

                    {/* Edit Button */}
                    <label
                      className={`absolute bottom-2 right-2 bg-white p-1.5 rounded-full text-blue-600 shadow-md cursor-pointer hover:bg-blue-100 transition ${
                        uploading ? "pointer-events-none opacity-50" : ""
                      }`}
                      title="Change Image"
                    >
                      <PencilLine size={18} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, doctorImageUrl: "" })
                      }
                      className={`absolute top-2 right-2 bg-white p-1.5 rounded-full text-red-600 shadow-md hover:bg-red-100 transition ${
                        uploading ? "pointer-events-none opacity-50" : ""
                      }`}
                      title="Remove Image"
                      disabled={uploading}
                    >
                      <Trash2 size={18} />
                    </button>

                    {/* Uploading indicator */}
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-xl">
                        <span className="text-blue-700 text-xs animate-pulse">
                          Uploading...
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={`flex items-center gap-2 p-5 border border-dashed rounded-lg bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100 transition ${
                      uploading ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <UploadCloud className="w-5 h-5" />
                    <label className="cursor-pointer text-sm font-medium">
                      {uploading ? "Uploading..." : "Upload Profile Image"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
            {/* Right - Description */}
            <div className="md:w-[100%]">
              <div className="mb-6">
                <label className="block font-semibold mb-2 text-gray-700">
                  About Doctor{" "}
                  <span className="text-sm text-gray-500">
                    (max 1000 characters)
                  </span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={10}
                  maxLength={1000}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none shadow-sm"
                  placeholder="Write a detailed professional bio, including qualifications, experience, and areas of expertise..."
                ></textarea>
                <div className="text-right text-xs text-gray-500 mt-1">
                  {formData.description.length}/1000 characters
                </div>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <input
                type="text"
                name="name.firstName"
                value={formData.name?.firstName || ""}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <input
                type="text"
                name="name.lastName"
                value={formData.name?.lastName || ""}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>
          </div>

          {/* NIC number & Fees */}
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium">
                Consultation Fee (PKR)
              </label>
              <input
                type="number"
                name="consultationFee.amount"
                value={formData.consultationFee?.amount || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md mt-1 focus:border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                placeholder="Enter fee"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">NIC Number</label>
              <input
                type="text"
                name="nicNumber"
                value={formData.nicNumber || ""}
                onChange={(e) => {
                  const rawValue = e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 13); // Only digits, max 13
                  const formatted =
                    rawValue.length <= 5
                      ? rawValue
                      : rawValue.length <= 12
                      ? `${rawValue.slice(0, 5)}-${rawValue.slice(5, 12)}`
                      : `${rawValue.slice(0, 5)}-${rawValue.slice(
                          5,
                          12
                        )}-${rawValue.slice(12, 13)}`;

                  setFormData({ ...formData, nicNumber: formatted });
                }}
                className="w-full px-3 py-2 border rounded-md mt-1 focus:border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                placeholder="xxxxx-xxxxxxx-x"
              />
            </div>
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md mt-1 focus:border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                placeholder="+92 300 1234567"
                value={formData.phone || ""}
                onChange={(e) => {
                  let input = e.target.value;

                  // Remove any non-digit except "+"
                  const cleaned = input.replace(/[^\d+]/g, "");

                  // If it starts with +92, retain it; else, add it
                  let formatted = cleaned;

                  if (formatted.startsWith("+92")) {
                    formatted = formatted.slice(0, 13); // +923001234567
                    // Apply spacing to +92 300 1234567
                    formatted = formatted.replace(
                      /^\+92(\d{3})(\d{0,7})$/,
                      (_, p1, p2) => `+92 ${p1}${p2 ? " " + p2 : ""}`
                    );
                  } else {
                    // Remove any accidental leading 0s or 0092 etc
                    let digits = cleaned.replace(/^0+|^0092|^92/, "");
                    digits = digits.slice(0, 10);
                    formatted = `+92 ${digits.slice(0, 3)}${
                      digits.length > 3 ? " " + digits.slice(3) : ""
                    }`;
                  }

                  setFormData({ ...formData, phone: formatted });
                }}
                className="w-full px-3 py-2 border rounded-md mt-1 focus:border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          {/* Specialization and Experience */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">
                Specialization
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization || ""}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Experience (years)
              </label>
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears || ""}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>
          </div>

          {/* Clinic Address */}
          <div>
            <label className="block text-sm font-medium">Street</label>
            <input
              type="text"
              name="clinicAddress.street"
              value={formData.clinicAddress?.street || ""}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">City</label>
              <input
                type="text"
                name="clinicAddress.city"
                value={formData.clinicAddress?.city || ""}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Province</label>
              <input
                type="text"
                name="clinicAddress.state"
                value={formData.clinicAddress?.state || ""}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
              />
            </div>
          </div>

          {/* Availability Section */}
          {/* Days of the Week */}
          <div className="mb-6">
            <label className="font-medium mb-3 text-black flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-600" />
              Select Available Days
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => {
                const isSelected = formData.availability.days.includes(day);
                return (
                  <label
                    key={day}
                    className={`flex items-center justify-start gap-2 px-3 py-2 rounded-md text-sm border cursor-pointer transition-all duration-200
            ${
              isSelected
                ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm"
                : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
            }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        const updatedDays = [...formData.availability.days];
                        if (e.target.checked) {
                          updatedDays.push(day);
                        } else {
                          const index = updatedDays.indexOf(day);
                          if (index > -1) updatedDays.splice(index, 1);
                        }
                        setFormData({
                          ...formData,
                          availability: {
                            ...formData.availability,
                            days: updatedDays,
                          },
                        });
                      }}
                      className="hidden"
                    />
                    <span
                      className={`transition-transform duration-150 ${
                        isSelected ? "scale-105 font-semibold" : "scale-100"
                      }`}
                    >
                      {day}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
          {/* Time Slots */}
          <div className="mb-6">
            <label className="font-semibold block mb-2 text-black">
              Available Time Slots
            </label>

            {formData.availability.timeSlots?.map((slot, index) => (
              <div
                key={index}
                className="flex items-center gap-3 mb-2 bg-gray-50 p-3 rounded-lg shadow-sm border"
              >
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Start</span>
                  <input
                    type="time"
                    value={slot.start}
                    onChange={(e) => {
                      const updatedSlots = [...formData.availability.timeSlots];
                      updatedSlots[index].start = e.target.value;
                      setFormData({
                        ...formData,
                        availability: {
                          ...formData.availability,
                          timeSlots: updatedSlots,
                        },
                      });
                    }}
                    className="border px-3 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">End</span>
                  <input
                    type="time"
                    value={slot.end}
                    onChange={(e) => {
                      const updatedSlots = [...formData.availability.timeSlots];
                      updatedSlots[index].end = e.target.value;
                      setFormData({
                        ...formData,
                        availability: {
                          ...formData.availability,
                          timeSlots: updatedSlots,
                        },
                      });
                    }}
                    className="border px-3 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const updatedSlots = [...formData.availability.timeSlots];
                    updatedSlots.splice(index, 1);
                    setFormData({
                      ...formData,
                      availability: {
                        ...formData.availability,
                        timeSlots: updatedSlots,
                      },
                    });
                  }}
                  className="ml-auto text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-full transition-transform hover:scale-110"
                  title="Remove Slot"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                const updatedSlots = [
                  ...formData.availability.timeSlots,
                  { start: "", end: "" },
                ];
                setFormData({
                  ...formData,
                  availability: {
                    ...formData.availability,
                    timeSlots: updatedSlots,
                  },
                });
              }}
              className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Time Slot
            </button>
          </div>

          {/* Languages Section */}
          <div className="mb-4">
            <label className="font-medium">Languages</label>
            <div className="flex flex-wrap items-center gap-2 border p-2 rounded mt-1">
              {formData.languages.map((lang, index) => (
                <div
                  key={index}
                  className="flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-full mr-2 mb-2 text-sm"
                >
                  <Globe className="w-4 h-4 mr-1" />
                  <span>{lang}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag("languages", index)}
                    className="ml-1 hover:text-red-600 cursor-pointer"
                    title="Remove Language"
                  >
                    <X className="w-4 h-4 transition-transform duration-200 hover:rotate-90 hover:scale-110" />
                  </button>
                </div>
              ))}
              <input
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    handleAddTag("languages", e.target.value);
                    e.target.value = "";
                  }
                }}
                className="flex-1 px-3 py-1.5 text-sm border border-purple-500 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
                placeholder="Add language and press Enter"
              />
            </div>
          </div>

          {/* Services Offered Section */}
          <div className="mb-4">
            <label className="font-medium">Services Offered</label>
            <div className="flex flex-wrap items-center gap-2 border p-2 rounded mt-1">
              {formData.servicesOffered.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full mr-2 mb-2 text-sm"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span>{service}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag("servicesOffered", index)}
                    className="ml-1 hover:text-red-600 cursor-pointer"
                    title="Remove Service"
                  >
                    <X className="w-4 h-4 transition-transform duration-200 hover:rotate-90 hover:scale-110" />
                  </button>
                </div>
              ))}
              <input
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    handleAddTag("servicesOffered", e.target.value);
                    e.target.value = "";
                  }
                }}
                className="flex-1 px-3 py-1.5 text-sm border border-green-500 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 transition"
                placeholder="Add service and press Enter"
              />
            </div>
          </div>

          {/* Tags Section */}
          <div className="mb-4">
            <label className="font-medium">Tags</label>
            <div className="flex flex-wrap items-center gap-2 border p-2 rounded mt-1">
              {formData.tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2 mb-2 text-sm"
                >
                  <Tag className="w-4 h-4 mr-1" />
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag("tags", index)}
                    className="ml-1 hover:text-red-600 cursor-pointer"
                    title="Remove Tag"
                  >
                    <X className="w-4 h-4 transition-transform duration-200 hover:rotate-90 hover:scale-110" />
                  </button>
                </div>
              ))}
              <input
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    handleAddTag("tags", e.target.value);
                    e.target.value = "";
                  }
                }}
                className="flex-1 px-3 py-1.5 text-sm border border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                placeholder="Add tag and press Enter"
              />
            </div>
          </div>

          {/* Education Background Section */}
          <div>
            <h2 className="text-lg font-semibold mt-6 mb-2">
              Education Background
            </h2>
            {formData.educationBackground?.map((edu, index) => (
              <div key={index} className="flex items-center gap-4 mb-2">
                <div className="grid grid-cols-3 gap-4 flex-grow">
                  <input
                    type="text"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) =>
                      handleNestedArrayChange(
                        "educationBackground",
                        index,
                        "degree",
                        e.target.value
                      )
                    }
                    className="border px-2 py-1 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) =>
                      handleNestedArrayChange(
                        "educationBackground",
                        index,
                        "institution",
                        e.target.value
                      )
                    }
                    className="border px-2 py-1 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Year"
                    value={edu.yearCompleted}
                    onChange={(e) =>
                      handleNestedArrayChange(
                        "educationBackground",
                        index,
                        "yearCompleted",
                        e.target.value
                      )
                    }
                    className="border px-2 py-1 rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFromArray("educationBackground", index)}
                  className="ml-auto text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-full transition-transform hover:scale-110 cursor-pointer"
                  title="Remove Education"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                addToArray("educationBackground", {
                  degree: "",
                  institution: "",
                  yearCompleted: "",
                })
              }
              className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add More
            </button>
          </div>

          {/* Certifications Section - Similar */}
          <div>
            <h2 className="text-lg font-semibold mt-6 mb-2">Certifications</h2>
            {formData.certifications?.map((cert, index) => (
              <div key={index} className="flex items-center gap-4 mb-2">
                <div className="grid grid-cols-3 gap-4 flex-grow">
                  <input
                    type="text"
                    placeholder="Title"
                    value={cert.title}
                    onChange={(e) =>
                      handleNestedArrayChange(
                        "certifications",
                        index,
                        "title",
                        e.target.value
                      )
                    }
                    className="border px-2 py-1 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Authority"
                    value={cert.issuingOrganization}
                    onChange={(e) =>
                      handleNestedArrayChange(
                        "certifications",
                        index,
                        "issuingOrganizatio",
                        e.target.value
                      )
                    }
                    className="border px-2 py-1 rounded"
                  />
                  <input
                    type="number"
                    placeholder="Year"
                    value={cert.yearIssued}
                    onChange={(e) =>
                      handleNestedArrayChange(
                        "certifications",
                        index,
                        "yearIssued",
                        e.target.value
                      )
                    }
                    className="border px-2 py-1 rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFromArray("certifications", index)}
                  className="ml-auto text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-full transition-transform hover:scale-110 cursor-pointer"
                  title="Remove Certification"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                addToArray("certifications", {
                  title: "",
                  issuingOrganization: "",
                  yearIssued: "",
                })
              }
              className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add More
            </button>
          </div>

          {/* Social Media Links */}
          <div className="mb-4">
            <label className="font-medium">Social Media Links</label>
            <input
              type="text"
              value={formData.socialMediaLinks?.facebook || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialMediaLinks: {
                    ...formData.socialMediaLinks,
                    facebook: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 border rounded mt-1"
              placeholder="Facebook URL"
            />

            <input
              type="text"
              value={formData.socialMediaLinks?.linkedin || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  socialMediaLinks: {
                    ...formData.socialMediaLinks,
                    linkedin: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 border rounded mt-2"
              placeholder="LinkedIn URL"
            />
          </div>
</fieldset>
          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading} // Optional: controlled by a `loading` state
              className={`mt-6 flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    )
  );
};

export default EditDocProfile;
