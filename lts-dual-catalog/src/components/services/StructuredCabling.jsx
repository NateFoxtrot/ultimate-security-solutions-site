import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import serviceSchema from './serviceSchema.json';

// Prefer WebP format
const heroImage = "/images/structured-cabling-hero.webp";

const StructuredCabling = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      <Helmet>
        <title>Structured Cabling & Fiber Installation Services</title>
        <meta 
          name="description" 
          content="Expert structured cabling for MSPs. We handle Demarc Extensions, Rack & Stack, and Fiber optics." 
        />
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
      </Helmet>

      <main className="w-full max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-8">
          Structured Cabling Solutions
        </h1>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-lg text-gray-700">
              We provide robust <strong>Structured Cabling</strong> infrastructure, 
              specializing in Cat5e, Cat6, and Fiber optic solutions.
            </p>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Core Services</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">✓</span>
                  <span><strong>Demarc Extension:</strong> Extending circuits from provider entry to customer equipment.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">✓</span>
                  <span><strong>Rack & Stack:</strong> Professional hardware installation.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2 font-bold">✓</span>
                  <span><strong>Smart Hands:</strong> On-site technician support.</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="relative bg-gray-200 rounded-xl min-h-[300px] flex items-center justify-center">
            {/* Placeholder for missing image */}
            <p className="text-gray-500 font-medium">Hero Image Area</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default StructuredCabling;
