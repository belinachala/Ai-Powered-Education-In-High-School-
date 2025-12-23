import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Navbar from "@/components/NavBar";

interface RegisterFormData {
  username: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
  confirm_password: string;
  role: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg(""); // Clear error when user starts typing
  };

  const validateForm = (): string | null => {
    if (!formData.username.trim()) return "Username is required.";
    if (!formData.first_name.trim() || !formData.last_name.trim())
      return "First and last name are required.";
    if (!formData.email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return "Invalid email format.";
    if (!formData.phone_number.trim()) return "Phone number is required.";
    if (formData.password.length < 6)
      return "Password must be at least 6 characters.";
    if (formData.password.length > 72)
      return "Password is too long (max 72 characters)."; // ← NEW: bcrypt limit
    if (formData.password !== formData.confirm_password)
      return "Passwords do not match.";
    if (!formData.role) return "Role is required.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/register", {
        username: formData.username.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone_number: formData.phone_number.trim(),
        email: formData.email.trim(),
        password: formData.password, // no need to trim password
        role: formData.role,
      });

      setSuccessMsg("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500); // Show success for 1.5s before redirect
    } catch (error: any) {
      setLoading(false);

      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        const detail = error.response.data.detail;
        setErrorMsg(
          typeof detail === "string" ? detail : detail.join(", ")
        );
      } else {
        setErrorMsg("Failed to register. Please try again later.");
      }
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
          className="w-full md:w-1/2 bg-[#a2d9e4] flex items-center justify-center p-4"
        >
          <img
            src="/assets/rvu-logoo1.png"
            alt="RVU Logo"
            className="w-full max-h-[500px] object-contain"
            onError={(e) => {
              e.currentTarget.src = "/assets/fallback.png";
            }}
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
              <motion.h1 className="text-2xl font-bold text-center mb-6">Create Account</motion.h1>

              {[
                { label: "Username", name: "username", type: "text" },
                { label: "First Name", name: "first_name", type: "text" },
                { label: "Last Name", name: "last_name", type: "text" },
                { label: "Phone Number", name: "phone_number", type: "tel" },
                { label: "Email", name: "email", type: "email" },
                { label: "Password", name: "password", type: "password" },
                { label: "Confirm Password", name: "confirm_password", type: "password" },
              ].map((field) => (
                <motion.div key={field.name} variants={fieldVariants}>
                  <label htmlFor={field.name} className="block text-sm font-bold mb-2">
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    value={formData[field.name as keyof RegisterFormData]}
                    onChange={handleChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </motion.div>
              ))}

              <motion.div variants={fieldVariants}>
                <label htmlFor="role" className="block text-sm font-bold mb-2">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="schooldirector">School Director</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </select>
              </motion.div>

              {errorMsg && (
                <motion.p className="text-red-600 font-semibold text-center" variants={fieldVariants}>
                  {errorMsg}
                </motion.p>
              )}

              {successMsg && (
                <motion.p className="text-green-600 font-semibold text-center" variants={fieldVariants}>
                  {successMsg}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className={`w-full bg-purple-700 text-white p-2 rounded hover:bg-purple-800 transition-colors ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                variants={fieldVariants}
              >
                {loading ? "Registering..." : "Register"}
              </motion.button>
            </motion.form>

            <div className="text-center mt-4">
              <span>Already have an account? </span>
              <Link to="/login" className="text-purple-700 hover:underline font-semibold">
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