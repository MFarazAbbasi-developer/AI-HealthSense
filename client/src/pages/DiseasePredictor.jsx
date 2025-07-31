import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaLeaf,
  FaAppleAlt,
  FaCarrot,
  FaTimesCircle,
  FaEye,
  FaNotesMedical,
  FaExclamationTriangle,
  FaStethoscope,
  FaInfoCircle,
  FaUserMd,
} from "react-icons/fa";
import { AppContext } from "../context/AppContext";

import { FaStar, FaMapMarkerAlt } from "react-icons/fa";

const DiseasePredictor = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [confidence, setConfidence] = useState();

  const [diseaseData] = useState({
    CNV: {
      diagnosis: "Choroidal Neovascularization (CNV)",
      description:
        "CNV occurs when abnormal blood vessels grow under the retina and leak fluid or blood, leading to vision distortion or loss.",
      symptoms: [
        "Blurred vision",
        "Distorted central vision",
        "Dark or empty areas in vision",
      ],
      recommendedActions: [
        "Consult a retina specialist promptly.",
        "Get Optical Coherence Tomography (OCT) imaging done.",
        "Consider anti-VEGF injections as advised.",
      ],
      dietInclude: [
        "Leafy greens",
        "Fatty fish (e.g., salmon)",
        "Nuts and seeds",
        "Citrus fruits",
      ],
      dietAvoid: ["High-fat fried foods", "Sugary drinks", "Processed snacks"],
      note: "This is an AI-generated result. Please consult a qualified eye care professional for accurate diagnosis.",
    },
    DME: {
      diagnosis: "Diabetic Macular Edema (DME)",
      description:
        "DME is caused by fluid accumulation in the macula due to leaking blood vessels in diabetic patients, affecting central vision.",
      symptoms: [
        "Blurred or wavy vision",
        "Difficulty seeing colors",
        "Reduced central vision",
      ],
      recommendedActions: [
        "Control blood sugar levels strictly.",
        "Consult an ophthalmologist for evaluation.",
        "Undergo OCT and consider laser or injection therapy.",
      ],
      dietInclude: [
        "Whole grains",
        "Leafy vegetables",
        "Lean protein",
        "Legumes",
        "Low-GI fruits",
      ],
      dietAvoid: [
        "Refined sugar",
        "White bread",
        "Sugary snacks",
        "High-fat fast foods",
      ],
      note: "DME requires urgent medical attention and diabetes management.",
    },
    DRUSEN: {
      diagnosis: "Drusen (Early Age-Related Macular Degeneration)",
      description:
        "Drusen are yellow deposits under the retina and may indicate early stages of AMD, which can affect central vision over time.",
      symptoms: [
        "Mild blurriness",
        "Difficulty seeing in low light",
        "Visual distortion (in later stages)",
      ],
      recommendedActions: [
        "Schedule regular eye exams with a retina specialist.",
        "Monitor vision changes using an Amsler grid.",
        "Take AREDS2 supplements if recommended.",
      ],
      dietInclude: [
        "Carrots",
        "Spinach",
        "Kale",
        "Orange and yellow fruits",
        "Fish rich in omega-3",
      ],
      dietAvoid: [
        "Fried foods",
        "High-cholesterol diets",
        "Smoking (to be avoided completely)",
      ],
      note: "Early intervention and lifestyle changes can slow AMD progression.",
    },
    NORMAL: {
      diagnosis: "Normal Retina",
      description:
        "No signs of retinal diseases were detected. Vision appears to be healthy based on the OCT scan.",
      symptoms: ["No symptoms detected"],
      recommendedActions: [
        "Maintain routine annual eye checkups.",
        "Protect eyes from UV exposure and digital strain.",
        "Continue a balanced, eye-friendly diet.",
      ],
      dietInclude: [
        "Mixed vegetables",
        "Vitamin A-rich foods",
        "Hydrating fruits",
        "Omega-3 fatty acids",
      ],
      dietAvoid: [],
      note: "Maintain a healthy lifestyle and keep monitoring eye health periodically.",
    },
  });

  const [resultt, setResultt] = useState();
  const { doctors } = useContext(AppContext);
  const [eyeDoctors, setEyeDoctors] = useState([]);

  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImage(URL.createObjectURL(e.target.files[0]));
  };
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

  const [invalidImage, setInvalidImage] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!file) {console.log("first"); return};

    const formData = new FormData();
    formData.append("file", file); // Flask expects "file" key

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: false,
        }
      );
      if (
        response.data.prediction ===
        "Uncertain - please upload a valid eye X-ray."
      ) {
        setInvalidImage(true);
      } else {
        setInvalidImage(false);
      }
      setResult(`${response.data.prediction}`);
      setResultt(diseaseData[response.data.prediction]);

      setConfidence(response.data.confidence);

      // Doctor Recommendation Logic
      const recommendedSpeciality = "Ophthalmologist"; // Assuming we always recommend ophthalmology
      const recommendedDoctors = doctors.filter(
        (doctor) => doctor.specialization === recommendedSpeciality
      );
      setEyeDoctors(recommendedDoctors);
    } catch (error) {
      console.error("Prediction error:", error);
      setResult("Error occurred while predicting.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {}, [doctors]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 gap-10">
      <div className="w-full max-w-4xl bg-white shadow-2xl border border-gray-200 rounded-3xl p-8 sm:p-12 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4 flex justify-center items-center gap-2">
          👁️ AI-Powered Eye Disease Predictor
        </h1>
        <p className="text-gray-600 mb-8 text-sm sm:text-base leading-relaxed">
          Upload OCT image and let our AI assist in identifying
          potential eye diseases with intelligent insights.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition"
          />
          <button
            type="submit"
            disabled={!file || loading}
            className="bg-indigo-600 text-white py-2 px-6 sm:px-8 rounded-full text-sm sm:text-base font-semibold hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing..." : "Predict"}
          </button>
        </form>
      </div>

      {/* Result */}
      {invalidImage === true && (
        <div className="w-full max-w-4xl bg-white shadow-2xl border border-gray-200 rounded-3xl p-6 sm:p-10">
          <div className="max-w-md mx-auto p-4 text-center">
            <div className="bg-red-100 text-red-700 p-3 rounded-md border border-red-300">
              <p className="text-lg font-medium">Unable to Predict</p>
              <p className="text-sm">Please upload a clearer image.</p>
            </div>
          </div>
        </div>
      )}
      {resultt && (
        <div className="w-full max-w-4xl bg-white shadow-2xl border border-gray-200 rounded-3xl p-6 sm:p-10">
          {/* Diagnosis */}
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2 flex justify-center items-center">
              <FaExclamationTriangle className="mr-2 shrink-0" />
              Diagnosis Result: {resultt.diagnosis}
            </h2>
            <h3 className="text-lg font-semibold text-blue-800 flex items-center justify-center">
              <FaEye className="mr-2 shrink-0" />
              Condition Overview
            </h3>
            <p className="text-gray-700 mt-2 text-sm sm:text-base">
              {resultt.description}
            </p>
          </div>

          {/* Recommended Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-blue-800 flex items-center mb-2">
              <FaStethoscope className="mr-2 shrink-0" />
              Recommended Medical Action
            </h3>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              {resultt.recommendedActions.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Symptoms */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-blue-800 flex items-center mb-2">
              <FaNotesMedical className="mr-2 shrink-0" />
              Common Symptoms
            </h3>
            <ul className="list-disc list-inside text-gray-800 space-y-1 ml-4">
              {resultt.symptoms.map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </ul>
          </div>

          {/* Dietary Guidance */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
              <FaLeaf className="mr-2 shrink-0" />
              Dietary Guidance for {resultt.diagnosis}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-green-600 font-semibold flex items-center mb-2">
                  <FaCheckCircle className="mr-2" /> Foods to Include:
                </h4>
                <ul className="text-gray-800 text-sm space-y-1">
                  {resultt.dietInclude.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <FaCheckCircle className="text-green-500 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {resultt.dietAvoid.length > 0 && (
                <div>
                  <h4 className="text-red-600 font-semibold flex items-center mb-2">
                    <FaTimesCircle className="mr-2" />
                    Foods to Avoid:
                  </h4>
                  <ul className="text-gray-800 text-sm space-y-1">
                    {resultt.dietAvoid.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <FaTimesCircle className="text-red-500 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Note */}
          <div className="bg-gray-100 p-4 rounded-lg flex items-start text-sm sm:text-base">
            <FaInfoCircle className="text-blue-500 mr-3 mt-1 shrink-0" />
            <p>
              <strong>Note:</strong> {resultt.note}
            </p>
          </div>

          {/* Recommended Doctors */}
          {eyeDoctors.length > 0 && resultt.diagnosis !== "Normal Retina" && (
            <div className="mt-10">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                <FaStethoscope className="mr-2" />
                Recommended Eye Specialists
              </h3>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {eyeDoctors.slice(5, 11).map((docc, index) => (
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
                ))}
              </div>
              <div className="text-center mt-8">
                <button
                  onClick={() => {
                    navigate(`/doctors/Ophthalmologist`);
                    scrollTo(0, 0);
                  }}
                  className="text-sm sm:text-base text-blue-600 hover:underline font-semibold transition cursor-pointer"
                >
                  See more
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiseasePredictor;
