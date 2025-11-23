import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <header className="bg-blue-500 text-white">
      {/* Top bar */}
      <div className="flex justify-end items-center px-4 py-2 text-sm bg-cyan-500">
        <div className="flex space-x-3">
          <Link to="/login" className="border border-white text-white text-sm px-3 py-1 rounded hover:bg-white hover:text-blue-600">
            Login
          </Link>
          <Link to="/register" className="bg-white text-blue-600 font-bold text-sm px-3 py-1 rounded hover:bg-gray-100">
            Register
          </Link>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="flex justify-between items-center px-4 py-3 bg-blue-900 shadow-md">
        <div className="border border-white text-white text-sm px-3 py-1 rounded hover:bg-white hover:text-blue-600 text-white font-bold text-xl">
          <Link to="/">EduTena</Link>
        </div>
        <ul className="flex space-x-4 md:space-x-6 text-sm md:text-base text-white">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/features">Features</Link></li>
          <li><Link to="/gallery">Gallery</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;