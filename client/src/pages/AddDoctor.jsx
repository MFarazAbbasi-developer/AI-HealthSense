import React, { useContext, useState } from "react";
import { assets2 } from "../assets/assets2/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [education, setEducation] = useState("");
  const [description, setDescription] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");

  const { backendUrl } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (!docImg) {
        return toast.error("Image not selected");
      }

      const formData = new FormData();

      formData.append("doctorImageUrl", docImg);
      formData.append("name", name);
      formData.append("specialization", specialization);
      formData.append("consultationFee", JSON.stringify({ amount, currency }));
      formData.append("education", education);
      formData.append("description", description);
      formData.append(
        "clinicAddress",
        JSON.stringify({ street, state, city, zipCode, country })
      );

      formData.forEach((value, key) => {
        console.log(`${key} : ${value}`);
      });

      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formData
      );

      if (data.success) {
        toast.success(data.message);

        setDocImg(false);
        setName("");
        setSpecialization("");
        setAmount("");
        setCurrency("");
        setEducation("");
        setDescription("");
        setStreet("");
        setCity("");
        setState("");
        setZipCode("");
        setCountry("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmitHandler} className="m-5 w-full">
        <p className="mb-3 text-lg font-medium">Add Doctor</p>

        <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh]">
          <div className="flex items-center gap-4 mb-8 text-gray-500">
            <label htmlFor="doc-img">
              <img
                className="w-16 bg-gray-100 rounded-full cursor-pointer"
                src={docImg ? URL.createObjectURL(docImg) : assets2.upload_area}
                alt=""
              />
            </label>
            <input
              onChange={(e) => setDocImg(e.target.files[0])}
              type="file"
              name=""
              id="doc-img"
              hidden
            />
            <p>
              Upload doctor <br /> picture
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
            <div className="w-full lg:flex-1 flex flex-col gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <p>Doctor Name</p>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="border rounded px-3 py-2"
                  type="text"
                  placeholder="Name"
                  required
                />
              </div>

              {/* <div>
                        <p>Doctor Email</p>
                        <input type="email" placeholder='Email' required />
                    </div> */}

              <div className="flex-1 flex flex-col gap-1">
                <p>Doctor Specialization</p>
                <input
                  onChange={(e) => setSpecialization(e.target.value)}
                  value={specialization}
                  className="border rounded px-3 py-2"
                  type="text"
                  placeholder="Specialization"
                  required
                />
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <p>Consultation Fees</p>
                <input
                  onChange={(e) => setAmount(e.target.value)}
                  value={amount}
                  className="border rounded px-3 py-2"
                  type="text"
                  placeholder="Amount"
                  required
                />
                <input
                  onChange={(e) => setCurrency(e.target.value)}
                  value={currency}
                  className="border rounded px-3 py-2"
                  type="text"
                  placeholder="Currency"
                  required
                />
              </div>
            </div>
            <div className="w-full lg:flex-1 flex flex-col gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <p>Address</p>
                <input
                  onChange={(e) => setStreet(e.target.value)}
                  value={street}
                  className="border rounded px-3 py-2"
                  type="text"
                  placeholder="Street"
                  required
                />
                <input
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
                  className="border rounded px-3 py-2"
                  type="text"
                  placeholder="City"
                  required
                />
                <input
                  onChange={(e) => setState(e.target.value)}
                  value={state}
                  className="border rounded px-3 py-2"
                  type="text"
                  placeholder="State"
                  required
                />
                <input
                  onChange={(e) => setZipCode(e.target.value)}
                  value={zipCode}
                  className="border rounded px-3 py-2"
                  type="text"
                  placeholder="Zip Code"
                  required
                />
                <input
                  onChange={(e) => setCountry(e.target.value)}
                  value={country}
                  className="border rounded px-3 py-2"
                  type="text"
                  placeholder="Country"
                  required
                />
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <p>Doctor Education</p>
                <input
                  onChange={(e) => setEducation(e.target.value)}
                  value={education}
                  className="border rounded px-3 py-2"
                  type="text"
                  placeholder="Education"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <p className="mt-4  mb-2">Doctor Description</p>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="w-full px-4 pt-2 border rounded"
              placeholder="Write about doctor"
              rows={5}
              required
            />
          </div>

          <button
            type="Submit"
            className="bg-[#333A5C] px-10 py-3 mt-4 text-white rounded-full"
          >
            Add Doctor
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
