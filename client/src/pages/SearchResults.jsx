import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SchemeCard from "../components/SchemeCard";
import axios from "axios";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:8000/api/v1/schemes/filter",
          {},
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const allSchemes = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        // Match query (case insensitive)
        const filtered = allSchemes.filter(
          (scheme) =>
            scheme.title?.toLowerCase().includes(query.toLowerCase()) ||
            scheme.description?.toLowerCase().includes(query.toLowerCase())
        );

        setResults(filtered);
      } catch (err) {
        console.error("Search failed:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Search results for: <span className="text-blue-600">"{query}"</span>
      </h1>

      {loading ? (
        <p className="text-gray-500 text-center">Searching...</p>
      ) : results.length === 0 ? (
        <p className="text-center text-gray-400">No schemes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.map((scheme) => (
            <SchemeCard key={scheme._id || scheme.id} scheme={scheme} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
