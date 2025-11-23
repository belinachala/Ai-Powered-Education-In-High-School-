import React from "react";
import Navbar from "@/components/NavBar";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from "lucide-react";

const Features: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white py-20 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Features of Ethiopia Digital Exam Platform
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-100">
            Empowering education with technology and integrity.
          </p>

          <motion.img
            src="/assets/features-hero.png"
            alt="Features Hero"
            className="mx-auto w-full max-w-3xl rounded-2xl shadow-2xl border-4 border-white"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white flex-grow">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center text-gray-800 mb-14"
          >
            Our Key Features
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Secure Examination",
                desc: "Advanced proctoring and encryption ensure a cheat-free environment for all exams.",
                img: "/assets/feature-secure.png",
                color: "from-cyan-500 to-blue-500",
              },
              {
                title: "Performance Analytics",
                desc: "Detailed insights to track progress and improve learning outcomes.",
                img: "/assets/feature-analytics.png",
                color: "from-blue-500 to-indigo-500",
              },
              {
                title: "Accessible Design",
                desc: "Optimized for desktops, tablets, and mobiles across Ethiopia’s regions.",
                img: "/assets/feature-accessible.png",
                color: "from-green-500 to-emerald-500",
              },
              {
                title: "Customizable Exams",
                desc: "Create exams with varied question types and flexible difficulty levels.",
                img: "/assets/feature-customizable.png",
                color: "from-yellow-500 to-orange-500",
              },
              {
                title: "24/7 Support",
                desc: "Dedicated technical support and guidance anytime, anywhere.",
                img: "/assets/feature-support.png",
                color: "from-purple-500 to-pink-500",
              },
              {
                title: "Detailed Reports",
                desc: "Comprehensive analytics for both educators and students.",
                img: "/assets/feature-reports.png",
                color: "from-indigo-500 to-violet-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-gradient-to-r ${feature.color} rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300`}
              >
                <img
                  src={feature.img}
                  alt={feature.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 bg-white">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="container mx-auto px-6"
        >
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Education?
          </h2>
          <p className="text-lg mb-8 text-blue-100">
            Join Ethiopia Digital Exam Platform today and experience the future of assessments.
          </p>
          <motion.a
            href="/register"
            whileHover={{ scale: 1.1 }}
            className="inline-block bg-white text-cyan-700 font-semibold py-3 px-8 rounded-xl shadow-md hover:bg-gray-100 transition"
          >
            Get Started
          </motion.a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-bold mb-3 text-cyan-400">EduTena</h3>
            <p className="text-gray-400">
              A modern and secure platform built to revolutionize digital assessments in Ethiopia’s education system.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-3 text-cyan-400">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-cyan-400">Home</a></li>
              <li><a href="/about" className="hover:text-cyan-400">About</a></li>
              <li><a href="/features" className="hover:text-cyan-400">Features</a></li>
              <li><a href="/gallery" className="hover:text-cyan-400">Gallery</a></li>
              <li><a href="/contact" className="hover:text-cyan-400">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-3 text-cyan-400">Contact Us</h4>
            <p className="text-gray-400 flex items-center gap-2">
              <Mail size={18} /> support@digitalexam.et
            </p>
            <p className="text-gray-400 flex items-center gap-2 mt-2">
              <Phone size={18} /> +251 912 345 678
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-cyan-400 transition"><Facebook /></a>
              <a href="#" className="hover:text-cyan-400 transition"><Twitter /></a>
              <a href="#" className="hover:text-cyan-400 transition"><Instagram /></a>
              <a href="#" className="hover:text-cyan-400 transition"><Linkedin /></a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="text-center border-t border-gray-700 mt-10 pt-6 text-gray-400 text-sm">
          © 2025 Ethiopia Digital Exam Platform. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Features;
