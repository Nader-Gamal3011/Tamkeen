import { useState } from "react";

import { useNavigate } from "react-router-dom";

import "../index.css";

import background from "../assets/images/background.png";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("nader@tamkeen.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Login function
  const handleLogin = async () => {
    const API_URL = "https://tamkeen-backend-production.up.railway.app/api";

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      const { accessToken, refreshToken, user } = data.data;

      sessionStorage.setItem("accessToken", accessToken);

      localStorage.setItem("refreshToken", refreshToken);

      localStorage.setItem("user", JSON.stringify(user));

      const role = user.role;

      if (role === "admin") navigate("/admin");
      else if (role === "doctor") navigate("/doctor");
      else if (role === "receptionist") navigate("/reception");
      else if (role === "patient") navigate("/patient");
      else setError("Unauthorized role");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen relative bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-200/70 via-white/40 to-transparent"></div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-around min-h-screen px-10 md:px-20">
        {/* Left Side (Logo) */}
        <div className="hidden md:flex flex-col items-center text-center">
          <MdOutlineHealthAndSafety className="text-8xl text-blue-600 mb-4" />
          <h1 className="text-4xl font-bold text-blue-700">Tamkeen</h1>
          <p className="text-gray-600 mt-2">Empowering Healthcare</p>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Welcome Back
          </h2>

          <p className="text-gray-500 text-center mb-6">
            Sign in to your Tamkeen account
          </p>

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">Email Address</label>
            <div className="flex items-center border rounded-lg px-3 py-2 mt-1 focus-within:ring-2 focus-within:ring-blue-500">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full outline-none text-sm "
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="text-sm text-gray-600">Password</label>
            <div className="flex items-center border rounded-lg px-3 py-2 mt-1 focus-within:ring-2 focus-within:ring-blue-500">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full outline-none text-sm"
              />
            </div>
            <div className="text-right mb-4">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </button>
            </div>
          </div>
          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50">
            {loading ? "Loading..." : "Sign In"}
          </button>
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
