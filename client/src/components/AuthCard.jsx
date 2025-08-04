import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const AuthCard = ({ onAuthSuccess }) => {
  const [authMode, setAuthMode] = useState("register");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNo: "",
    username: "",
    password: "",
  });
  const isRegister = authMode === "register";

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister
      ? "http://localhost:8000/api/v1/users/register"
      : "http://localhost:8000/api/v1/users/login";

    try {
      const res = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      toast.success(
        isRegister ? "Registered successfully!" : "Logged in successfully!"
      );
      if (onAuthSuccess) onAuthSuccess(); // Call parent handler
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong"
      );
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 py-2 px-2${
        !isRegister ? " md:items-start md:pt-32" : ""
      }`}
    >
      <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-blue-100">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setAuthMode("register")}
            className={`px-4 py-2 font-medium ${
              isRegister
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            Register
          </button>
          <button
            onClick={() => setAuthMode("login")}
            className={`px-4 py-2 font-medium ${
              !isRegister
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </>
          )}

          <input
            type="text"
            name="phoneNo"
            placeholder="Phone No"
            value={formData.phoneNo}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthCard;
