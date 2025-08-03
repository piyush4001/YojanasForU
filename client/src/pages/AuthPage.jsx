// src/pages/AuthPage.jsx
import AuthCard from "../components/AuthCard";

const AuthPage = () => {
  const handleAuthSuccess = () => {
    // Redirect to home or dashboard after successful login
    window.location.href = "/";
  };

  return <AuthCard onAuthSuccess={handleAuthSuccess} />;
};

export default AuthPage;
