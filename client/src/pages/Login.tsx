import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://gigflow-backend-oun3.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      navigate("/dashboard");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white w-[350px] p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          GigFlow Login
        </h1>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4"
        >
          <input
            type="email"
            placeholder="Enter email"
            className="border border-gray-300 p-3 rounded-md outline-none"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Enter password"
            className="border border-gray-300 p-3 rounded-md outline-none"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button className="bg-black text-white p-3 rounded-md">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;