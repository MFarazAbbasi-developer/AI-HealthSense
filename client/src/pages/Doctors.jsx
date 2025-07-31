import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { specialityData } from "../assets/assets2/assets";
import { assets } from "../assets/assets";

import { Select, Option, Switch } from "@material-tailwind/react";
import { FaStar, FaMapMarkerAlt, FaUserMd, FaTrashAlt } from "react-icons/fa";

import axios from "axios";
import { toast } from "react-toastify";

const Doctors = () => {
  let { speciality } = useParams();
  // let { speciality, fees } = useParams();
  // fees = Number(fees)
  const [filterDoc, setFilterDoc] = useState([]);

  const [showAvaibleDocOnly, setShowAvaibleDocOnly] = useState(false);

  function checkDoctorAvailability(doctor) {
    // Check if the doctor is available based on the current day
    const currentDay = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });
    const isAvailableToday = doctor.availability.days.some(
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

  const [sortOption, setSortOption] = useState('');
  const [x, setX] = useState(" ");

  const { doctors, specialityList, cityList, userData, backendUrl } =
    useContext(AppContext);

  const [cities, setCities] = useState(cityList);
  const [cityFilter, setcityFilter] = useState('');
  useEffect(() => {
    setCities(cityList);
  }, [cityList]);

  const navigate = useNavigate();

  const filterDoctorss = () => {
    // Filter by Speciality
    if (speciality) {
      const filtered = doctors.filter(
        (doc) => doc.specialization === speciality
      );
      setFilterDoc(filtered);
    } else {
      setFilterDoc(doctors);
    }

    // Sorting Logic
    if (sortOption && x !== sortOption) {
      setX(sortOption);
      console.log(filterDoc);
      let sortedDocs = [...filterDoc];
      switch (sortOption) {
        // case "-- None --":
        //   sortedDocs.sort((a, b) => b.rating - a.rating);
        //   break;
        case "Top Rated":
          sortedDocs.sort((a, b) => b.rating - a.rating);
          break;
        case "Most Reviewed":
          sortedDocs.sort((a, b) => b.reviews.length - a.reviews.length);
          break;
        case "Most Experienced":
          sortedDocs.sort((a, b) => b.experienceYears - a.experienceYears);
          break;
        case "Fees: Low to High":
          sortedDocs.sort(
            (a, b) => a.consultationFee.amount - b.consultationFee.amount
          );
          break;
        case "Fees: High to Low":
          sortedDocs.sort(
            (a, b) => b.consultationFee.amount - a.consultationFee.amount
          );
          break;
        default:
          break;
      }

      setFilterDoc(sortedDocs);
    }

    // Filter by Availability
    if (showAvaibleDocOnly) {
      const availableDocs = filterDoc.filter((doc) =>
        checkDoctorAvailability(doc)
      );
      setFilterDoc(availableDocs);
    }
    // else {
    //   // If not showing available doctors only, we can reset to the original filter
    //   if (speciality) {
    //     const filtered = doctors.filter(
    //       (doc) => doc.specialization === speciality
    //     );
    //     setFilterDoc(filtered);
    //   } else {
    //     setFilterDoc(doctors);
    //   }
    // }
  };
  const filterDoctors = () => {
    // Filter by Speciality
    let filtered = doctors;
    if (speciality) {
      filtered = doctors.filter((doc) => doc.specialization === speciality);
    }

    // Filter by Availability
    if (showAvaibleDocOnly) {
      filtered = filtered.filter((doc) => checkDoctorAvailability(doc));
    }

    // City Filter
    if (cityFilter) {
      filtered = filtered.filter(
        (doc) => doc.clinicAddress.city === cityFilter
      );
    }

    // Sorting Logic
    if (sortOption) {
      switch (sortOption) {
        case "Top Rated":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case "Most Reviewed":
          filtered.sort((a, b) => b.reviews.length - a.reviews.length);
          break;
        case "Most Experienced":
          filtered.sort((a, b) => b.experienceYears - a.experienceYears);
          break;
        case "Fees: Low to High":
          filtered.sort(
            (a, b) => a.consultationFee.amount - b.consultationFee.amount
          );
          break;
        case "Fees: High to Low":
          filtered.sort(
            (a, b) => b.consultationFee.amount - a.consultationFee.amount
          );
          break;
        default:
          break;
      }
    }

    setFilterDoc(filtered);
  };

  useEffect(() => {
    filterDoctors();
  }, [speciality, doctors, sortOption, showAvaibleDocOnly, cityFilter]);

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
        setFilterDoc((prev) =>
          prev.filter((doc) => doc._id !== selectedDoctorId)
        );
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

  return (
    <div className="mx-auto px-4 sm:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-10 px-2 flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
          Find a Doctor
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Search and connect with trusted healthcare professionals near you.
        </p>
        {filterDoc.length > 0 && (
          <h3 className="mt-4 text-base sm:text-lg font-medium text-blue-600">
            {filterDoc.length} {speciality ? `${speciality}` : "Doctors"}
            {cityFilter ? ` in ${cityFilter}` : ""}
            {" found"}
          </h3>
        )}
        {/* Reset Filters Button - UI Only */}
            {(sortOption || cityFilter || showAvaibleDocOnly || speciality) && (
              <div className="w-full sm:w-auto mt-4">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white group text-red-500 border border-gray-300 shadow-sm hover:bg-gray-50 hover:shadow-md hover:text-red-700 transition duration-200 text-sm font-bold"
                  title="Reset all filters"
                  onClick={() => {
                    setcityFilter('');
                    setSortOption('');
                    setShowAvaibleDocOnly(false);
                    navigate('/doctors')
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-red-500 group-hover:text-red-700 transition duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582M20 20v-5h-.581M4 9a9 9 0 0114.828-5.828M20 15a9 9 0 01-14.828 5.828"
                    />
                  </svg>
                  Reset all Filters
                </button>
              </div>
            )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Speciality List */}
        <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible text-sm text-gray-600 sticky top-20 bg-white z-10 p-2 rounded-md shadow-sm">
          {specialityList.map((element, index) => (
            <p
              key={index}
              onClick={() => {
                speciality === element
                  ? navigate("/doctors")
                  : navigate(`/doctors/${element}`);
                scrollTo(0, 0);
              }}
              className={`flex justify-between items-center w-full min-w-[200px] lg:min-w-0 lg:w-44 pl-3 py-1.5 pr-2 border border-gray-300 rounded transition-all cursor-pointer ${
                speciality === element ? "bg-indigo-100" : ""
              }`}
            >
              <span>{element}</span>
              <img
                className="w-6 sm:w-8"
                src={assets[element.replace(" ", "_")]}
                alt=""
              />
            </p>
          ))}
        </div>

        {/* Right Section */}
        <div className="w-full flex flex-col gap-6">
          {/* Filters: Available, City, Sort */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-2">
            <div className="flex items-center gap-2">
              <Switch
                id="availableDoc"
                checked={showAvaibleDocOnly}
                onChange={() => setShowAvaibleDocOnly((prev) => !prev)}
                ripple={false}
                color="teal"
                className="bg-[rgb(154,163,167)]"
              />
              <label htmlFor="availableDoc" className="text-sm text-gray-600">
                Show only available doctors
              </label>
            </div>

            <div className="w-full sm:w-64">
              {cities.length > 0 && (
              <Select
                value={cityFilter || undefined}
                onChange={(val) => setcityFilter(val)}
                label="Select City"
              >
                {cities.map((city, index) => (
                  <Option key={index} value={city}>
                    {city}
                  </Option>
                ))}
              </Select>
)}
            </div>
            
            <div className="w-full sm:w-64">
              <Select
                value={sortOption}
                onChange={(val) => setSortOption(val)}
                label="Sort Doctors"
              >
                <Option value="Top Rated">Top Rated</Option>
                <Option value="Most Reviewed">Most Reviewed</Option>
                <Option value="Most Experienced">Most Experienced</Option>
                <Option value="Fees: Low to High">Fees: Low to High</Option>
                <Option value="Fees: High to Low">Fees: High to Low</Option>
              </Select>
            </div>
          </div>

          {/* Doctor Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-2 mx-auto">
            {filterDoc.length > 0 ? (
              filterDoc.map((docc, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-300 rounded-2xl shadow-md p-5 relative transition-all hover:shadow-xl hover:-translate-y-1 max-w-[400px]"
                >
                  {userData?.role === "admin" && (
                    <button
                      onClick={() => {
                        setSelectedDoctorId(docc._id);
                        setShowConfirmModal(true);
                      }}
                      title="Delete Doctor"
                      className="absolute top-2 right-2 p-2 bg-white text-red-600 rounded-full shadow hover:bg-red-100 transition hover:scale-105 z-10"
                    >
                      <FaTrashAlt size={16} />
                    </button>
                  )}

                  <div className="flex items-start gap-4">
                    <img
                      src={docc.doctorImageUrl}
                      alt={`${docc.name.firstName} ${docc.name.lastName}`}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-blue-600"
                    />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {docc.name.firstName} {docc.name.lastName}
                      </h2>
                      <p className="text-blue-600 text-sm flex items-center gap-1">
                        <FaUserMd /> {docc.specialization}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <FaMapMarkerAlt />
                        {docc.clinicAddress.city}, {docc.clinicAddress.state}
                      </p>
                      <div
                        className={`mt-1 text-xs font-medium flex items-center gap-2 ${
                          checkDoctorAvailability(docc)
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            checkDoctorAvailability(docc)
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></span>
                        {checkDoctorAvailability(docc)
                          ? "Available"
                          : "Unavailable"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between text-sm">
                    <div>
                      <p className="text-gray-500">Experience</p>
                      <p className="font-semibold">
                        {docc.experienceYears} yrs
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Fee</p>
                      <p className="font-semibold">
                        {docc.consultationFee.currency}{" "}
                        {docc.consultationFee.amount}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Rating</p>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <FaStar />
                        <span className="text-gray-700 font-medium">
                          {docc.rating.toFixed(1)} ({docc.reviews.length})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-gray-600 line-clamp-4">
                    {docc.description}
                  </div>

                  <div className="mt-4 text-center">
                    <button
                      onClick={() => {
                        navigate(`/doctors/profile/${docc._id}`);
                        scrollTo(0, 0);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                <p>No doctors found for the selected criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Doctor by ADMIN ONLY */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] sm:w-full max-w-md text-center animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Are you sure you want to delete this doctor named{" "}
              <span className="font-bold text-red-600">
                '
                {
                  filterDoc.find((doc) => doc._id === selectedDoctorId).name
                    ?.firstName
                }{" "}
                {
                  filterDoc.find((doc) => doc._id === selectedDoctorId).name
                    ?.lastName
                }
                '
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
  );
};

export default Doctors;

{
  /*
      bg-[#29293d] 
  */
}
