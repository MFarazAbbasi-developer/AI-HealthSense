import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const MyProfile = () => {

  const {userData} = useContext(AppContext)


  const [userInfo, setUserInfo] = useState({
    name: "Muhammad Faraz",
    image: "",
    email: "",
    phone: "",
    address: { line1: "", line2: "" },
    gender: "",
    dob: "",
  });

  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm">
      <img className="w-36 rounded" src={userInfo.img} alt="" />

      {isEdit ? (
        <input
          className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
          type="text"
          value={userData.name}
          onChange={(e) =>
            setUserInfo((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">{userData.name}</p>
      )}

      <hr className="bg-zinc-400 h-[1px] border-none" />
      <div>
        <p className="text-neutral-500 underline mt-3">Contact Information</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Email id:</p>
          <p className="text-blue-500">{userInfo.email}</p>
          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
            className="bg-gray-100 max-w-52"
              type="text"
              value={userInfo.phone}
              onChange={(e) =>
                setUserInfo((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          ) : (
            <p className="text-blue-400">{userInfo.phone}</p>
          )}

          <p className="font-medium">Address:</p>
          {isEdit ? (
            <p className="bg-gray-50">
              <input
                className="bg-gray-50"
                type="text"
                value={userInfo.address.line1}
                onChange={(e) =>
                  setUserInfo((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
              />
              <br />
              <input
                className="bg-gray-50"
                type="text"
                value={userInfo.address.line2}
                onChange={(e) =>
                  setUserInfo((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
              />
            </p>
          ) : (
            <p className="text-gray-500">
              {userInfo.address.line1}
              <br />
              {userInfo.address.line2}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              className="max-w-20 bg-gray-100"
              onChange={(e) =>
                setUserInfo((prev) => ({ ...prev, gender: e.target.value }))
              }
              value={userInfo.gender}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-400">{userInfo.gender}</p>
          )}

          <p className="font-medium">Birthday:</p>
          {isEdit ? (
            <input
              className="max-w-28 bg-gray-100"
              type="date"
              value={userInfo.dob}
              onChange={(e) =>
                setUserInfo((prev) => ({ ...prev, dob: e.target.value }))
              }
            />
          ) : (
            <p className="text-gray-400">{userInfo.dob}</p>
          )}
        </div>
      </div>


      <div className="mt-10">
        {
          isEdit
          ? <button className="border border-[#333A5C] px-8 py-2 rounded-full hover:bg-[#333A5C] hover:text-white transition-all" onClick={()=> setIsEdit(false)}>Save Information</button>
          : <button className="border border-[#333A5C] px-8 py-2 rounded-full hover:bg-[#333A5C] hover:text-white transition-all" onClick={()=> setIsEdit(true)}>Edit</button>
        }

      </div>
    </div>
  );
};

export default MyProfile;
