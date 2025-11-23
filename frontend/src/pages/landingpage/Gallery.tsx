import React, { useEffect, useState } from 'react';
import Navbar from '@/components/NavBar';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const Gallery: React.FC = () => {
  const images = [
    { src: '/assets/feature-secure.png', caption: 'Secure Online Exams in Progress' },
    { src: '/assets/gallery-students.png', caption: 'Students Participating in AI-Powered Assessments' },
    { src: '/assets/gallery-teachers.png', caption: 'Teachers Creating Exams with Smart Tools' },
    { src: '/assets/feature-analytics.png', caption: 'Comprehensive Analytics Dashboard' },
    { src: '/assets/gallery-learning.png', caption: 'Interactive Learning and Practice Tests' },
    { src: '/assets/feature-support.png', caption: '24/7 Technical Support for Institutions' },
  ];

  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => setOffsetY(window.scrollY);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white py-20 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 text-center relative z-10"
        >
          <h1 className="text-5xl font-bold mb-4">Explore Our Digital Exam Journey</h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-100">
            Experience innovation in education through our AI-Powered Digital Exam Platform — for Universities and High Schools across Ethiopia.
          </p>
          <motion.img
            src="/assets/gallery-hero.png"
            alt="Gallery Hero"
            className="mx-auto w-full max-w-3xl rounded-2xl shadow-2xl border-4 border-white"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          />
        </motion.div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 container mx-auto px-6 flex-1">
        <h2 className="text-3xl font-bold text-center text-cyan-700 mb-12">
          Our Platform in Action
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {images.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
            >
              <img
                src={item.src}
                alt={item.caption}
                className="w-full h-64 object-cover"
              />
              <div className="p-4 bg-white text-center">
                <p className="text-gray-800 font-medium">{item.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="container mx-auto px-6"
        >
          <h2 className="text-4xl font-bold mb-4">Want to Be Part of Our Gallery?</h2>
          <p className="text-lg mb-8 text-blue-100">
            Share your institution’s success story or achievements using the AI-Powered Digital Exam Platform.
          </p>
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.1 }}
            className="inline-block bg-white text-cyan-700 font-semibold py-3 px-8 rounded-xl shadow-md hover:bg-gray-100 transition"
          >
            Contact Us
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

export default Gallery;
