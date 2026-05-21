
import React from 'react';

const partners = [
  { name: 'Aruba', logo: '/partners/aruba.svg' },
  { name: 'Bosch', logo: '/partners/bosch.svg' },
  { name: 'FedEx', logo: '/partners/fedex.svg' },
  { name: 'Hanwha', logo: '/partners/hanwha.svg' },
  { name: 'Hikvision', logo: '/partners/hikvision.svg' },
  { name: 'Honeywell', logo: '/partners/honeywell.svg' },
  { name: 'Ubiquiti', logo: '/partners/ubiquiti.svg' },
  { name: 'Verizon', logo: '/partners/verizon.svg' },
  { name: 'Cisco', logo: '/partners/cisco.svg' },
  { name: 'LTS', logo: '/partners/lts.svg' },
];

const PartnerStrip = () => {
  return (
    <div className="bg-white py-12 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-8">
          Trusted by Industry Leaders
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all">
          {partners.map((partner) => (
            <img
              key={partner.name}
              src={partner.logo}
              alt={partner.name}
              className="h-8 md:h-10 w-auto object-contain"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnerStrip;
