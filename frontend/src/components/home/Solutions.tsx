import React from 'react';

export default function Solutions() {
  const solutions = [
    {
      title: 'Luxury Apartments & Hotels',
      description: 'Premium smart vending machines elevate the resident and guest experience. Our AI-driven vending solutions deliver a seamless, contactless checkout experience that matches the luxury standard of your property. With real-time IoT inventory tracking, we ensure premium product selection is always stocked—from specialty snacks to artisanal beverages. Smart machines with cashless payment systems reduce friction and increase satisfaction. Property managers enjoy zero operational hassle: we handle restocking, maintenance, and machine telemetry. Tenants and guests appreciate the convenience of 24/7 access to premium products without compromising cleanliness or security. Our machines integrate beautifully into high-end spaces while delivering data-driven insights on resident preferences.',
      keywords: ['Luxury amenity', 'Contactless payments', 'AI inventory', 'Premium selection']
    },
    {
      title: 'Warehouse & Industrial Breakrooms',
      description: 'Warehouse breakrooms demand durability, reliability, and efficiency. Our combo vending machines are built for heavy-traffic environments where employees need quick, quality nutrition during shifts. Smart machines automatically track inventory levels, eliminating stockouts when productivity matters most. With IoT-powered telemetry, you get real-time data on what employees prefer—helping optimize product selection for peak satisfaction. Cashless and contactless payment technology means faster transactions and reduced contact points. Our machines handle high-volume usage without compromise. Property managers benefit from remote monitoring and predictive maintenance alerts, minimizing downtime. Happy and productive employees perform better, and our smart vending solutions support workplace wellness initiatives while reducing operational overhead.',
      keywords: ['Durability', 'High-volume usage', 'Smart tracking', 'Employee satisfaction']
    },
    {
      title: 'Corporate Offices',
      description: 'Corporate environments thrive with premium vending solutions that enhance employee experience and support workplace culture. Our smart machines offer a curated selection of premium snacks and beverages—the kind of amenity that signals you care about your team. AI-driven inventory management ensures your premium product selection never disappoints. Contactless payment technology keeps the office safer while improving the user experience. Real-time data from our IoT-enabled machines reveals employee preferences, helping you make informed decisions about product offerings. Happy employees are productive employees—and vending machines that just work remove friction from their day. Plus, zero operational headaches for your facilities team: we handle everything from restocking to machine maintenance. Our tech-forward approach positions your office as forward-thinking and employee-focused.',
      keywords: ['Premium amenity', 'Employee wellness', 'Smart technology', 'Data-driven insights']
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-hfts-navy mb-4 text-center">Why Smart Vending Machines Matter</h2>
        <p className="text-lg text-gray-700 text-center mb-12 max-w-3xl mx-auto">
          HFTS smart vending solutions are designed for institutions that demand more. Cashless technology, real-time inventory tracking, and AI-driven insights—all with zero operational hassle for you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-hfts-navy mb-4">{solution.title}</h3>
              <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                {solution.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {solution.keywords.map((keyword, idx) => (
                  <span key={idx} className="inline-block text-xs font-semibold text-hfts-teal bg-teal-50 px-3 py-1 rounded-full">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
