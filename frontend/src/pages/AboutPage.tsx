import React from 'react';
import { Heart, Globe, Zap } from 'lucide-react';

export default function AboutPage() {
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
          <h1 className="text-display-xl mb-4">About Happy Fun Time Snacks</h1>
          <p className="text-xl text-gray-100 max-w-2xl">
            Premium vending with zero hassle. Because happy employees and guests create better places.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 bg-hfts-cream">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-display-lg mb-8 text-hfts-navy">Our Story</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6 leading-relaxed">
              Happy Fun Time Snacks was founded with a simple belief: vending machines shouldn't feel like an afterthought. 
              They should be a premium amenity that shows employees and guests they're valued.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Drawing inspiration from Japan's attention to detail and combining it with Georgia hospitality, 
              we built HFTS to solve the real problems facility managers face: outdated machines, unpredictable stocking, 
              and high maintenance overhead.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Today, we're bringing premium smart vending to West Georgia—starting with warehouses, government facilities, 
              and luxury apartments. Our goal is simple: zero hassle for you, happy people at your location.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-display-lg mb-12 text-center text-hfts-navy">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Heart className="w-16 h-16 text-hfts-coral mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-hfts-navy">Premium Experience</h3>
              <p className="text-gray-600">
                Every interaction with HFTS reflects quality, from the machines themselves to our support.
              </p>
            </div>
            <div className="text-center">
              <Zap className="w-16 h-16 text-hfts-orange mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-hfts-navy">Zero Hassle</h3>
              <p className="text-gray-600">
                Installation, maintenance, restocking—we handle it all so you can focus on your core business.
              </p>
            </div>
            <div className="text-center">
              <Globe className="w-16 h-16 text-hfts-teal mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-hfts-navy">Innovation Ready</h3>
              <p className="text-gray-600">
                Smart monitoring and predictive analytics are coming. Built to evolve with your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-hfts-navy text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-display-lg mb-6">Ready to Experience the Difference?</h2>
          <a
            href="/contact"
            className="inline-block bg-hfts-orange hover:bg-hfts-coral text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
          >
            Get Started Today
          </a>
        </div>
      </section>
    </div>
  );
}
