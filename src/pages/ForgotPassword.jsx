import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = "https://tamkeen-backend-production.up.railway.app/api";

  // Step 1
  const sendOTP = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      setSuccess("OTP sent successfully.");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2 + Step 3
  const resetPassword = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      setSuccess("Password changed successfully.");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

        {step === 1 && (
          <>
            <label className="block mb-2 text-sm">Email Address</label>

            <input
              type="email"
              className="w-full border rounded-lg p-3 mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={sendOTP}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg">
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label className="block mb-2 text-sm">OTP Code</label>

            <input
              type="text"
              className="w-full border rounded-lg p-3 mb-4"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <label className="block mb-2 text-sm">New Password</label>

            <input
              type="password"
              className="w-full border rounded-lg p-3 mb-4"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              onClick={resetPassword}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg">
              {loading ? "Saving..." : "Reset Password"}
            </button>
          </>
        )}

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        {success && <p className="text-green-600 text-sm mt-4">{success}</p>}
      </div>
    </div>
  );
}
