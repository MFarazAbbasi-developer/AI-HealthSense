import React from "react";
import Header from "../components/Header";
import SpecialityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctors";

const Home = () => {
  return (
    <>
      <div className='flex flex-col items-center justify-center min-h-screen bg-cover bg-center'>
  
        <Header />
      <SpecialityMenu />
      </div>
      <TopDoctors />
    </>
  );
};

export default Home;
