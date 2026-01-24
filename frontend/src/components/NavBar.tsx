import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <header className="bg-blue-900 text-white shadow-md">
      <nav className="container mx-auto px-2 md:px-4 py-2 flex items-center justify-between">
        {/* Left side - Logo + Divider + Text */}
        <Link to="/" className="flex items-center gap-2 md:gap-2">
          {/* Circular Logo */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white/30 shadow-md">
              <img
                src="/assets/rvu-logo.png"
                alt="Addis Ababa University Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Vertical divider line */}
          <div className="hidden md:block w-px h-12 bg-white/40" aria-hidden="true" />

          {/* University name text */}
          <div className="flex flex-col leading-tight">
            <span className="text-lg md:text-2xl font-bold text-white tracking-wide">
              ኮም ብሪጅ ትምህርት ቤት
            </span>
            <span className="text-sm md:text-base font-semibold text-gray-200">
              Come Brige School
            </span>
            <span className="text-xs md:text-sm text-gray-300 italic">
              SINCE 2025
            </span>
          </div>
        </Link>

        {/* Right side - Navigation + Auth buttons */}
        <div className="flex items-center gap-6 md:gap-8">
          {/* Navigation links - visible on md+ */}
          <ul className="hidden md:flex items-center space-x-4 text-base font-medium">
            <li>
              <Link to="/" className=" text-white text-sm md:text-base px-1 py-1 rounded hover:bg-white/10 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-white text-sm md:text-base px-1 py-1 rounded hover:bg-white/10 transition">
                About
              </Link>
            </li>
            <li>
              <Link to="/features" className="text-white text-sm md:text-base px-1 py-1 rounded hover:bg-white/10 transition">
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="text-white text-sm md:text-base px-1 py-1 rounded hover:bg-white/10 transition">
                Gallery
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-white text-sm md:text-base px-1 py-1 rounded hover:bg-white/10 transition">
                Contact Us
              </Link>
            </li>
            <li><Link
              to="/login"
              className="border border-white/70 text-white text-sm md:text-base px-3 py-1.5 rounded hover:bg-white/10 transition"
            >
              Login
            </Link></li>
            <li><Link
              to="/register"
              className="bg-white text-blue-900 font-semibold text-sm md:text-base px-3 py-1.5 rounded hover:bg-gray-100 transition"
            >
              Register
            </Link></li>
          </ul>

        </div>
      </nav>
    </header>
  );
};

export default Navbar;