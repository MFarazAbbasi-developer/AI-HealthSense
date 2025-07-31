import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { FaStar, FaMapMarkerAlt, FaUserMd } from "react-icons/fa";

const TopDoctors = () => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  const [relDoc, setRelDoc] = useState([]);

  useEffect(() => {
    if (doctors.length > 0) {
      setRelDoc(doctors.filter((doc) => doc.rating >= 4.0));
    }
  }, [doctors]);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <div className="text-center px-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
          Our Best Doctors
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Simply browse through our extensive list of trusted doctors.
        </p>
      </div>

      <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 pt-5 gap-y-6 px-8 sm:px-0">
        {relDoc.slice(0, 8).map((docc, index) => (
          <div
            key={index}
            className="bg-white border border-gray-300 rounded-2xl shadow-md p-5 relative transition-all hover:shadow-xl hover:-translate-y-1 max-w-[400px]"
          >
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
              </div>
            </div>

            <div className="mt-4 flex justify-between text-sm">
              <div>
                <p className="text-gray-500">Experience</p>
                <p className="font-semibold">{docc.experienceYears} yrs</p>
              </div>
              <div>
                <p className="text-gray-500">Fee</p>
                <p className="font-semibold">
                  {docc.consultationFee.currency} {docc.consultationFee.amount}
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
        ))}
      </div>
      <div className="text-center mt-8">
        <button
          onClick={() => {
            navigate("/doctors");
            scrollTo(0, 0);
          }}
          className="text-sm sm:text-base text-blue-600 hover:underline font-semibold transition cursor-pointer"
        >
          See more
        </button>
      </div>
    </div>
  );
};

export default TopDoctors;
