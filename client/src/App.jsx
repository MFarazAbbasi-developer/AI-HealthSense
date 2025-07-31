import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import Doctors from './pages/Doctors'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DoctorProfile from './pages/DoctorProfile'
import AddDoctor from './pages/AddDoctor'
import DiseasePredictor from './pages/DiseasePredictor'
import EditDocProfile from './pages/EditDocProfile'
import AdminLogin from './pages/AdminLogin'


const App = () => {
  return (
    <div className='bg-gray-50'>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />


        {/* Doctor Routes */}
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/doctors/profile/:docId' element={<DoctorProfile />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile />} />

        <Route path='/add-doctor' element={<AddDoctor />} />
        <Route path='/doctors/fees/:fees' element={<Doctors />} />
        <Route path='/disease-predictor' element={<DiseasePredictor />} />
        
        <Route path='/edit/profile/:docId' element={<EditDocProfile />} />

        {/* Admin Login */}
        <Route path="/admin-portal-login" element={<AdminLogin />} />

      </Routes>

      <Footer />
    </div>
  )
}

export default App
