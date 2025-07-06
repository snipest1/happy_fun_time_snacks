import React from 'react';
import { useScrollToHash } from '../hooks/useScrollToHash';
import Hero from '../components/home/Hero';
import MachineShowcase from '../components/home/MachineShowcase';
import ProductCategories from '../components/home/ProductCategories';
import FeatureHighlights from '../components/home/FeatureHighlights';
import LocationFinder from '../components/home/LocationFinder';
import ContactSection from '../components/home/ContactSection';
import Testimonials from '../components/home/Testimonials';

export default function HomePage() {
  useScrollToHash();


  return (
    <>
      <Hero />
      <MachineShowcase />
      <ProductCategories />
      <FeatureHighlights />
      <LocationFinder />
      <ContactSection />
      <Testimonials />
    </>
  );
}

