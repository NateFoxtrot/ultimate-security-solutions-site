// File: src/components/sections/TrustSignals.jsx
import React from 'react';

const TrustSignals = () => {
  // - Using terms 'Smart Hands' and 'Deliverables'

  const testimonials = [
    {
      id: 1,
      quote: "Their technicians are true Smart Hands. They followed our runbook perfectly and the cutover was seamless.",
      author: "Michael R.",
      role: "IT Director, Regional MSP",
      company: "TechFlow Solutions"
    },
    {
      id: 2,
      quote: "The Fluke reports were uploaded before they even left the site. Best structured cabling team we've used.",
      author: "Sarah L.",
      role: "Infrastructure Manager",
      company: "DataCore Systems"
    },
    {
      id: 3,
      quote: "Reliable demarcation extensions in remote areas are hard to find. These guys delivered ahead of schedule.",
      author: "James T.",
      role: "VP of Operations",
      company: "NetBridge"
    }
  ];

  const partners = [
    { name: 'Cisco', color: 'text-gray-400' },
    { name: 'Aruba', color: 'text-gray-400' },
    { name: 'Ubiquiti', color: 'text-gray-400' },
    { name: 'Fortinet', color: 'text-gray-400' },
    { name: 'Palo Alto', color: 'text-gray-400' },
  ];

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- LOGO STRIP --- */}
        <div className="text-center">
          <h2 className="text-sm font-semibold text-gray-500 tracking-wide uppercase">
            Trusted by Teams Deploying
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-5 lg:grid-cols-5">
            {partners.map((partner) => (
              <div key={partner.name} className="col-span-1 flex justify-center md:col-span-1">
                {/* In a real deployment, replace these spans with SVG Logos.
                   - Images must have alt tags if used.
                */}
                <span className="h-12 flex items-center justify-center text-xl font-bold opacity-70 hover:opacity-100 transition-opacity">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* --- TESTIMONIALS --- */}
        <div className="mt-20 relative">
          {/* Decorative background element */}
          <div className="absolute inset-0 flex flex-col" aria-hidden="true">
            <div className="flex-1" />
            <div className="flex-1 w-full bg-slate-50" />
          </div>

          <div className="relative max-w-7xl mx-auto z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                MSP-Approved Field Services
              </h2>
              <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
                Don't just take our word for it. Read what IT Directors say about our 
                <span className="text-[#0EA5E9] font-medium"> Rack & Stack </span> 
                accuracy.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3 lg:gap-x-8">
              {testimonials.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex-1">
                    <div className="relative">
                      <p className="relative mt-4 text-base text-gray-600 italic">
                        "{item.quote}"
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <div className="flex items-center">
                      <div className="ml-0">
                        <div className="text-base font-semibold text-slate-900">
                          {item.author}
                        </div>
                        <div className="text-sm text-[#0EA5E9]">
                          {item.role}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {item.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;