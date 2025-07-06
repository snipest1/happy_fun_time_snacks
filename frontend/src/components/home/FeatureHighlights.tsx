import React from 'react';
import { CreditCard, WifiIcon, Lock, BarChart4, Smartphone, Repeat, Clock, Tag } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <CreditCard className="h-8 w-8 text-amber-500" />,
    title: "Cashless Payments",
    description: "Support for credit cards, mobile payments, and digital wallets for customer convenience."
  },
  {
    icon: <WifiIcon className="h-8 w-8 text-amber-500" />,
    title: "Remote Monitoring",
    description: "Real-time inventory tracking and machine status updates to ensure optimal operation."
  },
  {
    icon: <Lock className="h-8 w-8 text-amber-500" />,
    title: "Secure Transactions",
    description: "Encrypted payment processing and secure product delivery systems."
  },
  {
    icon: <BarChart4 className="h-8 w-8 text-amber-500" />,
    title: "Sales Analytics",
    description: "Detailed reporting on product performance, sales trends, and customer preferences."
  },
  {
    icon: <Smartphone className="h-8 w-8 text-amber-500" />,
    title: "Mobile App Integration",
    description: "Optional app for customers to browse products, make purchases, and earn rewards."
  },
  {
    icon: <Repeat className="h-8 w-8 text-amber-500" />,
    title: "Automatic Restocking",
    description: "Scheduled restocking based on inventory levels and consumption patterns."
  },
  {
    icon: <Clock className="h-8 w-8 text-amber-500" />,
    title: "24/7 Availability",
    description: "Round-the-clock access to products without staffing requirements."
  },
  {
    icon: <Tag className="h-8 w-8 text-amber-500" />,
    title: "Custom Branding",
    description: "Personalized machine wraps and digital displays with your company branding."
  }
];

const FeatureHighlights: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-blue-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Advanced Features for Modern Vending
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Our machines come equipped with cutting-edge technology to enhance the vending experience for both operators and customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-blue-800 p-6 rounded-xl hover:bg-blue-700 transition-colors duration-300"
            >
              <div className="bg-blue-900 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-blue-100">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
