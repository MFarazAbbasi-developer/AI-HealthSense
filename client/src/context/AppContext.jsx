import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

// doctors
// import { doctors } from "../assets/assets2/assets";


export const AppContext = createContext(); 

export const AppProvider = (props) => {

    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(false);

    // Doctors
    const [doctors, setDoctors] = useState([])
    const [specialityList, setSpecialityList] = useState([])
    const [cityList, setCityList] = useState([])
    const getAllDoctors = async () => {
        try {
            
            const {data} = await axios.get(`${backendUrl}/api/admin/all-doctors`, {withCredentials: true})

            if (data.success) {
                setDoctors(data.doctors)
                // console.log(data.doctors[3].consultationFee.amount)

                // For specialization filter
                const allSpecializations = data.doctors.map((doctor) => doctor.specialization);
                setSpecialityList([...new Set(allSpecializations)])

                // For City filter
                const allCities = data.doctors.map((doctor) => doctor.clinicAddress?.city);
                setCityList([...new Set(allCities)].sort())
                // console.log([...new Set(allCities)])

            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }
    useEffect(() => {
        getAllDoctors()
      }, [])







    const getAuthState = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/auth/is-auth`);
            if (data.success) {
                setIsLoggedin(true)
                getUserData()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getUserData = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/user/data`);
            data.success ? setUserData(data.userData) : toast.error(data.message);

        } catch (error) {
            toast.error(error.message)
        }
    }


    

    useEffect(() => {
        getAuthState();
    }, [])



    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData,
        doctors,
        specialityList,
        cityList,
        getAllDoctors
    }


  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}