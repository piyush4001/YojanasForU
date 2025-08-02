import React from "react";
import { useParams } from "react-router-dom";

const CategoryPage = () => {
  const { name } = useParams();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 capitalize mb-4">
        {name.replace("-", " ")} Schemes
      </h1>
      {/* Filter and list schemes from this category */}
      <p className="text-gray-600">Display schemes here...</p>
    </div>
  );
};

export default CategoryPage;
