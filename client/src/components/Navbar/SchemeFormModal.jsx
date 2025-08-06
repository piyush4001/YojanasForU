import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api";
// Assuming you have an api.js file for axios instance
const SchemeFormModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    age: "",
    income: "",
    gender: "",
    category: "",
    govType: "",
    caste: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/schemes/filter", {
        gender: formData.gender,
        category: formData.category,
        govType: formData.govType,
        caste: formData.caste,
        income: formData.income,
        // Optionally add  state, district, etc.
        page: 1,
        limit: 10,
      });

      // Redirect with response data to SchemeForMe page
      console.log("Schemes found:", res.data.data);
      localStorage.setItem("filteredSchemes", JSON.stringify(res.data.data));
      navigate("/scheme-for-me", { state: { schemes: res.data.data } });
    } catch (err) {
      console.error("Form submission failed:", err);
    }
    onClose(); // Close the modal after submission
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg transform transition-all duration-300 ease-out scale-100 opacity-100">
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6 text-[#16355D]">
          Scheme For Me
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Age */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 ring-blue-400 focus:outline-none"
              placeholder="Enter your age"
            />
          </div>
          {/* Income */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Income
            </label>
            <input
              type="number"
              name="income"
              value={formData.income}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 ring-blue-400 focus:outline-none"
              placeholder="Enter your income"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 ring-blue-400 focus:outline-none"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 ring-blue-400 focus:outline-none"
            >
              <option value="">Select category</option>
              <option value="student">Student</option>
              <option value="farmer">Farmer</option>
              <option value="job-seeker">Job Seeker</option>
              <option value="entrepreneur">Entrepreneur</option>
            </select>
          </div>

          {/* Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Selection (State or Central)
            </label>
            <select
              name="govType"
              value={formData.govType}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 ring-blue-400 focus:outline-none"
            >
              <option value="">Select one</option>
              <option value="state">State Government</option>
              <option value="central">Central Government</option>
            </select>
          </div>

          {/* Caste */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Caste
            </label>
            <select
              name="caste"
              value={formData.caste}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 ring-blue-400 focus:outline-none"
            >
              <option value="">Select caste</option>
              <option value="general">General</option>
              <option value="obc">OBC</option>
              <option value="sc">SC</option>
              <option value="st">ST</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#16355D] text-white font-medium py-2 rounded-md hover:bg-[#1f4b7f] transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchemeFormModal;
