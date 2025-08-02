import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import schemes from "../data/schemes";
import categories from "../data/categories";

const SchemeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const scheme = schemes.find((s) => s.id === id);

  if (!scheme) {
    return (
      <div className="p-8 text-center text-xl">
        Scheme not found.{" "}
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 underline ml-2"
        >
          Go Home
        </button>
      </div>
    );
  }

  const categoryIcons = scheme.categories.map((catId) => {
    const cat = categories.find((c) => c.id === catId);
    return (
      <span
        key={catId}
        className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 rounded-full mr-2 mb-2"
      >
        {cat?.icon} {cat?.name}
      </span>
    );
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-gray-600 hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-2">{scheme.title}</h1>
      <p className="text-gray-700 mb-4">{scheme.description}</p>

      <div className="mb-6">{categoryIcons}</div>

      <div className="space-y-4 text-gray-800">
        {scheme.eligibility && (
          <div>
            <h2 className="text-lg font-semibold">Eligibility</h2>
            <p>{scheme.eligibility}</p>
          </div>
        )}
        {scheme.benefits && (
          <div>
            <h2 className="text-lg font-semibold">Benefits</h2>
            <p>{scheme.benefits}</p>
          </div>
        )}
        {scheme.howToApply && (
          <div>
            <h2 className="text-lg font-semibold">How to Apply</h2>
            <p>{scheme.howToApply}</p>
          </div>
        )}
        {scheme.link && (
          <div>
            <a
              href={scheme.link}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-4 text-blue-600 hover:underline"
            >
              Visit Official Website ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemeDetail;
