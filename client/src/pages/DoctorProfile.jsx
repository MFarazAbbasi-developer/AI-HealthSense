import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { assets2 } from "../assets/assets2/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import Reviews from "../components/Reviews";
import axios from "axios";
import { toast } from "react-toastify";
// import AddReview from "../components/AddReview";
import {
  FaMapMarkerAlt,
  FaClock,
  FaStar,
  FaUserMd,
  FaCheckCircle,
  FaTimesCircle,
  FaBookMedical,
  FaGraduationCap,
} from "react-icons/fa";
import {
  FaCertificate,
  FaTools,
  FaTags,
  FaLanguage,
  FaCalendarAlt,
  FaUserClock,
  FaUniversity,
  FaAward,
  FaFacebookF,
  FaLinkedinIn,
  FaPhoneAlt,
  FaUserFriends,
} from "react-icons/fa";
import {
  FaUserCircle,
  FaRegStar,
  FaPaperPlane,
  FaTrashAlt,
  FaEdit,
} from "react-icons/fa";

import { MdEmail } from "react-icons/md";

const DoctorProfile = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctors, userData, backendUrl, getAllDoctors } =
    useContext(AppContext);

  const [doctor, setDoctor] = useState({});

  useEffect(() => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDoctor(docInfo);
    console.log(docInfo);
  }, [doctors, docId]);

  function checkDoctorAvailability(doctor) {
    // Check if the doctor is available based on the current day
    const currentDay = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });
    const isAvailableToday = doctor.availability?.days.some(
      (day) => day.toLowerCase() === currentDay.toLowerCase()
    );
    if (!isAvailableToday) {
      doctor.available = false;
      return false;
    }

    // Check if the doctor is available based on the current time
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    // Convert the current time to minutes for easier comparison
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Get the doctor's availability time slots
    for (let i = 0; i < doctor.availability.timeSlots.length; i++) {
      const startAmPm = doctor.availability.timeSlots[i].start.split(" ")[1];
      const startTime = doctor.availability.timeSlots[i].start.split(":");
      if (startAmPm === "PM" && parseInt(startTime[0]) !== 12) {
        startTime[0] = parseInt(startTime[0]) + 12;
      }
      const startTimeInMinutes =
        parseInt(startTime[0]) * 60 + parseInt(startTime[1].split(" ")[0]);

      const endAmPm = doctor.availability.timeSlots[i].end.split(" ")[1];
      const endTime = doctor.availability.timeSlots[i].end.split(":");
      if (endAmPm === "PM" && parseInt(endTime[0]) !== 12) {
        endTime[0] = parseInt(endTime[0]) + 12;
      }
      const endTimeInMinutes =
        parseInt(endTime[0]) * 60 + parseInt(endTime[1].split(" ")[0]);
      // Check if the current time is within the availability range
      if (
        currentTimeInMinutes >= startTimeInMinutes &&
        currentTimeInMinutes <= endTimeInMinutes
      ) {
        doctor.available = true;
        return true;
      }
    }
    doctor.available = false;
    return false;
  }

  // Delete doctor by Admin
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const handleDeleteDoctor = async () => {
    try {
      const res = await axios.delete(
        `${backendUrl}/api/admin/delete-doctor/${selectedDoctorId}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        // Optional: Remove doctor from UI without reload
        // setFilterDoc((prev) =>
        //   prev.filter((doc) => doc._id !== selectedDoctorId)
        // );
        getAllDoctors();
        navigate("/doctors");
        scrollTo(0, 0);
      } else {
        toast.error(res.data.message || "Deletion failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setShowConfirmModal(false);
      setSelectedDoctorId(null);
    }
  };

  if (!doctor) return <div className="text-center py-10">Loading...</div>;
  return (
    doctor && (
      <div className="container mx-auto px-4 sm:px-10 lg:px-16 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
          <img
            src={doctor.doctorImageUrl}
            alt="Doctor"
            className="w-44 h-44 sm:w-52 sm:h-52 rounded-full object-cover shadow-md"
          />
          <div className="w-full relative pl-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {doctor?.name?.firstName} {doctor?.name?.lastName}
            </h2>

            {/* Delete Button for ADMIN ONLY */}
            {userData?.role === "admin" && (
              <button
                onClick={() => {
                  setSelectedDoctorId(doctor._id);
                  setShowConfirmModal(true);
                }}
                title="Delete Doctor"
                className="absolute top-1 right-4 p-2 bg-white text-red-600 rounded-full shadow hover:bg-red-100 transition-all duration-200 hover:scale-105 z-10 cursor-pointer"
              >
                <FaTrashAlt size={16} />
              </button>
            )}
            {/* Edit Button for DOCTOR ONLY */}
            {userData?.role === "doctor" && userData?.userId === doctor._id && (
              <button
                onClick={() => navigate(`/edit/profile/${doctor._id}`)}
                title="Edit Profile"
                className="absolute top-1 right-12 p-2 bg-white text-blue-600 rounded-full shadow hover:bg-blue-100 transition-all duration-200 hover:scale-105 z-10 cursor-pointer"
              >
                <FaEdit size={16} />
              </button>
            )}

            <p className="text-base flex items-center gap-2 text-blue-500 font-semibold mt-2">
              <FaUserMd className="text-blue-500" /> {doctor.specialization}
            </p>
            <p className="text-sm sm:text-base text-gray-600 mt-1 flex items-center gap-2">
              <FaGraduationCap className="text-green-600" />{" "}
              {doctor.experienceYears}+ Years Experience
            </p>
            <p className="text-sm sm:text-base text-gray-600 mt-1 flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-500" />
              {doctor.clinicAddress?.street}, {doctor.clinicAddress?.city},{" "}
              {doctor.clinicAddress?.state}, {doctor.clinicAddress?.country}
            </p>
            <p className="text-sm sm:text-base text-gray-600 mt-1 flex items-center gap-2">
              <FaBookMedical className="text-purple-600" />
              Consultation Fee:{" "}
              <span className="text-gray-900">
                {doctor.consultationFee?.currency}{" "}
                {doctor.consultationFee?.amount}
              </span>
            </p>
            <div className="flex items-center gap-3 text-gray-700 mt-2">
              <span className="flex items-center gap-2.5 text-sm sm:text-base">
                <FaStar className="text-yellow-500" />{" "}
                {doctor.rating?.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({doctor.reviews?.length} Reviews)
              </span>
            </div>
            <div className="mt-3">
              <span
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium w-fit ${
                  checkDoctorAvailability(doctor)
                    ? "bg-green-200 text-green-700"
                    : "bg-red-200 text-red-700"
                }`}
              >
                {checkDoctorAvailability(doctor) ? (
                  <FaCheckCircle />
                ) : (
                  <FaTimesCircle />
                )}
                {checkDoctorAvailability(doctor) ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 my-8"></div>

        {/* About */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">About</h3>
          <p className="text-gray-700 leading-relaxed">{doctor.description}</p>
        </div>

        {/* Divider */}
        {/* <div className="border-t border-gray-300 my-8"></div> */}

        {/* Availability & Connect With Me */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          {/* ✅ Availability */}
          <div className="bg-white border border-gray-300 shadow-lg rounded-3xl p-8">
            <h3 className="text-lg font-bold text-teal-500 mb-4 flex items-center gap-2">
              <FaUserClock /> Availability
            </h3>
            <p className="flex items-center gap-2 mb-2">
              <FaCalendarAlt className="text-teal-400 shrink-0" />
              <span>
                <strong>Days:</strong> {doctor.availability?.days?.join(", ")}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <FaClock className="text-teal-400 shrink-0" />
              <span>
                <strong>Time Slots:</strong>{" "}
                {doctor.availability?.timeSlots
                  ?.map((slot) => `${slot.start} - ${slot.end}`)
                  .join(", ")}
              </span>
            </p>
          </div>
          {/* 🔗 Connect With Me */}
          <div className="bg-white border border-gray-300 shadow-lg rounded-3xl p-8">
            <h3 className="text-lg font-bold text-purple-700 mb-4 flex items-center gap-2">
              <FaUserFriends /> Connect With Me
            </h3>
            <div className="space-y-3 text-gray-700 text-sm">
              {doctor.socialMediaLinks?.facebook && (
                <div className="flex items-center gap-3">
                  <FaFacebookF className="text-blue-600" />
                  <a
                    href={doctor.socialMediaLinks.facebook}
                    target="_blank"
                    className="hover:text-blue-600"
                  >
                    Facebook Profile
                  </a>
                </div>
              )}
              {doctor.socialMediaLinks?.linkedin && (
                <div className="flex items-center gap-3">
                  <FaLinkedinIn className="text-blue-700" />
                  <a
                    href={doctor.socialMediaLinks.linkedin}
                    target="_blank"
                    className="hover:text-blue-700"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-green-600" />
                <span>{doctor.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MdEmail className="text-red-500" />
                <span>{doctor.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Education & Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          {/* Education */}
          <div className="bg-white border border-gray-300 shadow-lg rounded-3xl p-8">
            <h3 className="text-lg font-bold text-indigo-700 mb-4 flex items-center gap-2">
              <FaGraduationCap /> Education Background
            </h3>
            <div className="space-y-2 text-gray-700">
              {doctor.educationBackground?.map((edu, i) => (
                <div key={i} className="flex justify-between">
                  <div className="flex items-start">
                    <FaUniversity className="text-indigo-500 mt-1 me-2 shrink-0" />
                    {edu.degree} - {edu.institution}
                  </div>
                  <span className="text-sm text-gray-500">
                    {edu.yearCompleted}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white border border-gray-300 shadow-lg rounded-3xl p-8">
            <h3 className="text-lg font-bold text-emerald-600 mb-4 flex items-center gap-2">
              <FaCertificate /> Certifications
            </h3>
            <div className="space-y-2 text-gray-700">
              {doctor.certifications?.map((cert, i) => (
                <div key={i} className="flex justify-between">
                  <div className="flex items-start">
                    <FaAward className="text-emerald-500 mt-1.5 me-2 shrink-0" />
                    {cert.title} - {cert.issuingOrganization}
                  </div>
                  <span className="text-sm text-gray-500">
                    {cert.yearIssued}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Services Offered & Keywords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          {/* Services */}
          <div className="bg-white border border-gray-300 shadow-lg rounded-3xl p-8">
            <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
              <FaTools /> Services Offered
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
              {doctor.servicesOffered?.map((service, i) => (
                <div
                  key={i}
                  className="bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <FaCheckCircle className="text-green-600 shrink-0" />
                  {service}
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white border border-gray-300 shadow-lg rounded-3xl p-8">
            <h3 className="text-lg font-bold text-yellow-600 mb-4 flex items-center gap-2">
              <FaTags /> Search Tags
            </h3>
            <div className="flex flex-wrap gap-3">
              {doctor.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full"
                >
                  #{tag.replace(/\s/g, "_")}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <Reviews docId={docId} />
        {/* Related Doctors */}
        <RelatedDoctors
          speciality={doctor.specialization}
          docId={docId}
          checkDoctorAvailability={checkDoctorAvailability}
        />

        {/* Delete Confirmation Component*/}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] sm:w-full max-w-md text-center animate-fadeIn">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Confirm Deletion
              </h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Are you sure you want to delete this doctor named{" "}
                <span className="font-bold text-red-600">
                  {" "}
                  '{doctor.name?.firstName} {doctor.name?.lastName}'
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setSelectedDoctorId(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteDoctor}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Confirm
                </button>
              </div>
            </div>
            {/* CSS animation */}
            <style>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      .animate-fadeIn {
        animation: fadeIn 0.25s ease-out;
      }
    `}</style>
          </div>
        )}
      </div>
    )
  );
};

export default DoctorProfile;
