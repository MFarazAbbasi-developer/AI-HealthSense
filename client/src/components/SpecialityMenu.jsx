import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from "../context/AppContext";

const SpecialityMenu = () => {
  
  const { specialityList } = useContext(AppContext);
  
  return (
    <div id="speciality" className="py-16 px-4 sm:px-10  text-gray-800">
  {/* 🏷️ Section Heading */}
  <div className="text-center mb-10">
    <h1 className="text-3xl sm:text-4xl font-bold text-blue-900">
      Find Doctors by Speciality
    </h1>
    <p className="text-gray-500 mt-2 text-sm sm:text-base">
      Browse doctors based on their specialization and expertise.
    </p>
  </div>

  {/* 🔍 Speciality Cards Grid */}
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
    {specialityList.map((element, index) => (
      <Link
        to={`/doctors/${element}`}
        onClick={() => scrollTo(0, 0)}
        key={index}
        className="group flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      >
        <img
          className="w-16 sm:w-20 h-16 sm:h-20 object-contain mb-3 transition-transform duration-300 group-hover:scale-110"
          src={assets[element.replace(" ", "_")]}
          alt={element}
        />
        <p className="text-sm sm:text-base text-center font-medium text-gray-700 group-hover:text-blue-700">
          {element}
        </p>
      </Link>
    ))}
  </div>
</div>

  )
}

export default SpecialityMenu