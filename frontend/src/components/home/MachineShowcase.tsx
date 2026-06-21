import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Zap,
  CreditCard,
  Smartphone,
  TrendingUp,
} from 'lucide-react';

const machines = [
  {
    id: 1,
    name: 'Premium Smart Vending Machine',
    description:
      'Our flagship vending machine combines professional-grade hardware with smart technology. Cashless & contactless payment, real-time monitoring, and premium product selection in one sleek unit.',
    image:`${import.meta.env.BASE_URL}images/2775544.jpg`,
    features: [
      'Dual Temperature Zones',
      'Cashless & Contactless Payment',
      'Energy Efficient LED Lighting',
      'Real-Time Inventory Monitoring (Coming Soon)',
    ],
    capacity: '40 Selections (Snacks + Drinks)',
    dimensions: '72"H x 29.5"W x 38"D',
  },
];

const MachineShowcase: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMachine = machines[currentIndex];

  const highlights = [
    { icon: CreditCard, label: 'Cashless Payment', color: 'text-hfts-teal' },
    { icon: Smartphone, label: 'Smart Monitoring', color: 'text-hfts-orange' },
    { icon: Zap, label: 'Energy Efficient', color: 'text-hfts-coral' },
    { icon: TrendingUp, label: 'Premium Selection', color: 'text-hfts-gold' },
  ];

  return (
    <section id="machines" className="py-20 bg-white text-hfts-navy">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-display-lg mb-4">
            Our Machine
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built for reliability, designed for premium experience. Zero hassle. Happy people.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-12">
          <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-hfts-teal/20">
            <img
              src={currentMachine.image}
              alt={currentMachine.name}
              className="w-full h-[500px] object-cover"
            />
          </div>

          <div>
            <h3 className="text-3xl font-bold mb-4 text-hfts-navy">{currentMachine.name}</h3>
            <p className="text-gray-700 mb-8 leading-relaxed text-lg">{currentMachine.description}</p>

            <h4 className="font-bold text-hfts-orange mb-4 text-lg">Key Features</h4>
            <ul className="mb-8 space-y-3">
              {currentMachine.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 rounded-full bg-hfts-teal mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-2 gap-4 p-6 bg-hfts-cream rounded-lg">
              <div>
                <p className="text-sm text-gray-600 mb-1">Capacity</p>
                <p className="font-bold text-hfts-navy">{currentMachine.capacity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Dimensions</p>
                <p className="font-bold text-hfts-navy">{currentMachine.dimensions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="text-center p-6 bg-hfts-cream rounded-lg">
                <Icon className={`h-8 w-8 mx-auto mb-3 ${item.color}`} />
                <p className="font-semibold text-hfts-navy text-sm">{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MachineShowcase;
