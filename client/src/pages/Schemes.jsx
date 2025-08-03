import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import SchemeCard from "../components/SchemeCard";
import axios from "axios";

const Schemes = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [govType, setGovType] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);

  // 👇 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const schemesPerPage = 3;

  useEffect(() => {
    const fetchSchemes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post(
          "http://localhost:8000/api/v1/schemes/filter",
          {
            type: govType !== "all" ? govType : undefined,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const fetched = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        setSchemes(fetched);

        const allCategories = new Set();
        fetched.forEach((scheme) => {
          scheme.category?.forEach((cat) => allCategories.add(cat));
        });
        setAvailableCategories(Array.from(allCategories));
      } catch (err) {
        console.error(err);
        setError("Failed to fetch schemes");
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, [govType]);

  // 👇 Filtered based on selected category
  const filteredSchemes =
    selectedCategory === "all"
      ? schemes
      : schemes.filter((scheme) => scheme.category?.includes(selectedCategory));

  const selectedCategoryName =
    selectedCategory === "all"
      ? "All Categories"
      : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);

  // 👇 Pagination logic
  const indexOfLastScheme = currentPage * schemesPerPage;
  const indexOfFirstScheme = indexOfLastScheme - schemesPerPage;
  const currentSchemes = filteredSchemes.slice(
    indexOfFirstScheme,
    indexOfLastScheme
  );
  const totalPages = Math.ceil(filteredSchemes.length / schemesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        All Government Schemes
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
        {/* Category Dropdown */}
        <div className="relative w-60">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center justify-between gap-2 px-5 py-2 bg-white text-gray-800 rounded-lg shadow-md hover:shadow-lg border w-full"
          >
            <span className="truncate">{selectedCategoryName}</span>
            <ChevronDown
              className={`transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              size={18}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full mt-2 bg-white shadow-lg rounded-lg border w-full z-10 animate-fade-in max-h-80 overflow-y-auto">
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setDropdownOpen(false);
                  setCurrentPage(1); // reset page
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 ${
                  selectedCategory === "all" ? "bg-gray-100 font-semibold" : ""
                }`}
              >
                🌐 All Categories
              </button>
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setDropdownOpen(false);
                    setCurrentPage(1); // reset page
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 ${
                    selectedCategory === cat ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Government Type Filter */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border shadow-sm">
          {["all", "central", "state"].map((type) => (
            <button
              key={type}
              onClick={() => {
                setGovType(type);
                setCurrentPage(1); // reset page
              }}
              className={`px-3 py-1 rounded-full text-sm capitalize transition ${
                govType === type
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {type === "all" ? "All" : type}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading schemes...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredSchemes.length === 0 ? (
        <p className="text-center text-gray-500">
          No schemes found for this filter.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in">
            {currentSchemes.map((scheme) => (
              <SchemeCard key={scheme._id || scheme.id} scheme={scheme} />
            ))}
          </div>

          {/* Pagination with Previous/Next */}
          <div className="mt-10 flex justify-center items-center gap-2 flex-wrap">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md border ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded-md border ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md border ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Schemes;
