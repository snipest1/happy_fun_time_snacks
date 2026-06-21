import React, { useState, useEffect, useRef } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  content: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    position: "Facilities Manager",
    company: "Cobb County Warehouse",
    content: "HFTS installed machines in our warehouse and honestly, the team made it zero hassle. We pay monthly, they handle everything, and employees love the premium selection. Best decision we made.",
    avatar: "https://picsum.photos/id/237/200"
  },
  {
    id: 2,
    name: "Michael Chen",
    position: "Property Manager",
    company: "Paulding Luxury Apartments",
    content: "Our residents were asking for vending. HFTS showed up, installed it, and handles all the maintenance. Residents are happy, we have zero headaches. That's exactly what we wanted.",
    avatar: "https://picsum.photos/id/1012/200"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    position: "Operations Lead",
    company: "Douglas County Distribution Center",
    content: "The cashless payment system is fantastic. Employees don't carry cash, transactions are instant, and the machine selection is way better than what we had before. Highly recommend HFTS.",
    avatar: "https://picsum.photos/id/1027/200"
  },
  {
    id: 4,
    name: "James Wilson",
    position: "Auxiliary Director",
    company: "AUC Campus Partnership",
    content: "Students appreciate the premium options and cashless system. HFTS integrated smoothly with our operations, and the support has been responsive. Exactly what a modern campus needs.",
    avatar: "https://picsum.photos/id/1001/200"
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const testimonialRef = useRef<HTMLDivElement>(null);

  const nextTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 8000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <section className="py-20 bg-gradient-to-b from-hfts-cream to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-display-lg text-hfts-navy mb-4">
            What Our Operators Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Hear from property managers and operators across West Georgia who chose HFTS for premium vending.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 hidden md:block">
            <button
              onClick={prevTestimonial}
              className="bg-hfts-navy hover:bg-hfts-navy/80 p-3 rounded-full shadow-lg transition-colors"
              aria-label="Previous testimonial"
              disabled={isAnimating}
            >
              <ChevronLeft className="h-6 w-6 text-hfts-teal" />
            </button>
          </div>

          <div className="overflow-hidden py-8" ref={testimonialRef}>
            <div 
              className="transition-all duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${currentIndex * 100}%)`,
                display: 'flex'
              }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-white rounded-lg shadow-lg p-8 md:p-10 border-t-4 border-hfts-teal">
                    <div className="flex items-start gap-5 mb-6">
                      <Quote className="h-8 w-8 text-hfts-orange flex-shrink-0" />
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-hfts-gold text-hfts-gold" />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-lg leading-relaxed mb-8 italic">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="flex items-center pt-6 border-t border-gray-200">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-hfts-teal"
                      />
                      <div>
                        <h4 className="font-bold text-hfts-navy text-lg">{testimonial.name}</h4>
                        <p className="text-gray-600 text-sm">
                          {testimonial.position}
                        </p>
                        <p className="text-hfts-orange font-semibold text-sm">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -right-10 top-1/2 -translate-y-1/2 hidden md:block">
            <button
              onClick={nextTestimonial}
              className="bg-hfts-navy hover:bg-hfts-navy/80 p-3 rounded-full shadow-lg transition-colors"
              aria-label="Next testimonial"
              disabled={isAnimating}
            >
              <ChevronRight className="h-6 w-6 text-hfts-teal" />
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="flex justify-center space-x-4 mt-6 md:hidden">
            <button
              onClick={prevTestimonial}
              className="bg-hfts-navy p-3 rounded-full shadow-lg transition-colors"
              aria-label="Previous testimonial"
              disabled={isAnimating}
            >
              <ChevronLeft className="h-5 w-5 text-hfts-teal" />
            </button>
            <button
              onClick={nextTestimonial}
              className="bg-hfts-navy p-3 rounded-full shadow-lg transition-colors"
              aria-label="Next testimonial"
              disabled={isAnimating}
            >
              <ChevronRight className="h-5 w-5 text-hfts-teal" />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`transition-all ${
                  currentIndex === index 
                    ? 'bg-hfts-orange w-8 h-3 rounded-full' 
                    : 'bg-hfts-teal/30 w-3 h-3 rounded-full hover:bg-hfts-teal/50'
                }`}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setCurrentIndex(index);
                  }
                }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;