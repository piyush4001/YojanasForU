import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import Schemes from "./pages/Schemes";
import SchemeDetails from "./pages/SchemeDetails";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer/Footer";
import CategoryPage from "./pages/CategoryPage";
import Category from "./pages/category";
import CategoryDetail from "./pages/CategoryDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SearchResults from "./pages/SearchResults";

import ProtectedRoute from "./components/ProtectedRoute";

import { ToastContainer } from "react-toastify";

import axios from "axios"; // Add this import

<Route path="/contact" element={<Contact />} />;

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/users/me", {
          withCredentials: true,
        });

        if (res.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.log("Auth check failed:", err.message);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handler to be called after successful login/register
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (loading) return null; // Or a spinner

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
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/scheme/:id" element={<SchemeDetails />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/category" element={<Category />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/category/:id" element={<CategoryDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
