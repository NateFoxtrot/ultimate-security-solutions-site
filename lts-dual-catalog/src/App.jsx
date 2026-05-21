import React, { useState, useMemo } from 'react';
import { Search, Phone, Tag, ChevronDown, ChevronUp, Cpu, Eye, HardDrive, Shield, Zap } from 'lucide-react';
import catalogData from './components/services/catalogData.json';

const SpecItem = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start text-xs mt-1">
      <Icon className="w-3.5 h-3.5 mr-1.5 text-gray-400 mt-0.5" />
      <div>
        <span className="font-semibold text-gray-500">{label}: </span>
        <span className="text-gray-700">{value}</span>
      </div>
    </div>
  );
};

const ProductCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  // Helper to detect if item has meaningful specs
  const hasSpecs = item.lens || item.maxRes || item.sensor || item.power;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all">
      {/* Top Header: Category & Model */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            {item.modelType === item.category ? item.category : item.modelType}
          </span>
        </div>
        
        {/* Price Badge */}
        {item.price && item.price.toLowerCase().includes('call') ? (
           <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
             <Phone className="w-3 h-3 mr-1" /> Call
           </span>
        ) : (
           <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 font-mono">
             <Tag className="w-3 h-3 mr-1" /> {item.price}
           </span>
        )}
      </div>

      {/* Main SKU */}
      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.sku}</h3>

      {/* Quick Specs (Always Visible) */}
      <div className="space-y-1 mb-3">
        <SpecItem icon={Eye} label="Res/Lens" value={[item.maxRes, item.lens].filter(Boolean).join(' • ')} />
        <SpecItem icon={Cpu} label="Sensor" value={item.sensor} />
      </div>

      {/* Expanded Specs (Toggle) */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 bg-gray-50 -mx-4 px-4 pb-2">
          <SpecItem icon={Zap} label="Power" value={item.power} />
          <SpecItem icon={Shield} label="Protection" value={item.protection} />
          <SpecItem icon={HardDrive} label="Storage" value={item.storage} />
          <SpecItem icon={Cpu} label="Illum" value={item.minIllum} />
          <SpecItem icon={Cpu} label="Audio/Alarm" value={[item.audio, item.alarm].filter(Boolean).join(' / ')} />
          <SpecItem icon={Eye} label="Features" value={item.features} />
        </div>
      )}

      {/* Toggle Button */}
      {hasSpecs && (
        <button 
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-2 flex items-center justify-center text-xs text-gray-400 hover:text-blue-600 transition-colors py-1"
        >
          {expanded ? (
            <>Less Info <ChevronUp className="w-3 h-3 ml-1" /></>
          ) : (
            <>Full Specs <ChevronDown className="w-3 h-3 ml-1" /></>
          )}
        </button>
      )}
    </div>
  );
};

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredItems = useMemo(() => {
    return catalogData.filter(item => 
      (item.sku + item.modelType + item.category).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">MSP Product Master <span className="text-blue-600">v3.0</span></h1>
        </header>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search SKU, Model Type (e.g. Turret, Bullet), or Specs..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map(item => <ProductCard key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
}
