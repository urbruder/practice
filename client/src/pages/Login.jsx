import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post("/login", { email, password });
      localStorage.setItem("email", email);
      navigate("/otp");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 rounded-lg border border-green-500">

        <h2 className="text-3xl font-bold text-green-500 text-center mb-2">
          Welcome
        </h2>
        <p className="text-center text-gray-400 mb-6">
          Log in to this website
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Email address"
            className="w-full p-3 bg-black border border-green-500 rounded text-white focus:outline-none"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-black border border-gray-600 rounded text-white focus:outline-none"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-black py-3 rounded font-semibold hover:bg-green-400 transition"
          >
            Continue
          </button>
        </form>

        <p className="text-center mt-4 text-gray-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-green-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
