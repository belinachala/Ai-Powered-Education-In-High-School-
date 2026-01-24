import React, { useState } from "react";
import Navbar from "@/components/NavBar";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from "lucide-react";

const Contacts: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const universityInfo = {
    name: "Addis Ababa University",
    website: "https://www.aau.edu.et",
    phone: "+251 111 239 780", // General contact (from official sources)
    telegram: "https://t.me/aau_official", // Official Telegram channel
    linkedin: "https://www.linkedin.com/school/addis-ababa-university",
    address: "Addis Ababa University, Main Campus, Sidist Kilo, Addis Ababa, Ethiopia",
    lat: 9.0413,
    lng: 38.7555,
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-100 via-white to-purple-50">
      {/* Navbar */}
      <Navbar />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-12"
      >
        <h2 className="text-5xl font-bold text-purple-700 mb-4">
          Come Brige School Exam Contact Center
        </h2>
        <p className="text-lg text-gray-600">
          Get in touch with Come Brige School support.
        </p>
      </motion.div>

      {/* Main Section */}
      <div className="container mx-auto px-4 md:px-12 flex-grow">
        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white shadow-2xl rounded-2xl p-8 border border-purple-100"
        >
          <h3 className="text-2xl font-semibold text-center text-purple-800 mb-6">
            Come Brige School Contact Information
          </h3>

          <ul className="space-y-3 text-gray-700 text-lg">
            <li>
              🌐 <strong>Website:</strong>{" "}
              <a
                href={universityInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                {universityInfo.website}
              </a>
            </li>
            <li>📞 <strong>Phone:</strong> {universityInfo.phone}</li>
            <li>
              💬 <strong>Telegram:</strong>{" "}
              <a
                href={universityInfo.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                Join Telegram Channel
              </a>
            </li>
            <li>
              💼 <strong>LinkedIn:</strong>{" "}
              <a
                href={universityInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                Visit LinkedIn Page
              </a>
            </li>
            <li>📍 <strong>Address:</strong> {universityInfo.address}</li>
          </ul>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-6"
          >
            <iframe
              src={`https://www.google.com/maps?q=${universityInfo.lat},${universityInfo.lng}&hl=en&z=15&output=embed`}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="rounded-xl shadow-md"
            ></iframe>
          </motion.div>
        </motion.div>

        {/* Suggestion Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="px-8 py-3 bg-purple-700 text-white rounded-xl text-lg font-medium shadow-lg hover:bg-purple-800 transition-all"
          >
            {isFormVisible ? "Hide" : "Provide"} Suggestions
          </button>

          {isFormVisible && (
            <motion.form
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white mt-6 p-6 rounded-2xl shadow-xl max-w-lg mx-auto border border-purple-100"
            >
              <h4 className="text-2xl font-semibold text-purple-700 mb-4">Your Suggestions</h4>
              <div className="mb-4 text-left">
                <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-4 text-left">
                <label htmlFor="email" className="block font-medium text-gray-700 mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-4 text-left">
                <label htmlFor="suggestions" className="block font-medium text-gray-700 mb-1">
                  Your Suggestions
                </label>
                <textarea
                  id="suggestions"
                  rows={4}
                  className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400"
                  placeholder="Share your thoughts..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-700 text-white py-3 rounded-lg font-medium hover:bg-purple-800 transition-all"
              >
                Submit Suggestion
              </button>
            </motion.form>
          )}
        </motion.div>
      </div>

      {/* Footer remains unchanged */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-3 text-purple-400">EduTena</h3>
            <p className="text-gray-400">
              A modern platform revolutionizing Ethiopia’s education system with secure, AI-powered
              exams and data analytics.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-3 text-purple-400">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-purple-400">Home</a></li>
              <li><a href="/about" className="hover:text-purple-400">About</a></li>
              <li><a href="/features" className="hover:text-purple-400">Features</a></li>
              <li><a href="/gallery" className="hover:text-cyan-400">Gallery</a></li>
              <li><a href="/contact" className="hover:text-purple-400">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-3 text-purple-400">Contact Us</h4>
            <p className="text-gray-400 flex items-center gap-2">
              <Mail size={18} /> support@digitalexam.et
            </p>
            <p className="text-gray-400 flex items-center gap-2 mt-2">
              <Phone size={18} /> +251 912 345 678
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-purple-400 transition"><Facebook /></a>
              <a href="#" className="hover:text-purple-400 transition"><Twitter /></a>
              <a href="#" className="hover:text-purple-400 transition"><Instagram /></a>
              <a href="#" className="hover:text-purple-400 transition"><Linkedin /></a>
            </div>
          </div>
        </div>

        <div className="text-center border-t border-gray-700 mt-10 pt-6 text-gray-400 text-sm">
          © 2025 Ethiopia Digital Exam Platform. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Contacts;