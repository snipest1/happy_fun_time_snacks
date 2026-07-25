import React from 'react';
import { useScrollToHash } from '../hooks/useScrollToHash';
import Hero from '../components/home/Hero';
import MachineShowcase from '../components/home/MachineShowcase';
import ProductCategories from '../components/home/ProductCategories';
import FeatureHighlights from '../components/home/FeatureHighlights';
import LocationFinder from '../components/home/LocationFinder';
import ContactSection from '../components/home/ContactSection';
import Testimonials from '../components/home/Testimonials';
import Solutions from '../components/home/Solutions';

export default function HomePage() {
  useScrollToHash();

  return (
    <>
      {/* SDVOSB Badge */}
      <div className="bg-blue-50 border-b-2 border-blue-200 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-bold text-blue-900">
            🇺🇸 Proudly Certified Service-Disabled Veteran-Owned Small Business (SDVOSB)
          </p>
        </div>
      </div>

      <Hero />
      <MachineShowcase />
      <ProductCategories />
      <FeatureHighlights />
      <LocationFinder />
      <ContactSection />
      <Solutions />
      <Testimonials />
    </>
  );
}
