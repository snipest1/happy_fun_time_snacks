import React, { useState } from 'react';

interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  description: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Premium Snacks",
    category: "food",
    image: "https://picsum.photos/id/292/400/300",
    description: "High-quality snacks including chips, nuts, granola bars, and more."
  },
  {
    id: 2,
    name: "Cold Beverages",
    category: "beverage",
    image: "https://picsum.photos/id/431/400/300",
    description: "Refreshing selection of sodas, water, teas, and energy drinks."
  },
  {
    id: 3,
    name: "Fresh Food",
    category: "food",
    image: "https://picsum.photos/id/139/400/300",
    description: "Freshly prepared sandwiches, salads, and healthy meal options."
  },
  {
    id: 4,
    name: "Coffee & Hot Drinks",
    category: "beverage",
    image: "https://picsum.photos/id/425/400/300",
    description: "Premium coffee, tea, hot chocolate, and specialty hot beverages."
  },
  {
    id: 5,
    name: "Frozen Treats",
    category: "food",
    image: "https://picsum.photos/id/211/400/300",
    description: "Ice cream, frozen yogurt, and other cold desserts."
  },
  {
    id: 6,
    name: "Healthy Options",
    category: "food",
    image: "https://picsum.photos/id/1080/400/300",
    description: "Nutritious snacks and meals for health-conscious consumers."
  },
  {
    id: 7,
    name: "Energy Drinks",
    category: "beverage",
    image: "https://picsum.photos/id/493/400/300",
    description: "Performance-enhancing beverages for an energy boost."
  },
  {
    id: 8,
    name: "Office Supplies",
    category: "other",
    image: "https://picsum.photos/id/2/400/300",
    description: "Essential supplies like pens, notebooks, and charging cables."
  }
];

const ProductCategories: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'food', name: 'Food' },
    { id: 'beverage', name: 'Beverages' },
    { id: 'other', name: 'Other' }
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <section id="products" className="py-20 bg-hfts-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-display-lg text-hfts-navy mb-4">
            Product Categories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We offer a wide variety of products to suit every taste and need. Our machines can be customized with your preferred product mix.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeCategory === category.id
                  ? 'bg-hfts-orange text-white shadow-lg'
                  : 'bg-white text-hfts-navy border-2 border-hfts-teal hover:bg-hfts-teal/10'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-hfts-teal"
            >
              <div className="h-48 overflow-hidden bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-hfts-navy mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;