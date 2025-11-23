import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';
import Navbar from '@/components/NavBar';
import Hero from '@/components/Hero';
import ExamPackages from '@/components/ExamPackages';
import Faculties from '@/components/Faculties';
import OurPattern from '@/components/OurPattern';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative">
        <Hero />
        <OurPattern /> {/* Animated pattern behind hero */}
      </section>

      {/* Exam Packages Section */}
      <section className="py-20 bg-white">
        <motion.div
          className="container mx-auto px-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <ExamPackages />
        </motion.div>
      </section>

      {/* Faculties Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white">
        <motion.div
          className="container mx-auto px-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Faculties />
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
            <p className="text-gray-400 flex items-center gap-2"><Mail size={18}/> support@digitalexam.et</p>
            <p className="text-gray-400 flex items-center gap-2 mt-2"><Phone size={18}/> +251 912 345 678</p>
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

export default Home;
