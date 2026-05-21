import React from 'react';
import HeroSection from './components/sections/HeroSection';
import SkillsMatrix from './components/sections/SkillsMatrix';
import TrustSignals from './components/sections/TrustSignals';
import Contact from './components/sections/Contact';
import Footer from './components/sections/Footer';

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <HeroSection />
      <SkillsMatrix />
      <TrustSignals />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;