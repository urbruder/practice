import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Otp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const email = localStorage.getItem("email");

      if (!email) {
        alert("Session expired. Please login again.");
        navigate("/");
        return;
      }

      await api.post("/verify-otp", {
        email,
        otp
      });

      localStorage.removeItem("email");
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-sm border border-green-500 rounded-lg p-8">

        <h2 className="text-2xl font-bold text-green-500 text-center mb-2">
          Verify OTP
        </h2>
        <p className="text-center text-gray-400 mb-6">
          Enter the OTP sent to your phone
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full px-4 py-3 bg-black border border-green-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded font-semibold transition
              ${
                loading
                  ? "bg-green-700 cursor-not-allowed text-black"
                  : "bg-green-500 hover:bg-green-400 text-black"
              }
            `}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Otp;
