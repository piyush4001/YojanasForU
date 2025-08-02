import React, { useEffect, useState } from "react";

const SchemeFormModal = ({ onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Delay animation to run after mount
    const timeout = setTimeout(() => setShow(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className={`bg-white rounded-xl p-6 w-full max-w-lg transform transition-all duration-300 ease-out ${
          show ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6 text-[#16355D]">
          Scheme For Me
        </h2>

        <form className="space-y-4 text-sm">
          {/* Age */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Age</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 ring-blue-400 focus:outline-none"
              placeholder="Enter your age"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Gender
            </label>
            <select className="w-full px-4 py-2 border rounded-md focus:ring-2 ring-blue-400 focus:outline-none">
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
            <select className="w-full px-4 py-2 border rounded-md focus:ring-2 ring-blue-400 focus:outline-none">
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
            <select className="w-full px-4 py-2 border rounded-md focus:ring-2 ring-blue-400 focus:outline-none">
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
            <select className="w-full px-4 py-2 border rounded-md focus:ring-2 ring-blue-400 focus:outline-none">
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
