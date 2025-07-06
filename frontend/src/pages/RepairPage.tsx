import React from 'react';
import RepairRequestSection from '../components/repair/RepairRequestSection';

export default function RepairPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 sm:pt-32">
      <div className="py-12 px-4 sm:px-8 lg:px-16 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Vending Machine Repair Services</h1>
        <p className="text-lg text-gray-700 text-center mb-10">
          Fast, reliable, and professional vending machine repairs. Whether it’s a card reader issue,
          product jam, or complete machine failure — we’ll connect you with trusted techs to get you back in business.
        </p>

        <RepairRequestSection />
      </div>
    </main>
  );
}

