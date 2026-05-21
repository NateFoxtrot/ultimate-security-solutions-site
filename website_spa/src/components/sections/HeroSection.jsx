
import React from 'react';

const HeroSection = () => {
  return (
    <div className="relative bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-slate-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">

          {/* Navigation with Logo */}
          <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
            <nav className="relative flex items-center justify-between sm:h-10 lg:justify-start" aria-label="Global">
              <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
                <div className="flex items-center justify-between w-full md:w-auto">
                  {/* Logo Area */}
                  <div className="flex-shrink-0 flex items-center cursor-pointer">
                    {/* - Images must have alt tags */}
                    <img 
                      className="h-12 w-auto" 
                      src="/logo.png" 
                      alt="Ultimate Security Solutions Logo" 
                    />
                  </div>
                </div>
              </div>
            </nav>
          </div>

          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Ultimate Security</span>{' '}
                <span className="block text-[#0EA5E9] xl:inline">Solutions</span>
              </h1>
              <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Enterprise-grade low voltage, structured cabling, and physical security infrastructure for the modern MSP.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <a href="#contact" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#0EA5E9] hover:bg-blue-600 md:py-4 md:text-lg md:px-10">
                    Get a Quote
                  </a>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a href="#skills" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#0EA5E9] bg-slate-800 hover:bg-slate-700 md:py-4 md:text-lg md:px-10">
                    View Capabilities
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-slate-800 flex items-center justify-center">
        {/* Placeholder for tech grid background or image */}
        <div className="text-slate-600 text-9xl opacity-20">USS</div>
      </div>
    </div>
  );
};

export default HeroSection;
