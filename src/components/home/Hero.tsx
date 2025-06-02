import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

const Hero: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const slides = [
    {
      title: "Smart Vending Solutions",
      subtitle: "Revolutionize Your Vending Experience",
      description: "State-of-the-art vending machines with touchless payment, remote monitoring, and premium product selection.",
      image: "https://picsum.photos/id/1/1200/800"
    },
    {
      title: "Cashless Payment",
      subtitle: "Convenient Transactions",
      description: "Our machines support credit cards, mobile payments, and digital wallets for a seamless customer experience.",
      image: "https://picsum.photos/id/20/1200/800"
    },
    {
      title: "24/7 Availability",
      subtitle: "Always There When Needed",
      description: "Provide your customers or employees with round-the-clock access to refreshments and essentials.",
      image: "https://picsum.photos/id/165/1200/800"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            activeSlide === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
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
              <h2 className="text-amber-500 font-semibold text-xl md:text-2xl mb-2">
                {slide.subtitle}
              </h2>
              <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {slide.title}
              </h1>
              <p className="text-gray-200 text-lg md:text-xl mb-8 max-w-2xl">
                {slide.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-medium transition-all transform hover:scale-105 shadow-lg flex items-center justify-center">
                  <span>Explore Machines</span>
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
                <button className="bg-transparent hover:bg-white/10 text-white border-2 border-white px-8 py-3 rounded-full font-medium transition-all">
                  Request a Quote
                </button>
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
            className={`w-3 h-3 rounded-full transition-all ${
              activeSlide === index ? 'bg-amber-500 w-12' : 'bg-white/50'
            }`}
            onClick={() => setActiveSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;