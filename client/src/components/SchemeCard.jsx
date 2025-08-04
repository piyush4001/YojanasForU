import React from "react";
import { Link } from "react-router-dom";

const SchemeCard = ({ scheme }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 border hover:shadow-lg transition duration-300">
      <h2 className="text-xl font-semibold text-blue-700 mb-2">
        {scheme.title}
      </h2>
      <p className="text-gray-700 mb-3">{scheme.description}</p>

      <div className="text-sm text-gray-500 mb-1">
        <strong>Eligibility:</strong> {scheme.eligibility || "N/A"}
      </div>

      <div className="text-sm text-gray-500 mb-1">
        <strong>Gender:</strong> {scheme.gender || "Any"}
      </div>

      <div className="text-sm text-gray-500 mb-1">
        <strong>Location:</strong>
        {(
          <>
            {scheme.location?.district} {scheme.location?.state}
          </>
        ) || "All India"}
      </div>

      <div className="text-sm text-gray-500 mb-3">
        <strong>Documents Required:</strong>{" "}
        {Array.isArray(scheme.documents) ? scheme.documents.join(", ") : "N/A"}
      </div>

      <Link
        to={`/schemes/${scheme._id}`}
        className="inline-block mt-2 text-blue-600 font-medium hover:underline"
      >
        Learn More →
      </Link>
    </div>
  );
};

export default SchemeCard;
