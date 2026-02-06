import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Otp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post("/verify-otp", {
        email: localStorage.getItem("email"),
        otp
      });
      localStorage.removeItem("email");
      navigate("/home");
    } catch {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-sm p-8 border border-green-500 rounded">
        <h2 className="text-2xl text-green-500 text-center mb-4">
          Verify OTP
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Enter OTP"
            className="w-full p-3 bg-black border border-green-500 rounded text-white"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            required
          />

          <button className="w-full bg-green-500 text-black py-3 rounded font-semibold">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default Otp;
