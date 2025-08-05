import { useEffect, useState } from "react";

const SchemeForMe = () => {
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    // Try getting from localStorage
    const storedSchemes = localStorage.getItem("filteredSchemes");
    if (storedSchemes) {
      setSchemes(JSON.parse(storedSchemes));
    }
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Schemes Matched for You</h2>
      {schemes.length === 0 ? (
        <p>No schemes found for your profile.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schemes.map((scheme) => (
            <div key={scheme._id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{scheme.title}</h3>
              <p className="text-sm text-gray-600">{scheme.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchemeForMe;
