
import React from 'react';
import SkillsMatrix from '../components/sections/SkillsMatrix';

const ServicesPage = () => {
  return (
    <div className="pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-5xl font-black text-white mb-4">CORE <span className="text-secondary">CAPABILITIES</span></h1>
        <p className="text-text-muted text-xl max-w-3xl mx-auto">
          Enterprise-grade physical security and IT infrastructure solutions for commercial and MSP partners.
        </p>
      </div>
      <SkillsMatrix />
    </div>
  );
};

export default ServicesPage;
