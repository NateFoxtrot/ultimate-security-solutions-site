
import React, { useState } from 'react';
import products from '../../data/products.json';

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'IP Camera', name: 'IP Cameras', prefixes: ['CMIP'] },
  { id: 'NVR', name: 'NVRs', prefixes: ['LTN'] },
  { id: 'PTZ', name: 'PTZ Cameras', prefixes: ['PTZ'] },
  { id: 'Analogue', name: 'HD-TVI / Analogue', prefixes: ['CMHD', 'LTD'] },
  { id: 'Access Control', name: 'Access Control', prefixes: ['LTK'] },
];

const CatalogSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === 'all') return matchesSearch;
    
    const category = categories.find(c => c.id === selectedCategory);
    const matchesCategory = category.prefixes?.some(prefix => product.sku.startsWith(prefix)) || 
                           product.description.toLowerCase().includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="catalog" className="py-16 bg-primary-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-secondary font-bold tracking-widest uppercase text-sm">Security Hardware Store</h2>
          <p className="mt-2 text-4xl font-extrabold text-white">
            PREMIUM <span className="text-secondary">EQUIPMENT</span>
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-primary-light p-6 rounded-xl border border-slate-700 sticky top-24">
              <h3 className="text-white font-bold mb-4 text-xs uppercase tracking-tighter">Categories</h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
                      selectedCategory === cat.id 
                        ? 'bg-secondary text-primary-dark font-bold shadow-lg shadow-secondary/20' 
                        : 'text-text-muted hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="text-white font-bold mb-2 text-xs uppercase tracking-tighter">Search</h3>
                <input
                  type="text"
                  placeholder="Search SKU..."
                  className="w-full px-4 py-2 bg-primary-dark border border-slate-700 rounded-lg text-white text-sm focus:ring-secondary focus:border-secondary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-grow">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => {
                const isPro = product.tier === 'Pro' || !product.price || product.price === 0;
                return (
                  <div key={product.sku} className="bg-primary-light rounded-xl border border-slate-700 overflow-hidden flex flex-col hover:border-secondary transition-colors group">
                    <div className="h-48 bg-white p-4 relative">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.sku}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                           <i className="fas fa-camera text-5xl opacity-20"></i>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                          isPro ? 'bg-secondary text-primary-dark' : 'bg-primary text-white'
                        }`}>
                          {isPro ? 'PRO' : 'PLATINUM'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="text-secondary font-mono text-[10px] mb-1">{product.sku}</div>
                      <h3 className="text-white font-bold text-sm mb-2 line-clamp-2 h-10">
                        {product.name || 'Professional Security Component'}
                      </h3>
                      <div className="mt-auto pt-4 border-t border-slate-700 flex justify-between items-center">
                        <div className="text-xl font-bold text-white">
                          {isPro ? 'QUOTE' : `$${product.price}`}
                        </div>
                        <button 
                          onClick={() => window.location.href = '#contact'}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            isPro 
                              ? 'border border-secondary text-secondary hover:bg-secondary hover:text-primary-dark' 
                              : 'bg-secondary text-primary-dark hover:bg-secondary-hover shadow-lg shadow-secondary/10'
                          }`}
                        >
                          {isPro ? 'INFO' : 'ADD'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-primary-light rounded-xl border border-dashed border-slate-700">
                <p className="text-text-muted">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CatalogSection;
