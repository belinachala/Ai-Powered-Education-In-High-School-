import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/NavBar";
import axios from "axios";

interface LoginResponse {
  username: string;
  role: string;
  access_token: string;
  token_type: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username.trim() || !password) {
      setError("Username and password are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post<LoginResponse>(
        "http://127.0.0.1:8000/auth/login",
        { username: username.trim(), password }
      );

      const user = response.data;

      // Store JWT token and basic user info
      localStorage.setItem("token", user.access_token);
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ username: user.username, role: user.role })
      );

      // Special handling for school directors
     if (user.role === "schooldirector") {
  try {
    // Fetch director profile using token
    const profileCheck = await axios.get(
      "http://127.0.0.1:8000/directors/me/profile",
      {
        headers: {
          Authorization: `Bearer ${response.data.access_token}`
        }
      }
    );

    // If profile exists (director_id filled) → dashboard
    if (profileCheck.data.director_id) {
      navigate("/director");
    } else {
      // Else → profile completion
      navigate("/directorprofile");
    }
  } catch (profileError: any) {
    // If 401, 403, or other error → go to profile completion
    navigate("/directorprofile");
  }
}

      // Other roles
      else if (user.role === "teacher") {
        navigate("/h-s-teacher/dashboard");
      } else if (user.role === "student") {
        navigate("/h-s-student/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Invalid username or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex flex-col md:flex-row">
        <div
          className="w-full md:w-3/5 bg-[#a2d9e4] flex items-center justify-center relative"
          style={{ minHeight: "calc(100vh - 88px)" }}
        >
          <img
            src="/assets/rvu-logoo1.png"
            alt="RVU Logo"
            className="w-full h-3/4 object-contain"
            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
          />
        </div>

        <div className="w-full md:w-1/2 bg-white p-6 flex items-center justify-center">
          <div className="w-full max-w-md">
            <form
              className="space-y-6 border-4 border-blue-500 p-6 rounded-lg"
              onSubmit={handleLogin}
            >
              <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
                Login
              </h1>

              {error && (
                <p className="text-red-500 text-center font-medium bg-red-50 p-3 rounded">
                  {error}
                </p>
              )}

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="w-full p-3 rounded border-2 border-gray-300 focus:border-purple-500 focus:outline-none transition"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full p-3 rounded border-2 border-gray-300 focus:border-purple-500 focus:outline-none transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="text-center mt-6 space-y-3">
              <Link to="/forgot-password" className="text-purple-700 hover:underline text-sm">
                Forgot Password?
              </Link>
              <div>
                <span className="text-gray-600">Don't have an account? </span>
                <Link to="/register" className="text-purple-700 font-semibold hover:underline">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
