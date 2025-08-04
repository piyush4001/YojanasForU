import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allSchemes, setAllSchemes] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchAllSchemes = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/v1/schemes/filter",
          {},
          { headers: { "Content-Type": "application/json" } }
        );

        const data = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setAllSchemes(data);
      } catch (error) {
        console.error("Error fetching schemes:", error);
      }
    };

    fetchAllSchemes();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSuggestions([]);
      return;
    }

    const matches = allSchemes
      .filter((scheme) =>
        scheme.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5); // Limit to top 5 suggestions

    setSuggestions(matches);
    setShowSuggestions(true);
  }, [searchQuery, allSchemes]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (title) => {
    setSearchQuery(title);
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(title)}`);
  };

  return (
    <div className="relative text-gray-600 hidden md:block w-64">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search schemes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
        className="bg-white h-10 px-10 pr-4 rounded-full text-sm focus:outline-none border border-gray-300 w-full transition-all duration-300 focus:ring-2 focus:ring-blue-500"
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-20 mt-1 bg-white shadow-lg rounded-md border w-full max-h-60 overflow-y-auto">
          {suggestions.map((scheme) => (
            <div
              key={scheme._id || scheme.id}
              onClick={() => handleSuggestionClick(scheme.title)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
            >
              {scheme.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
