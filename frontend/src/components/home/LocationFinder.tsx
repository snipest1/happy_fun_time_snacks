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
    city: "New York, NY",
    type: "office",
    machines: ["Premium Snack Vending", "Beverage Station"]
  },
  {
    id: 2,
    name: "Metro University",
    address: "500 University Dr, Student Center",
    city: "Boston, MA",
    type: "education",
    machines: ["Combo Deluxe", "Coffee & Snacks"]
  },
  {
    id: 3,
    name: "City Hospital",
    address: "800 Medical Parkway, Main Lobby",
    city: "Chicago, IL",
    type: "healthcare",
    machines: ["Fresh Food Options", "Beverage Station"]
  },
  {
    id: 4,
    name: "West Side Apartments",
    address: "450 Residential Lane, Common Area",
    city: "Los Angeles, CA",
    type: "residential",
    machines: ["Micro Market", "Coffee Station"]
  },
  {
    id: 5,
    name: "Tech Innovation Campus",
    address: "2100 Technology Pkwy, Building C",
    city: "San Francisco, CA",
    type: "office",
    machines: ["Premium Snack Vending", "Beverage Station", "Micro Market"]
  },
  {
    id: 6,
    name: "Downtown Fitness Center",
    address: "75 Wellness Blvd",
    city: "Miami, FL",
    type: "fitness",
    machines: ["Healthy Options", "Cold Beverages"]
  }
];

const LocationFinder: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const locationTypes = [
    { id: 'all', name: 'All Locations' },
    { id: 'office', name: 'Office Buildings' },
    { id: 'education', name: 'Educational Institutions' },
    { id: 'healthcare', name: 'Healthcare Facilities' },
    { id: 'residential', name: 'Residential Properties' },
    { id: 'fitness', name: 'Fitness Centers' }
  ];

  const filteredLocations = locations
    .filter(location => selectedType === 'all' || location.type === selectedType)
    .filter(location => 
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <section id="locations" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Our Vending Machines
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Locate our vending machines in various locations across the country.
            Use the filters below to find machines near you.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-10">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location name or address..."
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {locationTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          {/* Location Results */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="grid grid-cols-1 divide-y divide-gray-200">
              {filteredLocations.length > 0 ? (
                filteredLocations.map(location => (
                  <div key={location.id} className="p-6 hover:bg-blue-50 transition-colors">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <MapPin className="h-6 w-6 text-blue-800" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
                        <p className="text-gray-600">{location.address}</p>
                        <p className="text-gray-600 mb-2">{location.city}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {location.machines.map((machine, index) => (
                            <span 
                              key={index} 
                              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
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
                  No locations found matching your criteria. Please try a different search.
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