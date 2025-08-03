import React, { useEffect, useState } from "react";
import axios from "axios";
import SchemeCard from "../components/SchemeCard";
import LatestCarousel from "../components/LatestCarousel";
import CategoryCard from "../components/CategoryCard";

import {
  GraduationCap,
  Stethoscope,
  Briefcase,
  Home as HomeIcon,
  Users,
  Baby,
} from "lucide-react";

const categories = [
  { title: "Education", Icon: GraduationCap, path: "/category/education" },
  { title: "Health", Icon: Stethoscope, path: "/category/health" },
  { title: "Employment", Icon: Briefcase, path: "/category/employment" },
  { title: "Housing", Icon: HomeIcon, path: "/category/housing" },
  { title: "Senior Citizens", Icon: Users, path: "/category/Senior Citizens" },
  { title: "Women & Child", Icon: Baby, path: "/category/women&child" },
];

const Home = () => {
  const [latestSchemes, setLatestSchemes] = useState([]);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/schemes/latest-scheme"
        );
        setLatestSchemes(res.data.data || []);

        // console.log("Latest schemes fetched:", res.data);
      } catch (error) {
        console.error("Error fetching latest schemes:", error);
      }
    };

    fetchSchemes();
  }, []);

  return (
    <div>
      {/* Carousel Section */}
      <LatestCarousel />

      {/* Featured Schemes Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">
          Latest Schemes
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {latestSchemes.map((data) => (
            <SchemeCard key={data._id} scheme={data} />
          ))}
        </div>
      </div>

      {/* Category Section */}
      <div className="bg-blue-50 py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Explore by Category
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map(({ title, Icon, path }) => (
              <CategoryCard key={title} title={title} Icon={Icon} path={path} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
