import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-cyan-900 text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-4">
          <h3 className="text-xl font-bold">Ethiopia Digital Exam Platform</h3>
          <p className="text-sm mt-2">Empowering education through innovative online examinations.</p>
        </div>
        <div className="flex justify-center space-x-6 mb-4">
          <a href="/about" className="hover:text-cyan-300 transition">About Us</a>
          <a href="/features" className="hover:text-cyan-300 transition">Features</a>
          <a href="/contact" className="hover:text-cyan-300 transition">Contact</a>
        </div>
        <div className="text-sm">
          <p>&copy; 2025 Ethiopia Digital Exam Platform. All rights reserved.</p>
          <p className="mt-1">Support: support@ethiopiadigitalexam.com | Phone: +251 911 123 456</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;