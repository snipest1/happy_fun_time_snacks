import React from 'react';
import { CreditCard, WifiIcon, Lock, BarChart4, Smartphone, Repeat, Clock, Tag } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: <CreditCard className="h-8 w-8" />,
    title: "Cashless Payments",
    description: "Support for credit cards, mobile payments, and digital wallets.",
    color: 'text-hfts-teal'
  },
  {
    icon: <WifiIcon className="h-8 w-8" />,
    title: "Remote Monitoring",
    description: "Real-time inventory tracking and machine status updates (Coming Soon).",
    color: 'text-hfts-orange'
  },
  {
    icon: <Lock className="h-8 w-8" />,
    title: "Secure Transactions",
    description: "Encrypted payment processing and secure product delivery systems.",
    color: 'text-hfts-coral'
  },
  {
    icon: <BarChart4 className="h-8 w-8" />,
    title: "Sales Analytics",
    description: "Detailed reporting on product performance and sales trends (Coming Soon).",
    color: 'text-hfts-gold'
  },
  {
    icon: <Smartphone className="h-8 w-8" />,
    title: "Smart Integration",
    description: "Optional app for customers to browse products and earn rewards (Coming Soon).",
    color: 'text-hfts-teal'
  },
  {
    icon: <Repeat className="h-8 w-8" />,
    title: "Predictive Restocking",
    description: "Scheduled restocking based on inventory and consumption patterns (Coming Soon).",
    color: 'text-hfts-orange'
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "24/7 Availability",
    description: "Round-the-clock access to premium products, zero downtime.",
    color: 'text-hfts-coral'
  },
  {
    icon: <Tag className="h-8 w-8" />,
    title: "Custom Branding",
    description: "Personalized machine wraps and digital displays with your branding.",
    color: 'text-hfts-gold'
  }
];

const FeatureHighlights: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-hfts-navy text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-display-lg mb-4">
            Advanced Features
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Cutting-edge technology designed to enhance the vending experience for operators and customers alike.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-hfts-navy/50 backdrop-blur border border-hfts-teal/30 p-8 rounded-lg hover:border-hfts-teal hover:bg-hfts-navy/70 transition-all duration-300"
            >
              <div className={`p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4 bg-gradient-orange-coral`}>
                <div className={feature.color}>
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
