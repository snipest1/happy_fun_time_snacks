import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';

interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  type: string;
  machines: string[];
}

const locations: Location[] = [
  {
    id: 1,
    name: "Central Business Tower",
    address: "123 Business Ave, Floor 12",
    city: "Douglasville, GA",
    type: "office",
    machines: ["Premium Snack Vending", "Beverage Station"]
  },
  {
    id: 2,
    name: "Carrollton Industrial Complex",
    address: "500 Industrial Dr, Building A",
    city: "Carrollton, GA",
    type: "warehouse",
    machines: ["Combo Premium", "Coffee & Snacks"]
  },
  {
    id: 3,
    name: "West Georgia Medical Center",
    address: "800 Medical Parkway, Main Lobby",
    city: "Villa Rica, GA",
    type: "healthcare",
    machines: ["Fresh Food Options", "Beverage Station"]
  },
  {
    id: 4,
    name: "Cobb County Luxury Apartments",
    address: "450 Residential Lane, Common Area",
    city: "Marietta, GA",
    type: "residential",
    machines: ["Premium Snacks", "Coffee Station"]
  },
  {
    id: 5,
    name: "Paulding Distribution Center",
    address: "2100 Logistics Pkwy, Building C",
    city: "Dallas, GA",
    type: "warehouse",
    machines: ["Premium Snack Vending", "Beverage Station", "Coffee & Snacks"]
  },
  {
    id: 6,
    name: "Haralson County Government Complex",
    address: "75 Government Blvd",
    city: "Bremen, GA",
    type: "government",
    machines: ["Healthy Options", "Cold Beverages"]
  }
];

const LocationFinder: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const locationTypes = [
    { id: 'all', name: 'All Locations' },
    { id: 'office', name: 'Office Buildings' },
    { id: 'warehouse', name: 'Warehouses' },
    { id: 'healthcare', name: 'Healthcare Facilities' },
    { id: 'residential', name: 'Apartments' },
    { id: 'government', name: 'Government Facilities' }
  ];

  const filteredLocations = locations
    .filter(location => selectedType === 'all' || location.type === selectedType)
    .filter(location => 
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <section id="locations" className="py-20 bg-hfts-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-display-lg text-hfts-navy mb-4">
            Service Locations
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Find HFTS vending machines across West Georgia. Use the filters to search by location type or facility name.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-10">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by location name or address..."
                className="pl-10 pr-4 py-3 w-full border-2 border-hfts-teal rounded-lg focus:outline-none focus:ring-2 focus:ring-hfts-orange bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 border-2 border-hfts-teal rounded-lg focus:outline-none focus:ring-2 focus:ring-hfts-orange bg-white text-hfts-navy font-semibold"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {locationTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          {/* Location Results */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="divide-y divide-gray-200">
              {filteredLocations.length > 0 ? (
                filteredLocations.map(location => (
                  <div key={location.id} className="p-6 hover:bg-hfts-cream transition-colors">
                    <div className="flex items-start">
                      <div className="bg-hfts-teal/10 p-3 rounded-full mr-4 flex-shrink-0">
                        <MapPin className="h-6 w-6 text-hfts-teal" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-hfts-navy">{location.name}</h3>
                        <p className="text-gray-600 text-sm">{location.address}</p>
                        <p className="text-gray-600 text-sm mb-3">{location.city}</p>
                        <div className="flex flex-wrap gap-2">
                          {location.machines.map((machine, index) => (
                            <span 
                              key={index} 
                              className="text-xs bg-hfts-orange/10 text-hfts-orange px-3 py-1 rounded-full font-semibold border border-hfts-orange/20"
                            >
                              {machine}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No locations found matching your criteria. Check back soon as we expand across West Georgia!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationFinder;