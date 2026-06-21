import React from 'react';
import { MapPin } from 'lucide-react';

export default function ServiceAreasPage() {
  const counties = [
    {
      name: 'Douglas County',
      cities: ['Douglasville', 'Lithia Springs', 'Winston', 'Villa Rica'],
      description: 'Serving warehouses, industrial facilities, medical offices, and hospitality properties.'
    },
    {
      name: 'Carroll County',
      cities: ['Carrollton', 'Villa Rica', 'Temple', 'Bowdon'],
      description: 'Supporting manufacturing facilities, colleges, healthcare facilities, and luxury hotels.'
    },
    {
      name: 'Paulding County',
      cities: ['Dallas', 'Hiram', 'Braswell', 'Yorkville'],
      description: 'Providing vending solutions for distribution centers, apartments, and professional offices.'
    },
    {
      name: 'Cobb County',
      cities: ['Marietta', 'Kennesaw', 'Smyrna', 'Acworth', 'Austell'],
      description: 'Servicing major industrial parks, corporate offices, and luxury apartment communities.'
    },
    {
      name: 'Haralson County',
      cities: ['Bremen', 'Tallapoosa', 'Buchanan', 'Waco'],
      description: 'Supporting manufacturing, healthcare, schools, and commercial properties.'
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-navy-to-teal py-16 md:py-24 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-display-xl mb-4">Service Areas</h1>
          <p className="text-xl text-gray-100 max-w-2xl">
            Proudly serving West Georgia with premium vending solutions. Expanding coverage across five counties to support your business.
          </p>
        </div>
      </section>

      {/* Counties Grid */}
      <section className="py-16 md:py-24 bg-hfts-cream">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {counties.map((county, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start mb-4">
                  <MapPin className="w-6 h-6 text-hfts-orange mr-3 flex-shrink-0 mt-1" />
                  <h3 className="text-2xl font-bold text-hfts-navy">{county.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{county.description}</p>
                <div className="flex flex-wrap gap-2">
                  {county.cities.map((city, cidx) => (
                    <span
                      key={cidx}
                      className="inline-block bg-hfts-teal/10 text-hfts-teal px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-hfts-navy text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-display-lg mb-6">Is Your Location Covered?</h2>
          <a
            href="/contact"
            className="inline-block bg-hfts-orange hover:bg-hfts-coral text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
          >
            Check Availability
          </a>
        </div>
      </section>
    </div>
  );
}
