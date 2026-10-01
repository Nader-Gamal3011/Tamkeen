import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !sessionStorage.getItem("accessToken")) {
    return <Navigate to="/" replace />;
  }
  if (user.role !== allowedRole) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-xl text-red-500 font-bold">
          You are not allowed to access this page
        </h1>
      </div>
    );
  }

  return children;
}
