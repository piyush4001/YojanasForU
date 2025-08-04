import React, { use, useEffect, useState } from "react";
import axios from "axios";
import { avatarOptions } from "../utils/avatarOptions";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    phoneNo: "",
    avatar: "",
    gender: "",
    category: "",
    income: "",
    state: "",
    district: "",
  });
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.state) {
      // Fetch districts data when state changes
      axios
        .get(
          "https://api.data.gov.in/resource/37231365-78ba-44d5-ac22-3deec40b9197",
          {
            params: {
              "api-key":
                "579b464db66ec23bdd000001a4aeda66a76a4b6f659d40e02dc93e83", // 🔑 Replace with actual API key
              format: "json",
              "filters[state_name_english]": formData.state,
              limit: 100,
            },
          }
        )
        .then((res) => {
          setDistricts(res.data.records);
        })
        .catch((err) => {
          console.error("Failed to fetch districts data:", err);
        });
    }
  }, [formData.state]);

  // Fetch current user data on mount
  useEffect(() => {
    // Fetch states data from the API
    axios
      .get(
        "https://api.data.gov.in/resource/a71e60f0-a21d-43de-a6c5-fa5d21600cdb",
        {
          params: {
            "api-key":
              "579b464db66ec23bdd000001a4aeda66a76a4b6f659d40e02dc93e83", // 🔑 Replace with actual API key
            format: "json",
            limit: 100,
          },
        }
      )
      .then((res) => {
        setStates(res.data.records);
      })
      .catch((err) => {
        console.error("Failed to fetch states data:", err);
      });

    axios
      .get("/api/v1/users/get-current-user", { withCredentials: true })
      .then((res) => {
        const {
          fullname,
          phoneNo,
          avatar,
          gender,
          category,
          income,
          state,
          district,
        } = res.data.data;

        setFormData({
          fullname: fullname || "",
          phoneNo: phoneNo || "",
          avatar: avatar || "",
          gender: gender || "",
          category: category || "",
          income: income || "",
          state: state || "",
          district: district || "",
        });
      })
      .catch(() => {
        setError("Failed to load user data");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarSelect = (url) => {
    setFormData((prev) => ({ ...prev, avatar: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await axios.patch(
        "/api/v1/users/profile",
        { ...formData },
        { withCredentials: true }
      );
      navigate("/profile");
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="p-4 text-gray-600 dark:text-gray-300">Loading...</div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 w-full max-w-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
          Edit Your Profile
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Fullname */}
        <div>
          <label className="block text-gray-600 dark:text-gray-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-gray-600 dark:text-gray-300 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-gray-600 dark:text-gray-300 mb-1">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-600 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            <option value="">Select category</option>
            <option value="general">General</option>
            <option value="obc">OBC</option>
            <option value="sc">SC</option>
            <option value="st">ST</option>
          </select>
        </div>

        {/* Income */}
        <div>
          <label className="block text-gray-600 dark:text-gray-300 mb-1">
            Annual Income (INR)
          </label>
          <input
            type="number"
            name="income"
            value={formData.income}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-gray-600 dark:text-gray-300 mb-1">
            State
          </label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            <option value="">Select state</option>
            {states.map((state) => (
              <option key={state.state_code} value={state.state_name_english}>
                {state.state_name_english}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block text-gray-600 dark:text-gray-300 mb-1">
            District
          </label>
          <select
            value={formData.district}
            onChange={(e) =>
              setFormData({ ...formData, district: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            <option value="">Select District</option>
            {districts.map((d, index) => (
              <option key={index} value={d.district_name_english}>
                {d.district_name_english}
              </option>
            ))}
          </select>
        </div>
        {/* Avatar Selection */}
        <div>
          <label className="block text-gray-600 dark:text-gray-300 mb-2">
            Choose an Avatar
          </label>
          <div className="flex flex-wrap gap-3">
            {avatarOptions.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`avatar-${idx}`}
                onClick={() => handleAvatarSelect(url)}
                className={`w-16 h-16 rounded-full cursor-pointer ring-4 transition ${
                  formData.avatar === url
                    ? "ring-blue-500 scale-110"
                    : "ring-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 rounded-lg text-white ${
              submitting
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
