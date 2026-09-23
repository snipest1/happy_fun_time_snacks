import React from 'react';
import { Film, Sparkles } from 'lucide-react';

export default function CraftServicesPage() {
  const services = [
    {
      title: 'Craft Service Drops',
      description: 'Need craft services without a dedicated attendant? We shop, pack, deliver and set up your order based on crew size and preferences. Available for one-day and multi-day productions.',
      icon: Film
    },
    {
      title: 'Managed Craft Stations',
      description: 'For longer production days, we manage your snack and beverage inventory with scheduled replenishment. Set up before crew arrives, we return at intervals to restock drinks, snacks, and supplies.',
      icon: Film
    },
    {
      title: 'Production Pantry Service',
      description: 'Turn your production office, studio, or base camp into a fully stocked pantry. We provide shelving, coolers, beverages, snacks, coffee, and manage replenishment throughout your production.',
      icon: Film
    },
    {
      title: 'Emergency Restocking',
      description: 'Production ran longer than expected? Crew went through drinks faster than planned? We offer short-notice craft service and production snack replenishment based on availability. Rush fees may apply.',
      icon: Film
    }
  ];

  return (
    <div className="w-full">
      <section className="bg-gradient-navy-to-teal py-16 md:py-24 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-display-xl mb-4">Production Craft Services</h1>
          <p className="text-xl text-gray-100 max-w-2xl">Keep your crew stocked from call time to wrap. We handle the shopping, delivery, setup and restocking so your production team has one less thing to manage.</p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold mb-6 text-hfts-navy">Craft Services Built Around Your Production</h2>
          <p className="text-gray-700 mb-4">Every production is different. Crew size changes. Call times move. Locations change. Days run longer than expected. Our production services are designed with that reality in mind.</p>
          <p className="text-gray-700 mb-6">Tell us your crew size, production dates, location and expected schedule. We'll build a snack and beverage program around your needs, including dietary preferences and special requests.</p>
          <div className="flex flex-wrap gap-2">
            {['FilmProduction', 'TelevisionProduction', 'CommercialShoots', 'PhotographyProductions', 'MusicVideos', 'CraftServices'].map((tag) => (
              <span key={tag} className="text-xs bg-hfts-teal/10 text-hfts-teal px-2 py-1 rounded">#{tag}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-hfts-navy">Service Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-hfts-orange">
                  <Icon className="w-8 h-8 text-hfts-orange mb-3" />
                  <h3 className="text-xl font-bold mb-2 text-hfts-navy">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold mb-6 text-hfts-navy">Craft Service Inventory</h2>
          <p className="text-gray-700 mb-4">We can provide a mix of refreshments tailored to your crew and production:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 text-gray-700">
            <li>• Bottled water and hydration beverages</li>
            <li>• Soft drinks and sparkling water</li>
            <li>• Energy drinks and juices</li>
            <li>• Chips and salty snacks</li>
            <li>• Cookies and sweet snacks</li>
            <li>• Granola and protein bars</li>
            <li>• Nuts and trail mix</li>
            <li>• Fruit and select fresh items</li>
            <li>• Coffee and tea service</li>
            <li>• Vegan and gluten-free options</li>
            <li>• Cups, napkins and supplies</li>
          </ul>
          <p className="text-gray-700">Choose from simple delivery or scheduled replenishment throughout the production day.</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-hfts-teal">
            <div className="flex items-start gap-4">
              <Sparkles className="w-10 h-10 text-hfts-teal flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-3 text-hfts-navy">Premieres & Red Carpet Events</h2>
                <p className="text-gray-700 mb-4">Beyond production, we support premiere events, red carpet appearances, and entertainment industry gatherings with premium snack and beverage service. Whether it's a small VIP event or a major production celebration, we'll customize refreshment service to match the occasion.</p>
                <div className="flex flex-wrap gap-2">
                  {['PremierEvents', 'RedCarpet', 'Entertainment', 'EventCatering', 'MetroAtlanta'].map((tag) => (
                    <span key={tag} className="text-xs bg-hfts-teal/10 text-hfts-teal px-2 py-1 rounded">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold mb-6 text-hfts-navy">Service Area & Scheduling</h2>
          <p className="text-gray-700 mb-4">We serve productions throughout Metro Atlanta, including Atlanta and surrounding communities across Fulton, Cobb, Douglas, Paulding, Carroll and nearby counties. Have a production outside our normal service area? Send us your location and production dates for availability.</p>
          <p className="text-gray-700 mb-6">Production schedules don't always follow normal business hours. Early call times, extended shoot days, location changes and last-minute needs are part of production. We build your service schedule around your team's requirements. For the widest selection and easiest scheduling, we recommend booking at least 7 days before your first production date. Requests within 72 hours may be available with a rush fee.</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['AtlantaProductions', 'MetroAtlanta', 'FlexibleScheduling', 'ProductionSupport'].map((tag) => (
              <span key={tag} className="text-xs bg-hfts-teal/10 text-hfts-teal px-2 py-1 rounded">#{tag}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-hfts-navy text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-display-lg mb-6">Request Production Service</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">Send us your production dates, location, estimated crew size, expected call and wrap times, dietary requirements, and service type for a quote.</p>
          <a href="/contact" className="inline-block bg-hfts-orange hover:bg-hfts-coral text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors">Get a Production Quote</a>
        </div>
      </section>
    </div>
  );
}
