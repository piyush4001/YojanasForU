import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import Schemes from "./pages/Schemes";
import SchemeDetails from "./pages/SchemeDetails";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer/Footer";
import CategoryPage from "./pages/CategoryPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SearchResults from "./pages/SearchResults";
import Profile from "./pages/Profile";
import AuthCard from "./components/AuthCard";
import AuthPage from "./pages/AuthPage";
import EditProfile from "./components/EditProfile";
import ChatbotModal from "./components/ChatbotModal";
import { ToastContainer } from "react-toastify";
import api from "@/api";

import "react-toastify/dist/ReactToastify.css";
import SchemeForMe from "./pages/SchemesForMe";
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/users/me");

        setIsAuthenticated(res.status === 200);
      } catch (err) {
        console.log("Auth check failed:", err.message);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (loading) return null; // or show spinner

  if (!isAuthenticated) {
    return (
      <>
        <AuthCard onAuthSuccess={handleAuthSuccess} />
        <ToastContainer />
      </>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="overflow-x-hidden">
        <ChatbotModal />
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/schemes/:id" element={<SchemeDetails />} />
            <Route path="/category/:name" element={<CategoryPage />} />
            <Route path="/scheme-for-me" element={<SchemeForMe />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </>
        <ToastContainer />
      </div>
    </Router>
  );
};

export default App;
