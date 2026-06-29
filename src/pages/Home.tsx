import React from 'react';
import Hero from '../components/home/Hero';
import MachineShowcase from '../components/home/MachineShowcase';
import ProductCategories from '../components/home/ProductCategories';
import FeatureHighlights from '../components/home/FeatureHighlights';
import LocationFinder from '../components/home/LocationFinder';
import ContactSection from '../components/home/ContactSection';
import Testimonials from '../components/home/Testimonials';

export default function Home() {
  return (
    <>
      <Hero />
      <MachineShowcase />
      <ProductCategories />
      <FeatureHighlights />
      <Testimonials />
      <LocationFinder />
      <ContactSection />
    </>
  );
}
