import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import categories from "../data/categories";
import schemes from "../data/schemes";
import SchemeCard from "../components/SchemeCard";

const CategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const category = categories.find((cat) => cat.id === id);

  const categorySchemes = schemes.filter((scheme) =>
    scheme.categories?.includes(id)
  );

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!category) {
    return (
      <div className="p-8 text-center text-xl">
        Category not found.{" "}
        <button
          onClick={() => navigate("/category")}
          className="text-blue-600 underline ml-2"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <span className="text-5xl">{category.icon}</span> {category.name}
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl">{category.description}</p>
        </div>
        <button
          onClick={() => navigate("/category")}
          className="text-sm bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2"
        >
          ← Back to Categories
        </button>
      </div>

      {/* Schemes List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          Schemes in this Category
        </h2>
        {categorySchemes.length === 0 ? (
          <p className="text-gray-500">No schemes found for this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categorySchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;
