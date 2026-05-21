// File: src/components/sections/SkillsMatrix.jsx
import React from 'react';

const SkillsMatrix = () => {
  const skillCategories = [
    {
      title: "Structured Cabling",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      skills: [
        "Cat5e / Cat6 / Cat6a Terminations",
        "Fiber Optic Splicing (Fusion)",
        "Demarc Extensions (T1/Fiber)",
        "Cable Certifications (Fluke)",
        "IDF/MDF Closet Cleanups"
      ]
    },
    {
      title: "Physical Security",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      skills: [
        "IP Camera Systems (Hikvision/Dahua/Axis)",
        "Access Control (Maglocks/Strikes)",
        "Intrusion Alarms & Sensors",
        "Low Voltage Rough-in",
        "Intercom Systems"
      ]
    },
    {
      title: "Network Field Services",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      ),
      skills: [
        "Rack & Stack (Switches/UPS/Servers)",
        "Smart Hands Support",
        "LTE Failover Installation",
        "VoIP Phone Deployments",
        "Site Surveys & Heat Maps"
      ]
    }
  ];

  return (
    <section id="skills" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base text-[#0EA5E9] font-semibold tracking-wide uppercase">Technical Capabilities</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Complete Low Voltage Solutions
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            From the demarc to the desktop, we handle the physical layer so you can focus on the logic.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {skillCategories.map((category, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-[#0EA5E9] hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-slate-100 text-[#0EA5E9] mb-4 mx-auto">
                  {category.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 text-center mb-4">{category.title}</h3>
                <ul className="space-y-3">
                  {category.skills.map((skill, idx) => (
                    <li key={idx} className="flex items-start">
                      {/* Check icon */}
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-sm text-gray-600 font-medium">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsMatrix;