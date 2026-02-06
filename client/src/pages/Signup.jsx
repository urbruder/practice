import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post("/signup", form);
      alert("Signup successful");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 border border-green-500 rounded">

        <h2 className="text-3xl font-bold text-green-500 text-center mb-6">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "email", "password", "phone"].map(field => (
            <input
              key={field}
              name={field}
              type={field === "password" ? "password" : "text"}
              placeholder={field}
              className="w-full p-3 bg-black border border-green-500 rounded text-white"
              onChange={handleChange}
              required
            />
          ))}

          <button className="w-full bg-green-500 text-black py-3 rounded font-semibold">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
