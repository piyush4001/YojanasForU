import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CategoryCard = ({ title, Icon, path }) => {
  return (
    <Link to={path}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-white rounded-2xl shadow-md p-6 text-center transition-all duration-200"
      >
        <Icon className="mx-auto text-4xl text-blue-600 mb-3" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </motion.div>
    </Link>
  );
};

export default CategoryCard;
