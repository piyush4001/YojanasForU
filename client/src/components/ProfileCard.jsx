// import React from "react";
// import { UserCircle } from "lucide-react";

// const ProfileCard = ({ onClose, profile, loading }) => (
//   <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded shadow-lg z-20 p-4">
//     <div className="flex items-center mb-2">
//       <UserCircle size={40} className="mr-2" />
//       <div>
//         <div className="font-semibold">
//           {loading ? "Loading..." : profile?.fullname || "User"}
//         </div>
//         <div className="font-semibold">
//           {loading ? "" : profile?.phoneNo || ""}
//         </div>
//         <div className="text-xs text-gray-500">
//           {loading ? "" : profile?.email || ""}
//         </div>
//       </div>
//     </div>
//     <button
//       onClick={onClose}
//       className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//     >
//       Close
//     </button>
//   </div>
// );

// export default ProfileCard;

import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("/api/profile", { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  if (!user) return <div className="p-4">Not logged in</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      {/* Add more fields if needed */}
    </div>
  );
};

export default Profile;
