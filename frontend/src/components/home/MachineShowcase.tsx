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
    image:`${import.meta.env.BASE_URL}images/2775544.jpg`,
    features: [
      'Dual Temperature Zones',
      'Cashless & Contactless Payment',
      'Energy Efficient LED Lighting',
      'Remote Inventory Monitoring',
    ],
    capacity: '40 Selections (Snacks + Drinks)',
    dimensions: '72"H x 29.5"W x 38"D',
  },
];

const MachineShowcase: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMachine = machines[currentIndex];

  return (
    <section id="machines" className="py-20 bg-white text-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">
          Our Featured Machine
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="rounded-xl overflow-hidden shadow-xl">
            <img
              src={currentMachine.image}
              alt={currentMachine.name}
              className="w-full h-[500px] object-cover"
            />
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">{currentMachine.name}</h3>
            <p className="mb-6">{currentMachine.description}</p>

            <h4 className="font-semibold mb-2">Key Features</h4>
            <ul className="mb-4 list-disc list-inside space-y-2">
              {currentMachine.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>

            <p>
              <strong>Dimensions:</strong> {currentMachine.dimensions}
            </p>
            <p>
              <strong>Capacity:</strong> {currentMachine.capacity}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MachineShowcase;
