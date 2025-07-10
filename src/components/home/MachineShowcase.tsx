import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Monitor,
  CreditCard,
  UserPlus,
  LineChart,
} from 'lucide-react';

const machines = [
  {
    id: 1,
    name: 'Futura Snack & Drink Combo',
    description:
      'Professional-grade vending machine combining snacks and drinks in a secure, modern unit. Accepts cash, card, and contactless payments.',
    image:
      'https://cdn.shopify.com/s/files/1/0655/7127/0734/files/FuturaSnackandDrinkComboVendingMachine.jpg?v=1707333743',
    features: [
      'Dual Temperature Zones',
      'Cashless & Contactless Payment',
      'Energy Efficient LED Lighting',
      'Remote Inventory Monitoring',
    ],
    capacity: '40 Selections (Snacks + Drinks)',
    dimensions: '72"H x 29.5"W x 38"D',
  },
  {
    id: 2,
    name: 'Premium Snack Vending',
    description:
      'Our flagship snack vending machine with 40+ product selections, touchscreen interface, and cashless payment options.',
    image: 'https://picsum.photos/id/96/800/600',
    features: [
      'Touchscreen Interface',
      'Cashless Payment',
      'Remote Monitoring',
      'Custom Branding',
    ],
    capacity: '40+ Products',
    dimensions: '72"H x 39"W x 36"D',
  },
  {
    id: 3,
    name: 'Beverage Station',
    description:
      'Temperature-controlled beverage machine with 8 selections of cold drinks and real-time inventory tracking.',
    image: 'https://picsum.photos/id/225/800/600',
    features: [
      'Temperature Control',
      'Energy Efficient',
      'Illuminated Display',
      'Remote Monitoring',
    ],
    capacity: '384 Cans/Bottles',
    dimensions: '72"H x 52"W x 32"D',
  },
  {
    id: 4,
    name: 'Micro Market',
    description:
      'Self-service mini convenience store with open shelving, refrigerated section, and self-checkout kiosk.',
    image: 'https://picsum.photos/id/119/800/600',
    features: [
      'Open Design',
      'Self-Checkout',
      'Wide Selection',
      'Fresh Options',
    ],
    capacity: '200+ Products',
    dimensions: 'Custom Installation',
  },
];

const MachineShowcase: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextMachine = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % machines.length);
  };

  const prevMachine = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + machines.length) % machines.length
    );
  };

  const currentMachine = machines[currentIndex];

  return (
    <section id="machines" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Premium Vending Solutions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our range of cutting-edge vending machines designed for
            reliability, convenience, and a superior customer experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Machine Image */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl group">
            <img
              src={currentMachine.image}
              alt={currentMachine.name}
              className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent flex items-end">
              <div className="p-6">
                <h3 className="text-white text-2xl font-bold">
                  {currentMachine.name}
                </h3>
                <p className="text-gray-200">{currentMachine.capacity}</p>
              </div>
            </div>
          </div>

          {/* Machine Details */}
          <div className="p-6">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {currentMachine.name}
            </h3>
            <p className="text-gray-600 mb-6">{currentMachine.description}</p>

            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Key Features
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentMachine.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="bg-blue-100 text-blue-800 p-2 rounded-full">
                      {index % 4 === 0 && <Monitor className="h-5 w-5" />}
                      {index % 4 === 1 && <CreditCard className="h-5 w-5" />}
                      {index % 4 === 2 && <UserPlus className="h-5 w-5" />}
                      {index % 4 === 3 && <LineChart className="h-5 w-5" />}
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Specifications
              </h4>
              <p>
                <span className="font-medium">Dimensions:</span>{' '}
                {currentMachine.dimensions}
              </p>
              <p>
                <span className="font-medium">Capacity:</span>{' '}
                {currentMachine.capacity}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-1">
                {machines.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentIndex === index
                        ? 'bg-blue-800 w-6'
                        : 'bg-gray-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={prevMachine}
                  className="bg-gray-200 hover:bg-gray-300 p-3 rounded-full transition-colors"
                  aria-label="Previous machine"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={nextMachine}
                  className="bg-blue-800 hover:bg-blue-900 p-3 rounded-full transition-colors"
                  aria-label="Next machine"
                >
                  <ArrowRight className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MachineShowcase;

