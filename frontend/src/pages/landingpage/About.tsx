import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Music, Pause, Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import Navbar from "@/components/NavBar";

const About: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  // Floating animation variants for images
  const floatVariants = {
    animate: {
      y: [0, -15, 0],
      scale: [1, 1.03, 1],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-hidden relative">
      {/* Hidden background music */}
      <audio ref={audioRef} src="/assets/soft-background.mp3" loop volume={0.3} />

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
          <h1 className="text-4xl md:text-6xl font-bold mb-4">About Ethiopia Digital Exam Platform</h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-100">
            Revolutionizing education through secure and efficient online examinations in Ethiopia.
          </p>
          <motion.img
            src="/assets/about.png"
            alt="Ethiopia Digital Exam Platform Hero"
            className="mx-auto w-full max-w-3xl rounded-2xl shadow-2xl border-4 border-white"
            variants={floatVariants}
            animate="animate"
          />
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8 text-cyan-700">Our Mission</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed text-center">
            Our mission is to provide a secure, scalable, and user-friendly online examination system that empowers
            universities, high schools, teachers, and students across Ethiopia. We aim to enhance academic integrity,
            simplify exam management, and improve learning outcomes through innovative technology.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.img
              src="/assets/mission-image.png"
              alt="Mission"
              className="w-full rounded-2xl shadow-lg"
              variants={floatVariants}
              animate="animate"
            />

            <ul className="list-disc pl-6 space-y-4 text-gray-700 text-lg">
              <li>Support multiple question types and anti-cheating mechanisms.</li>
              <li>Provide detailed analytics and reports for performance tracking.</li>
              <li>Ensure accessibility on desktops, tablets, and mobiles.</li>
              <li>Foster educational equity in Ethiopia's diverse regions.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="relative bg-gradient-to-r from-cyan-500 to-blue-500 py-20 text-white overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Our Vision</h2>
          <p className="text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
            To make Ethiopia a leader in digital education transformation — where every student, regardless of location,
            has equal access to fair, modern, and technology-driven examinations that inspire excellence.
          </p>
          <motion.img
            src="/assets/brihanunega.png"
            alt="Vision"
            className="mx-auto w-full max-w-2xl rounded-2xl shadow-lg"
            variants={floatVariants}
            animate="animate"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* About */}
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

          {/* Contact */}
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

      {/* Floating Music Toggle Button */}
      <motion.button
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-full shadow-xl hover:bg-purple-700 focus:outline-none"
        animate={{
          scale: [1, 1.1, 1],
          boxShadow: [
            "0 0 15px rgba(168, 85, 247, 0.6)",
            "0 0 25px rgba(168, 85, 247, 0.8)",
            "0 0 15px rgba(168, 85, 247, 0.6)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {isPlaying ? <Pause size={28} /> : <Music size={28} />}
      </motion.button>
    </div>
  );
};

export default About;
