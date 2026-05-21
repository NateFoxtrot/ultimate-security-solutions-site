import React, { useState, useMemo } from 'react';
import rawData from './catalogData.json';

const CatalogViewer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    return ['All', ...new Set(rawData.map(item => item.category))].sort();
  }, []);

  const filteredData = rawData.filter(item => {
    const matchesSearch = 
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const displayData = filteredData.slice(0, 100);

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Master Product Database</h1>
        
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search SKU..."
            className="flex-1 p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="p-2 border rounded bg-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-bold text-gray-600">Category</th>
              <th className="px-4 py-3 text-left font-bold text-gray-600">SKU</th>
              <th className="px-4 py-3 text-left font-bold text-green-700">Price</th>
              <th className="px-4 py-3 text-left font-bold text-gray-600">Raw Line Context</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayData.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-blue-600 font-medium">{item.category}</td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">{item.sku}</td>
                <td className="px-4 py-3 text-sm font-bold text-green-700">
                  {item.price === "Call for Price" ? 
                    <span className="text-orange-500 text-xs uppercase">{item.price}</span> : 
                    item.price
                  }
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 font-mono truncate max-w-md">
                  {item.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CatalogViewer;
