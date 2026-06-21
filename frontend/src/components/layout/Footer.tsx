import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-hfts-navy text-white border-t-2 border-hfts-teal">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold font-display text-hfts-orange">HFTS</span>
              <div className="text-sm font-bold text-hfts-teal">Happy Fun Time Snacks</div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Premium smart vending for warehouses, government facilities, and luxury properties. Zero hassle. Happy people.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-hfts-orange transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-hfts-orange transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-hfts-orange transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-hfts-orange transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-hfts-orange">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-hfts-teal transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-hfts-teal transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/service-areas" className="text-gray-300 hover:text-hfts-teal transition-colors">
                  Service Areas
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-hfts-teal transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-hfts-teal transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-hfts-orange">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-hfts-teal flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">125 Commons Way, Ste 202-203, Unit #164, Villa Rica, GA 30180</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-hfts-teal" />
                <a href="tel:+14702065950" className="text-gray-300 hover:text-hfts-teal transition-colors">
                  +1 (470) 206-5950
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-hfts-teal" />
                <a href="mailto:info@happyfuntimesnacks.com" className="text-gray-300 hover:text-hfts-teal transition-colors">
                  info@happyfuntimesnacks.com
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-hfts-orange">About HFTS</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              We bring premium vending to West Georgia with smart machines, cashless payment, and reliable service. Coming soon: real-time inventory tracking and telemetry dashboards.
            </p>
            <Link
              to="/about"
              className="inline-block text-hfts-teal hover:text-hfts-orange transition-colors font-semibold"
            >
              Learn Our Story →
            </Link>
          </div>
        </div>

        <div className="border-t border-hfts-navy/50 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Happy Fun Time Snacks, LLC. All rights reserved.</p>
          <p className="text-xs mt-2 text-gray-500">Proudly serving West Georgia • Douglas • Carroll • Paulding • Cobb • Haralson</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
