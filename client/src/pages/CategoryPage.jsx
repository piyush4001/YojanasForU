import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SchemeCard from "../components/SchemeCard";

const CategoryPage = () => {
  const { name } = useParams();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `http://localhost:8000/api/v1/schemes/category/${name}`
        );
        setSchemes(response.data?.data || []);
        console.log("Fetched schemes:", response.data?.data);
      } catch (err) {
        console.error("Error fetching category schemes:", err);
        setError("Failed to fetch schemes");
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, [name]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 capitalize mb-6">
        {name.replace(/[-&]/g, " ")} Schemes
      </h1>

      {schemes.length === 0 ? (
        <div className="text-gray-600">No schemes found in this category.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {schemes.map((scheme) => (
            <SchemeCard key={scheme._id} scheme={scheme} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
