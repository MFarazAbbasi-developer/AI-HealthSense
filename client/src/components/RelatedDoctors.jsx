import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { FaStar, FaMapMarkerAlt, FaUserMd, FaTrashAlt } from "react-icons/fa";

const RelatedDoctors = (props) => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  const [relDoc, setRelDoc] = useState([]);

  useEffect(() => {
    if (doctors.length > 0 && props.speciality && props.docId) {
      setRelDoc(
        doctors.filter(
          (doc) =>
            props.docId !== doc._id && doc.specialization === props.speciality
        )
      );
    }
  }, [props.speciality, props.docId, doctors]);

  return (
    relDoc.length > 0 && (
      <div className="bg-white mt-10 p-6 rounded-3xl shadow-xl border border-gray-300">
        <h3 className="text-2xl sm:text-3xl font-bold text-blue-600 text-center mb-8">
          Related Doctors
        </h3>
        <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 gap-y-6">
          {relDoc.length > 0 &&
            relDoc.slice(0, 6).map((docc, index) => (
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
                    <div
                      className={`mt-1 text-xs font-medium flex items-center gap-2 ${
                        props.checkDoctorAvailability(docc)
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          props.checkDoctorAvailability(docc)
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      {props.checkDoctorAvailability(docc)
                        ? "Available"
                        : "Unavailable"}
                    </div>
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
            ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => {
              navigate(`/doctors/${props.speciality}`);
              scrollTo(0, 0);
            }}
            className="text-sm sm:text-base text-blue-600 hover:underline font-semibold transition cursor-pointer"
          >
            See more
          </button>
        </div>
      </div>
    )
  );
};

export default RelatedDoctors;
