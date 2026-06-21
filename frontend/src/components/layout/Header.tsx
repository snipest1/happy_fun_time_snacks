import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Services', path: '/services' },
    { label: 'Service Areas', path: '/service-areas' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-hfts-navy shadow-lg z-50 border-b-2 border-hfts-teal">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="text-2xl font-bold text-hfts-orange font-display">HFTS</div>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-hfts-teal group-hover:w-full transition-all" />
            </div>
            <span className="hidden sm:inline text-white font-bold text-lg">
              Happy Fun Time Snacks
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-white hover:text-hfts-orange px-4 py-2 rounded transition-colors relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-hfts-orange transform scale-x-0 group-hover:scale-x-100 transition-transform" />
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              to="/contact"
              className="bg-hfts-orange hover:bg-hfts-coral text-white px-6 py-2 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg"
            >
              Get a Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-hfts-navy border-t-2 border-hfts-teal shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-white hover:text-hfts-orange px-4 py-3 rounded transition-colors border-b border-hfts-navy/50"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="bg-hfts-orange hover:bg-hfts-coral text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center transition-all mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Get a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
