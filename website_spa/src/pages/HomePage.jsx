
import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import PartnerStrip from '../components/sections/PartnerStrip';
import TrustSignals from '../components/sections/TrustSignals';
import Contact from '../components/sections/Contact';

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <PartnerStrip />
      <TrustSignals />
      <Contact />
    </>
  );
};

export default HomePage;
