import React from 'react';
import ContactSection from '../components/home/ContactSection';

export default function ContactPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-navy-to-teal py-12 md:py-16 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-display-lg mb-2">Get in Touch</h1>
          <p className="text-xl text-gray-100">
            Questions about our vending solutions? We're here to help.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <ContactSection />
    </div>
  );
}
