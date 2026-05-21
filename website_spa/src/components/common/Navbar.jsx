
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Shop', path: '/catalog' },
    { name: 'Reviews', path: '/reviews' },
  ];

  return (
    <nav className="fixed top-0 w-full z-[100] bg-primary-dark/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3">
            <img className="h-12 w-auto" src="/logo_optimized.png" alt="USS Logo" />
            <span className="hidden sm:block text-white font-black tracking-tighter text-lg italic">ULTIMATE SECURITY SOLUTIONS</span>
          </Link>
          
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-bold tracking-widest uppercase transition-colors ${
                  location.pathname === link.path ? 'text-secondary' : 'text-white hover:text-secondary'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/#contact" 
              className="bg-secondary text-primary-dark px-5 py-2 rounded-lg font-black text-xs tracking-widest hover:bg-secondary-hover transition-all shadow-lg shadow-secondary/20"
            >
              GET QUOTE
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
