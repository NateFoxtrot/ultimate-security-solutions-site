
import React, { useState } from 'react';
import { X } from 'lucide-react';

const jobs = [
  { 
    id: 1, 
    name: 'Target POS Refresh', 
    location: 'Regional Deployment',
    images: ['/project_gallery_1.JPEG', '/project_gallery_2.JPEG', '/project_gallery_3.JPEG'] 
  },
  { 
    id: 2, 
    name: 'Commercial CCTV Install', 
    location: 'Kansas City, MO',
    images: ['/project_gallery_4.PNG', '/project_gallery_5.JPEG', '/project_gallery_6.JPEG'] 
  },
  { 
    id: 3, 
    name: 'Enterprise Networking', 
    location: 'Overland Park, KS',
    images: ['/project_gallery_7.JPEG', '/project_gallery_8.JPEG', '/project_gallery_9.JPEG'] 
  },
  { 
    id: 4, 
    name: 'Structured Cabling', 
    location: 'Multi-Site Rollout',
    images: ['/project_gallery_10.JPEG', '/project_gallery_11.JPEG', '/project_gallery_12.JPEG'] 
  },
];

const PortfolioPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <h1 className="text-6xl font-black text-white mb-12">JOB <span className="text-secondary">PORTFOLIO</span></h1>
        
        <div className="space-y-20">
          {jobs.map((job) => (
            <div key={job.id} className="border-l-4 border-secondary pl-8">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{job.name}</h2>
              <p className="text-secondary text-sm font-bold mb-6 italic">{job.location}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {job.images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className="aspect-square bg-slate-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-secondary transition-all"
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img} alt="project" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-10 right-10 text-white"><X size={40} /></button>
          <img src={selectedImage} className="max-w-full max-h-full object-contain shadow-2xl" alt="enlarged" />
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
