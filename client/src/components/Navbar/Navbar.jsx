import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserCircle2, ChevronDown } from "lucide-react";
import SchemeFormModal from "./SchemeFormModal";
import SearchBar from "./SearchBar";
import logo from "../../assets/logo.png";
import axios from "axios";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [language, setLanguage] = useState("en");
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get("/api/v1/users/get-current-user", {
          withCredentials: true,
        });
        setUser(res.data?.data);
      } catch (err) {
        setUser(null);
        console.log(
          "Not logged in:",
          err.response?.data?.message || err.message
        );
      }
    };

    fetchCurrentUser();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/users/logout", {}, { withCredentials: true });
      setUser(null);
      // Redirect to login/signup page
      navigate("/AuthCard");
    } catch (err) {
      console.error(
        "Logout failed:",
        err.response?.data?.message || err.message
      );
    }
  };

  const toggleLanguage = () => {
    const newLang = language === "en" ? "hi" : "en";
    setLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  const navLinks = [
    { label: language === "en" ? "Home" : "होम", to: "/" },
    { label: language === "en" ? "Schemes" : "योजनाएँ", to: "/schemes" },
    { label: language === "en" ? "About" : "परिचय", to: "/about" },
    { label: language === "en" ? "Contact" : "संपर्क", to: "/contact" },
  ];

  return (
    <>
      <nav className="bg-[#16355D] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo + Links */}
          <div className="flex items-center space-x-8">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
            <ul className="hidden md:flex items-center space-x-6 text-sm font-medium">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <NavLink
                    to={link.to}
                    className="px-2 py-1 hover:bg-[#1f4b7f] rounded block"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-2">
            <SearchBar />
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-3 text-sm relative">
            <button
              onClick={toggleLanguage}
              className="bg-[#0E2C4D] px-3 py-1 rounded hover:bg-[#1f4b7f]"
            >
              {language === "en" ? "EN | HI" : "HI | EN"}
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 px-4 py-1 rounded hover:bg-green-700"
            >
              {language === "en" ? "Scheme For Me" : "मेरे लिए योजना"}
            </button>

            {/* User Avatar / Sign In */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-1 bg-blue-700 p-1 px-2 rounded hover:bg-blue-800"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="User Avatar"
                      className="h-8 w-8 rounded-full object-cover border border-white"
                    />
                  ) : (
                    <UserCircle2 className="h-6 w-6" />
                  )}
                  <ChevronDown className="h-4 w-4 text-white" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-md overflow-hidden z-50">
                    <button
                      onClick={() => navigate("/profile")}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      {language === "en" ? "Profile" : "प्रोफ़ाइल"}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      {language === "en" ? "Logout" : "लॉग आउट"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/signin")}
                className="bg-blue-700 px-4 py-1 rounded hover:bg-blue-800"
              >
                {language === "en" ? "Sign In" : "साइन इन"}
              </button>
            )}
          </div>
        </div>
      </nav>
      {/* Modal */}
      {showModal && <SchemeFormModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default Navbar;
