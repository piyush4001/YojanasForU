import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserCircle2, Mail, Phone, Edit3, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- Sub-component for displaying a row of information ---
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center space-x-4">
    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-semibold text-gray-800 dark:text-gray-200">{value}</p>
    </div>
  </div>
);

// --- Sub-component for the main profile card UI ---
const ProfileCard = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Header with Gradient */}
      <div className="h-24 bg-gradient-to-r from-cyan-500 to-blue-500" />

      {/* Avatar and Name */}
      <div className="flex flex-col items-center -mt-16 px-6">
        <div className="relative w-28 h-28">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-full h-full rounded-full object-cover ring-4 ring-white dark:ring-gray-800"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ring-4 ring-white dark:ring-gray-800">
              <UserCircle2
                size={80}
                className="text-gray-400 dark:text-gray-500"
              />
            </div>
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
          {user.fullname}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
      </div>
      <div className="p-6 space-y-6">
        <InfoRow
          icon={<Mail className="w-6 h-6 text-gray-500 dark:text-gray-400" />}
          label="Email Address"
          value={user.email || "Not provided"}
        />
        <InfoRow
          icon={<Phone className="w-6 h-6 text-gray-500 dark:text-gray-400" />}
          label="Phone Number"
          value={user.phoneNo || "Not provided"}
        />
        <InfoRow
          icon={
            <UserCircle2 className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          }
          label="Gender"
          value={user.gender || "Not provided"}
        />
        <InfoRow
          icon={
            <UserCircle2 className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          }
          label="Income Group"
          value={user.income || "Not provided"}
        />
        <InfoRow
          icon={
            <UserCircle2 className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          }
          label="Category"
          value={user.category || "Not provided"}
        />
        <InfoRow
          icon={
            <UserCircle2 className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          }
          label="State"
          value={user.state || "Not provided"}
        />
        <InfoRow
          icon={
            <UserCircle2 className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          }
          label="District"
          value={user.district || "Not provided"}
        />
      </div>

      {/* Action Button */}
      <div className="px-6 pb-6">
        <button
          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => navigate("/edit-profile")}
        >
          <Edit3 className="w-5 h-5 mr-2" />
          Edit Profile
        </button>
      </div>
    </div>
  );
};

// --- Sub-component for the loading state skeleton ---
const LoadingSkeleton = () => (
  <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden animate-pulse">
    <div className="h-24 bg-gray-200 dark:bg-gray-700" />
    <div className="flex flex-col items-center -mt-16 px-6">
      <div className="w-28 h-28 rounded-full bg-gray-300 dark:bg-gray-600 ring-4 ring-white dark:ring-gray-800" />
      <div className="h-7 w-40 bg-gray-300 dark:bg-gray-600 rounded-md mt-4" />
      <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded-md mt-2" />
    </div>
    <div className="p-6 space-y-6">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md" />
            <div className="h-5 w-48 bg-gray-300 dark:bg-gray-600 rounded-md" />
          </div>
        </div>
      ))}
    </div>
    <div className="px-6 pb-6">
      <div className="h-12 w-full bg-gray-300 dark:bg-gray-600 rounded-xl" />
    </div>
  </div>
);

// --- Main Profile Component ---
const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/v1/users/get-current-user", {
          withCredentials: true,
        });
        setUser(res.data.data);
        setError(null);
      } catch (err) {
        setError("Failed to load profile. Please try again later.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const renderContent = () => {
    if (loading) return <LoadingSkeleton />;

    if (error) {
      return (
        <div className="text-center text-red-500 flex flex-col items-center space-y-2">
          <AlertTriangle className="w-12 h-12" />
          <p className="font-semibold">An Error Occurred</p>
          <p>{error}</p>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="text-center text-gray-500 dark:text-gray-400">
          Not logged in.
        </div>
      );
    }

    return <ProfileCard user={user} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      {renderContent()}
    </div>
  );
};

export default Profile;
