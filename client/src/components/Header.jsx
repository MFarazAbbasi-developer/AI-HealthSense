import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";



const Header = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  return (
    // <div className="bg-blue-500 w-full h-96 flex justify-center items-center">
    <div className="w-full h-fit">
      <div className="bg-blue-50 w-full flex flex-col-reverse md:flex-row items-center justify-between px-6 sm:px-10 md:px-20 py-12 md:py-20 gap-12 md:gap-0">
        {/* Left Section */}
        <div className="text-center md:text-left max-w-xl">
          <h1 className="text-blue-900 text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            Smarter Eye Care, Powered by AI
          </h1>
          <p className="text-gray-700 text-base sm:text-lg mb-6">
            Predict eye diseases, find doctors, and get dietary advice — all in
            one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center md:justify-start">
            <button onClick={() => {navigate('/disease-predictor'); scrollTo(0, 0)}} className="bg-teal-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-teal-600 transition duration-200">
              Upload OCT image
            </button>
            <button onClick={() => {navigate('/doctors'); scrollTo(0, 0)}} className="bg-white border border-gray-300 px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition duration-200">
              Find a Doctor
            </button>
          </div>
        </div>

        {/* Right Section (Image) */}
        <div className="max-w-md w-full flex justify-center">
          <img
            src={assets.home_image}
            alt="AI Eye Care"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-6 text-center">
        <h3 className="text-2xl font-semibold text-blue-900 mb-8">
          How It Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white shadow-md p-6 rounded-md">
            <img
              src={assets.first_step}
              alt="Upload X-rays"
              className="mx-auto h-16 mb-4"
            />
            <p className="font-semibold">Upload OCT image</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-md">
            <img
              src={assets.second_step}
              alt="AI Predictions"
              className="mx-auto h-16 mb-4"
            />
            <p className="font-semibold">Get AI-based predictions</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-md">
            <img
              src={assets.third_step}
              alt="Doctor Recommendations"
              className="mx-auto h-16 mb-4"
            />
            <p className="font-semibold">
              Receive doctor & dietary recommendations
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-6 text-center">
        <h3 className="text-2xl font-semibold text-blue-900 mb-8">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white shadow-md p-6 rounded-md">
            <img
              src={assets.eye}
              alt="Doctor Recommendations"
              className="mx-auto h-16 mb-4"
            />
            <p className="font-semibold text-gray-800">Eye disease detection</p>
          </div>

          <div className="bg-white shadow-md p-6 rounded-md">
            <img
              src={assets.find_doc}
              alt="Doctor Recommendations"
              className="mx-auto h-16 mb-4"
            />
            <p className="font-semibold text-gray-800">Doctor finder</p>
          </div>

          <div className="bg-white shadow-md p-6 rounded-md">
            <img
              src={assets.diet}
              alt="Doctor Recommendations"
              className="mx-auto h-16 mb-4"
            />
            <p className="font-semibold text-gray-800">Diet Suggestion</p>
          </div>

          <div className="bg-white shadow-md p-6 rounded-md">
            <img
              src={assets.Privacy}
              alt="Doctor Recommendations"
              className="mx-auto h-16 mb-4"
            />
            <p className="font-semibold text-gray-800">Privacy</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Header;
