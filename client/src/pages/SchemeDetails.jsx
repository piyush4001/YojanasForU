// src/pages/SchemeDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SchemeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScheme = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/schemes/${id}`
        );
        setScheme(res.data.scheme);
      } catch (err) {
        console.error(err);
        setError("Failed to load scheme details");
      } finally {
        setLoading(false);
      }
    };

    fetchScheme();
  }, [id]);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!scheme) return <p className="text-center">No scheme found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline mb-4"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-4">{scheme.title}</h1>

      {scheme.image && (
        <img
          src={scheme.image}
          alt={scheme.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}

      <div className="space-y-4 text-gray-700 leading-relaxed">
        {scheme.description && (
          <>
            <h2 className="font-semibold text-xl">Description:</h2>
            <p>{scheme.description}</p>
          </>
        )}
        {scheme.eligibility && (
          <>
            <h2 className="font-semibold text-xl">Eligibility:</h2>
            <p>{scheme.eligibility}</p>
          </>
        )}
        {scheme.benefits && (
          <>
            <h2 className="font-semibold text-xl">Benefits:</h2>
            <p>{scheme.benefits}</p>
          </>
        )}
        {scheme.application && (
          <>
            <h2 className="font-semibold text-xl">Application Process:</h2>
            <p>{scheme.application}</p>
          </>
        )}
        {scheme.department && (
          <>
            <h2 className="font-semibold text-xl">Department:</h2>
            <p>{scheme.department}</p>
          </>
        )}

        {scheme.link && (
          <a
            href={scheme.link}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-6 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Apply Now
          </a>
        )}
      </div>
    </div>
  );
};

export default SchemeDetail;
