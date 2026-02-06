import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Otp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();

    if (loading) return; // prevent double submit
    setLoading(true);

    try {
      const email = localStorage.getItem("email");

      if (!email) {
        alert("Session expired. Please login again.");
        navigate("/");
        return;
      }

      await api.post("/verify-otp", { email, otp });

      localStorage.removeItem("email");
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
      setLoading(false); // allow retry only on failure
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={otp}
        onChange={e => setOtp(e.target.value)}
        placeholder="Enter OTP"
        required
      />

      <button disabled={loading}>
        {loading ? "Verifying..." : "Verify"}
      </button>
    </form>
  );
};

export default Otp;
