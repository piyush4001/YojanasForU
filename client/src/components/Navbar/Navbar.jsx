// import React, { useState, useEffect, useRef } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { UserCircle2, ChevronDown } from "lucide-react";
// import SchemeFormModal from "./SchemeFormModal";
// import SearchBar from "./SearchBar";
// import logo from "../../assets/logo.png";
// import api from "@/api";
// // Assuming you have an api.js file for axios instance

// const Navbar = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [language, setLanguage] = useState("en");
//   const [user, setUser] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef();
//   const navigate = useNavigate();

//   // Fetch current user
//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const res = await api.get("/users/get-current-user");
//         setUser(res.data?.data);
//       } catch (err) {
//         setUser(null);
//         console.log(
//           "Not logged in:",
//           err.response?.data?.message || err.message
//         );
//       }
//     };

//     fetchCurrentUser();
//   }, []);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await api.post("/users/logout", {});
//       setUser(null);
//       // Redirect to login/signup page
//       navigate("/AuthCard");
//     } catch (err) {
//       console.error(
//         "Logout failed:",
//         err.response?.data?.message || err.message
//       );
//     }
//   };

//   const toggleLanguage = () => {
//     const newLang = language === "en" ? "hi" : "en";
//     setLanguage(newLang);
//     localStorage.setItem("lang", newLang);
//   };

//   const navLinks = [
//     { label: language === "en" ? "Home" : "होम", to: "/" },
//     { label: language === "en" ? "Schemes" : "योजनाएँ", to: "/schemes" },
//     { label: language === "en" ? "About" : "परिचय", to: "/about" },
//     { label: language === "en" ? "Contact" : "संपर्क", to: "/contact" },
//   ];

//   return (
//     <>
//       <nav className="bg-[#16355D] text-white shadow-md">
//         <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
//           {/* Logo + Links */}
//           <div className="flex items-center space-x-8">
//             <img src={logo} alt="Logo" className="h-10 w-auto" />
//             <ul className="hidden md:flex items-center space-x-6 text-sm font-medium">
//               {navLinks.map((link) => (
//                 <li key={link.label}>
//                   <NavLink
//                     to={link.to}
//                     className="px-2 py-1 hover:bg-[#1f4b7f] rounded block"
//                   >
//                     {link.label}
//                   </NavLink>
//                 </li>
//               ))}
//             </ul>
//           </div>
//           {/* Search Bar */}
//           <div className="hidden md:flex items-center space-x-2">
//             <SearchBar />
//           </div>

//           {/* Right Side Buttons */}
//           <div className="flex items-center space-x-3 text-sm relative">
//             <button
//               onClick={toggleLanguage}
//               className="bg-[#0E2C4D] px-3 py-1 rounded hover:bg-[#1f4b7f]"
//             >
//               {language === "en" ? "EN | HI" : "HI | EN"}
//             </button>

//             <button
//               onClick={() => setShowModal(true)}
//               className="bg-green-600 px-4 py-1 rounded hover:bg-green-700"
//             >
//               {language === "en" ? "Scheme For Me" : "मेरे लिए योजना"}
//             </button>

//             {/* User Avatar / Sign In */}
//             {user ? (
//               <div className="relative" ref={dropdownRef}>
//                 <button
//                   onClick={() => setDropdownOpen(!dropdownOpen)}
//                   className="flex items-center space-x-1 bg-blue-700 p-1 px-2 rounded hover:bg-blue-800"
//                 >
//                   {user?.avatar ? (
//                     <img
//                       src={user.avatar}
//                       alt="User Avatar"
//                       className="h-8 w-8 rounded-full object-cover border border-white"
//                     />
//                   ) : (
//                     <UserCircle2 className="h-6 w-6" />
//                   )}
//                   <ChevronDown className="h-4 w-4 text-white" />
//                 </button>

//                 {dropdownOpen && (
//                   <div className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-md overflow-hidden z-50">
//                     <button
//                       onClick={() => navigate("/profile")}
//                       className="block w-full px-4 py-2 text-left hover:bg-gray-100"
//                     >
//                       {language === "en" ? "Profile" : "प्रोफ़ाइल"}
//                     </button>
//                     <button
//                       onClick={handleLogout}
//                       className="block w-full px-4 py-2 text-left hover:bg-gray-100"
//                     >
//                       {language === "en" ? "Logout" : "लॉग आउट"}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <button
//                 onClick={() => navigate("/signin")}
//                 className="bg-blue-700 px-4 py-1 rounded hover:bg-blue-800"
//               >
//                 {language === "en" ? "Sign In" : "साइन इन"}
//               </button>
//             )}
//           </div>
//         </div>
//       </nav>
//       {/* Modal */}
//       {showModal && <SchemeFormModal onClose={() => setShowModal(false)} />}
//     </>
//   );
// };

// export default Navbar;

import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserCircle2, ChevronDown } from "lucide-react";
import SchemeFormModal from "./SchemeFormModal";
import SearchBar from "./SearchBar";
import logo from "../../assets/logo.png";
import api from "@/api";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [language, setLanguage] = useState("en");
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await api.get("/users/get-current-user");
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
      await api.post("/users/logout");
      setUser(null);
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
          {/* Left Section - Logo and Desktop Links */}
          <div className="flex items-center space-x-8">
            <img src={logo} alt="Logo" className="h-10 w-auto" />

            {/* Desktop Links */}
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

          {/* Desktop Search */}
          <div className="hidden md:flex items-center space-x-2">
            <SearchBar />
          </div>

          {/* Desktop Right Buttons */}
          <div className="hidden md:flex items-center space-x-3 text-sm relative">
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

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-1 bg-blue-700 p-1 px-2 rounded hover:bg-blue-800"
                >
                  {user.avatar ? (
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

          {/* Hamburger (Mobile Only) */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-3">
            <ul className="space-y-2 text-sm font-medium">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <NavLink
                    to={link.to}
                    className="block px-3 py-2 rounded hover:bg-[#1f4b7f]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <SearchBar />

            <div className="flex flex-col space-y-2">
              <button
                onClick={toggleLanguage}
                className="bg-[#0E2C4D] px-4 py-2 rounded hover:bg-[#1f4b7f]"
              >
                {language === "en" ? "EN | HI" : "HI | EN"}
              </button>

              <button
                onClick={() => {
                  setShowModal(true);
                  setMobileMenuOpen(false);
                }}
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
              >
                {language === "en" ? "Scheme For Me" : "मेरे लिए योजना"}
              </button>

              {user ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setMobileMenuOpen(false);
                    }}
                    className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
                  >
                    {language === "en" ? "Profile" : "प्रोफ़ाइल"}
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
                  >
                    {language === "en" ? "Logout" : "लॉग आउट"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    navigate("/signin");
                    setMobileMenuOpen(false);
                  }}
                  className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
                >
                  {language === "en" ? "Sign In" : "साइन इन"}
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Modal */}
      {showModal && <SchemeFormModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default Navbar;
