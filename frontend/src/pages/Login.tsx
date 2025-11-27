import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';

interface User {
  username: string;
  role: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  user?: User;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8001/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data: LoginResponse = await response.json();

      if (response.ok && data.user) {
        localStorage.setItem('currentUser', JSON.stringify(data.user));

        // Redirect by role
        const { role } = data.user;
        if (role === 'schooldirector') navigate('/directorprofile');
        else if (role === 'teacher') navigate('/h-s-t-profile');
        else if (role === 'student') navigate('/h-s-s-profile');
        else navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex flex-col md:flex-row">
        <div
          className="w-full md:w-3/5 bg-[#a2d9e4] flex items-center justify-center relative"
          style={{ minHeight: 'calc(100vh - 88px)' }}
        >
          <img
            src="/assets/rvu-logoo1.png"
            alt="RVU Logo"
            className="w-full h-3/4 object-contain"
            onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
          />
        </div>

        <div className="w-full md:w-1/2 bg-blue p-6 flex items-center justify-center">
          <div className="w-full max-w-md">
            <form className="space-y-6 border-4 border-blue-500 p-6 rounded-lg" onSubmit={handleLogin}>
              <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h1>

              {error && <p className="text-red-500 text-center">{error}</p>}

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-purple-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:border-purple-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-700 text-white p-2 rounded mt-4 hover:bg-purple-800 transition"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="text-center mt-4">
              <Link to="/forgot-password" className="text-purple-700 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <div className="text-center mt-4">
              <span className="text-gray-700">Don't have an account? </span>
              <Link to="/register" className="text-purple-700 hover:underline">
                Go to Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
