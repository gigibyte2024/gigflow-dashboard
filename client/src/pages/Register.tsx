import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://gigflow-backend-oun3.onrender.com/api/auth/register",
        {
          name,
          email,
          password,
          role,
        }
      );

      navigate("/");
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white w-[350px] p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          GigFlow Register
        </h1>

        <form
          onSubmit={handleRegister}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Enter name"
            className="border border-gray-300 p-3 rounded-md outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Enter email"
            className="border border-gray-300 p-3 rounded-md outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter password"
            className="border border-gray-300 p-3 rounded-md outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Enter role (e.g. admin, user)"
            className="border border-gray-300 p-3 rounded-md outline-none"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />

          <button className="bg-black text-white p-3 rounded-md">
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-black font-medium underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
