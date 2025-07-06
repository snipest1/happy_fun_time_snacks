import SmoothScrollLink from '../shared/SmoothScrollLink';
import React, { useState } from 'react';
import { Menu, X, Coffee, ShoppingCart } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-blue-800" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-600">
              Happy Fun Time Snacks
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <SmoothScrollLink to="/#machines" className="text-gray-600 hover:text-blue-700 transition-colors">
              Machines
            </SmoothScrollLink>
            <SmoothScrollLink to="/#products" className="text-gray-600 hover:text-blue-700 transition-colors">
              Products
            </SmoothScrollLink>
            <SmoothScrollLink to="/#features" className="text-gray-600 hover:text-blue-700 transition-colors">
              Features
            </SmoothScrollLink>
            <SmoothScrollLink to="/#locations" className="text-gray-600 hover:text-blue-700 transition-colors">
              Locations
            </SmoothScrollLink>
            <SmoothScrollLink to="/#contact" className="text-gray-600 hover:text-blue-700 transition-colors">
              Contact
            </SmoothScrollLink>
	    <section id="repair">
	    <SmoothScrollLink to="/repair" className="text-gray-600 hover:text-blue-700 transition-colors">
  Repair
</SmoothScrollLink>
</section>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-full flex items-center space-x-2 transition-all transform hover:scale-105">
              <ShoppingCart className="h-5 w-5" />
              <span>Get a Quote</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <SmoothScrollLink to="/#machines" className="text-gray-600 hover:text-blue-700 transition-colors py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>
              Machines
            </SmoothScrollLink>
            <SmoothScrollLink to="/#products" className="text-gray-600 hover:text-blue-700 transition-colors py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>
              Products
            </SmoothScrollLink>
            <SmoothScrollLink to="/#features" className="text-gray-600 hover:text-blue-700 transition-colors py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>
              Features
            </SmoothScrollLink>
            <SmoothScrollLink to="/#locations" className="text-gray-600 hover:text-blue-700 transition-colors py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>
              Locations
            </SmoothScrollLink>
            <SmoothScrollLink to="/#contact" className="text-gray-600 hover:text-blue-700 transition-colors py-2 border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>
              Contact
            </SmoothScrollLink>
	    <section id="repair">
	    <SmoothScrollLink to="/repair" className="text-gray-600 hover:text-blue-700 transition-colors">
  Repair
</SmoothScrollLink>
</section>
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full flex items-center justify-center space-x-2 transition-all">
              <ShoppingCart className="h-5 w-5" />
              <span>Get a Quote</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
