import React, { useState, useEffect, useRef } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

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
    position: "Office Manager",
    company: "Tech Innovations Inc.",
    content: "Installing VendTech machines in our office has been a game changer. Employees love the variety of healthy options, and the cashless payment system makes it incredibly convenient. The customer service has been exceptional as well.",
    avatar: "https://picsum.photos/id/237/200"
  },
  {
    id: 2,
    name: "Michael Chen",
    position: "Facilities Director",
    company: "Central University",
    content: "We've had VendTech machines across our campus for over 2 years now. Students appreciate the 24/7 access to quality snacks and beverages. The remote monitoring has been particularly valuable, ensuring machines are always stocked and operational.",
    avatar: "https://picsum.photos/id/1012/200"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    position: "HR Director",
    company: "Healthcare Partners",
    content: "VendTech understood our specific needs for healthier options in a healthcare setting. Their machines are reliable, energy-efficient, and their team handles everything from installation to maintenance. Highly recommended!",
    avatar: "https://picsum.photos/id/1027/200"
  },
  {
    id: 4,
    name: "James Wilson",
    position: "Property Manager",
    company: "Westside Residences",
    content: "Our residents have given overwhelmingly positive feedback about the VendTech machines we installed in our common areas. The modern designs fit perfectly with our aesthetic, and the selection of products is excellent.",
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
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from businesses and organizations that have transformed their refreshment services with our vending solutions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 hidden md:block">
            <button
              onClick={prevTestimonial}
              className="bg-white p-3 rounded-full shadow-md hover:bg-gray-50 transition-colors"
              aria-label="Previous testimonial"
              disabled={isAnimating}
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" />
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
                  <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
                    <div className="flex items-start gap-5">
                      <div className="flex-shrink-0">
                        <Quote className="h-10 w-10 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-gray-700 text-lg italic mb-6">
                          "{testimonial.content}"
                        </p>
                        
                        <div className="flex items-center">
                          <img 
                            src={testimonial.avatar} 
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover mr-4"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                            <p className="text-gray-600 text-sm">
                              {testimonial.position}, {testimonial.company}
                            </p>
                          </div>
                        </div>
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
              className="bg-white p-3 rounded-full shadow-md hover:bg-gray-50 transition-colors"
              aria-label="Next testimonial"
              disabled={isAnimating}
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="flex justify-center space-x-4 mt-6 md:hidden">
            <button
              onClick={prevTestimonial}
              className="bg-white p-3 rounded-full shadow-md hover:bg-gray-50 transition-colors"
              aria-label="Previous testimonial"
              disabled={isAnimating}
            >
              <ChevronLeft className="h-5 w-5 text-gray-800" />
            </button>
            <button
              onClick={nextTestimonial}
              className="bg-white p-3 rounded-full shadow-md hover:bg-gray-50 transition-colors"
              aria-label="Next testimonial"
              disabled={isAnimating}
            >
              <ChevronRight className="h-5 w-5 text-gray-800" />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentIndex === index ? 'bg-amber-500 w-6' : 'bg-gray-300'
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