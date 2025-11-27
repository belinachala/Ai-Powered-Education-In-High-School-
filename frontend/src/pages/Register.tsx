import React, { useState } from 'react';
import Navbar from '@/components/NavBar';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',          // NEW FIELD
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    password: '',
    confirm_password: '',
    user_type: 'highschool',
    role: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+]{7,15}$/;

    if (!formData.username) return "Username is required.";
    if (!formData.first_name || !formData.last_name) return "First and last name are required.";
    if (!emailRegex.test(formData.email)) return "Invalid email address.";
    if (!phoneRegex.test(formData.phone_number)) return "Invalid phone number.";
    if (formData.password.length < 6) return "Password must be at least 6 characters.";
    if (formData.password !== formData.confirm_password) return "Passwords do not match.";
    if (!formData.role) return "Role is required.";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8001/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username, // NEW FIELD IN REQUEST
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          email: formData.email,
          password: formData.password,
          user_type: "highschool",
          role: formData.role,
        }),
      });

      if (response.ok) {
        setSuccessMsg("Registration successful!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        const data = await response.json();
        const errors = Object.values(data).flat().join(" ");
        setErrorMsg(errors || "Registration failed. Please try again.");
      }
    } catch {
      setErrorMsg("Network error. Please check your backend server.");
    } finally {
      setLoading(false);
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-col md:flex-row flex-1">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 bg-[#a2d9e4] flex items-center justify-center relative p-4"
        >
          <img
            src="/assets/rvu-logoo1.png"
            alt="Logo"
            className="w-full bg-blue-900 flex items-center justify-center relative p-4"
            onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
          />
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 bg-white p-6 flex items-center justify-center"
        >
          <div className="w-full max-w-md">
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4 border-4 border-blue-500 p-6 rounded-lg shadow-lg"
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.1 }}
            >
              <motion.h1
                className="text-2xl font-bold text-gray-800 text-center mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Create Account
              </motion.h1>

              {/* USERNAME FIELD */}
              <motion.div variants={fieldVariants}>
                <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="your_username"
                  className="w-full p-2 rounded border border-gray-300"
                  required
                />
              </motion.div>

              <motion.div className="flex flex-col sm:flex-row sm:space-x-4" variants={fieldVariants}>
                <div className="flex-1 mb-4 sm:mb-0">
                  <label className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-gray-300"
                    required
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-gray-300"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={fieldVariants}>
                <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-gray-300"
                  required
                />
              </motion.div>

              <motion.div variants={fieldVariants}>
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-gray-300"
                  required
                />
              </motion.div>

              <motion.div variants={fieldVariants}>
                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-gray-300"
                  required
                />
              </motion.div>

              <motion.div variants={fieldVariants}>
                <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-gray-300"
                  required
                />
              </motion.div>

              <input type="hidden" name="user_type" value="highschool" />

              <motion.div variants={fieldVariants}>
                <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-gray-300"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="schooldirector">School Director</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </select>
              </motion.div>

              {errorMsg && (
                <motion.p className="text-red-600 text-sm font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {errorMsg}
                </motion.p>
              )}

              {successMsg && (
                <motion.p className="text-green-600 text-sm font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {successMsg}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-700 text-white p-2 rounded mt-4 hover:bg-purple-800 transition"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {loading ? "Registering..." : "Register"}
              </motion.button>
            </motion.form>

            <div className="text-center mt-4">
              <span className="text-gray-700">Already have an account? </span>
              <Link to="/login" className="text-purple-700 hover:underline">
                Go to Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Register;
