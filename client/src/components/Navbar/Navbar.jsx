import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SchemeFormModal from "./SchemeFormModal";
import SearchBar from "./SearchBar";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [language, setLanguage] = useState("en");
  const navigate = useNavigate();

  // Load saved language
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) setLanguage(savedLang);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "hi" : "en";
    setLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  const navLinks = [
    {
      label: language === "en" ? "Home" : "होम",
      to: "/",
    },
    {
      label: language === "en" ? "Schemes" : "योजनाएँ",
      to: "/schemes",
    },
    {
      label: language === "en" ? "About" : "परिचय",
      to: "/about",
    },
    {
      label: language === "en" ? "Contact" : "संपर्क",
      to: "/contact",
    },
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
          <div className="flex items-center space-x-3 text-sm">
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
            <button className="bg-blue-700 px-4 py-1 rounded hover:bg-blue-800">
              {language === "en" ? "Sign In" : "साइन इन"}
            </button>
          </div>
        </div>
      </nav>

      {/* Modal */}
      {showModal && <SchemeFormModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default Navbar;
