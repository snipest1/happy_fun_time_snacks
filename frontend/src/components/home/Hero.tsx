import React, { useEffect, useState } from 'react';
import { ChevronRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const slides = [
    {
      title: "Premium Smart Vending",
      subtitle: "Zero Hassle. Happy People.",
      description: "Modern vending machines with cashless payment, real-time monitoring, and premium refreshments. We handle installation, maintenance, and support.",
      cta: "See Our Services",
      image: "/vending-hero-1.jpg" // Updated path
    },
    {
      title: "Warehouses. Government. Apartments.",
      subtitle: "Built for Serious Operations",
      description: "Serving West Georgia with reliable vending solutions that keep employees, staff, and residents satisfied.",
      cta: "Check Service Areas",
      image: "/vending-hero-2.jpg"
    },
    {
      title: "Coming Soon: Smart Tracking",
      subtitle: "Real-Time Inventory & Analytics",
      description: "Predictive restocking, telemetry dashboards, and automated alerts. Innovation built in from the start.",
      cta: "Learn More",
      image: "/vending-hero-3.jpg"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative h-screen overflow-hidden bg-hfts-navy">
      {/* Background Slides with Overlay */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            activeSlide === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Gradient overlay instead of just dark */}
          <div className="absolute inset-0 bg-gradient-to-r from-hfts-navy/80 to-hfts-navy/40 z-10" />
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              // Fallback to gradient if image doesn't load
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      ))}

      {/* Content */}
      <div className="container mx-auto px-4 h-full flex items-center relative z-20">
        <div className="max-w-3xl">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 transform ${
                activeSlide === index
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8 absolute'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-hfts-orange" />
                <h2 className="text-hfts-orange font-display font-bold text-lg md:text-xl">
                  {slide.subtitle}
                </h2>
              </div>
              <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
                {slide.title}
              </h1>
              <p className="text-gray-200 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
                {slide.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={index === 0 ? '/services' : index === 1 ? '/service-areas' : '/about'}
                  className="bg-hfts-orange hover:bg-hfts-coral text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  <span>{slide.cta}</span>
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/contact"
                  className="bg-transparent hover:bg-white/10 text-white border-2 border-hfts-teal px-8 py-4 rounded-lg font-bold text-lg transition-all"
                >
                  Get a Quote
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`transition-all ${
              activeSlide === index 
                ? 'bg-hfts-teal w-12 h-3 rounded-full' 
                : 'bg-white/50 w-3 h-3 rounded-full hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;