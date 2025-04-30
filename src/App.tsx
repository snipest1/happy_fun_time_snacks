import React from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import MachineShowcase from './components/home/MachineShowcase';
import ProductCategories from './components/home/ProductCategories';
import FeatureHighlights from './components/home/FeatureHighlights';
import LocationFinder from './components/home/LocationFinder';
import ContactSection from './components/home/ContactSection';
import Testimonials from './components/home/Testimonials';

function App() {
  // Update document title
  React.useEffect(() => {
    document.title = 'VendTech | Smart Vending Solutions';
    
    // Find title element that has data-default attribute
    const titleElement = document.querySelector('title[data-default]');
    if (titleElement) {
      titleElement.removeAttribute('data-default');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <main className="pt-20"> {/* Account for fixed header */}
        <Hero />
        <MachineShowcase />
        <ProductCategories />
        <FeatureHighlights />
        <Testimonials />
        <LocationFinder />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;