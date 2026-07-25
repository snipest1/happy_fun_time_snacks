import React from 'react';
import { Coffee, Package, Zap, Smartphone } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      icon: Package,
      title: 'Premium Snack Vending',
      description: 'Curated selection of high-quality snacks and refreshments, stocked fresh and maintained to premium standards.'
    },
    {
      icon: Coffee,
      title: 'Office Coffee Service',
      description: 'Professional coffee programs designed to keep your workplace energized throughout the day.'
    },
    {
      icon: Smartphone,
      title: 'Cashless Payment',
      description: 'Modern touchless transactions with credit cards, mobile payments, and digital wallets.'
    },
    {
      icon: Zap,
      title: 'Smart Monitoring (Coming Soon)',
      description: 'Real-time inventory tracking, predictive analytics, and remote telemetry for seamless operations.'
    }
  ];

  return (
    <div className="w-full">
      {/* SDVOSB Badge */}
      <section className="bg-blue-50 border-b-2 border-blue-200 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-bold text-blue-900">
            🇺🇸 Proudly Certified Service-Disabled Veteran-Owned Small Business (SDVOSB)
          </p>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-gradient-navy-to-teal py-16 md:py-24 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-display-xl mb-4">Our Services</h1>
          <p className="text-xl text-gray-100 max-w-2xl">
            Premium vending solutions designed with zero hassle in mind. We handle installation, maintenance, and support so you focus on what matters.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-hfts-teal">
                  <div className="mb-4">
                    <Icon className="w-12 h-12 text-hfts-teal" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-hfts-navy">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-hfts-navy text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-display-lg mb-6">Ready to Upgrade Your Breakroom?</h2>
          
            href="/contact"
            className="inline-block bg-hfts-orange hover:bg-hfts-coral text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
          >
            Request a Quote
          </a>
        </div>
      </section>
    </div>
  );
}
