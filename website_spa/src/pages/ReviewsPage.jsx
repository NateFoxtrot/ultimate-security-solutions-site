
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  { id: 1, text: "USS deployed our entire new POS infrastructure across 50 locations ahead of schedule. Flawless cabling work.", author: "Target Operations Manager", logo: "/partners/target.svg", stars: 5 },
  { id: 2, text: "Professional, secure, and incredibly knowledgeable about 5G failover systems. Highly recommended for MSP partnerships.", author: "Crosscom Project Lead", logo: "/partners/atandt.svg", stars: 5 },
  { id: 3, text: "The CCTV migration was seamless. Nate and his team are true experts in physical security integration.", author: "Walmart Asset Protection", logo: "/partners/walmart.svg", stars: 5 },
  { id: 4, text: "Reliable smart hands support. We ship the gear, they rack and stack it perfectly every time.", author: "Granite Telecommunications", logo: "/partners/granite.svg", stars: 5 },
];

const ReviewCard = ({ review, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -100, y: -100 }}
      animate={{ 
        opacity: [0, 1, 1, 0],
        x: [index * 50, index * 50 + 200],
        y: [index * 50, index * 50 + 200],
      }}
      transition={{ 
        duration: 15,
        repeat: Infinity,
        delay: index * 5,
        ease: "linear"
      }}
      className="absolute bg-primary-light/90 backdrop-blur-lg border border-secondary/30 p-6 rounded-2xl shadow-2xl w-80 z-10 pointer-events-none"
    >
      <div className="flex items-center space-x-4 mb-4">
        <img src={review.logo} alt="vendor" className="h-8 w-auto grayscale opacity-50" />
        <div className="flex">
          {[...Array(review.stars)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
          ))}
        </div>
      </div>
      <p className="text-white italic text-sm mb-4 leading-relaxed">"{review.text}"</p>
      <div className="text-secondary font-black tracking-tighter text-xs uppercase">- {review.author}</div>
    </motion.div>
  );
};

const ReviewsPage = () => {
  return (
    <div className="relative h-screen overflow-hidden pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-50">
        <h1 className="text-6xl font-black text-white mb-4">CLIENT <span className="text-secondary">TRUST</span></h1>
        <p className="text-text-muted text-xl">Real feedback from our commercial deployments.</p>
      </div>
      
      <div className="absolute inset-0 top-48">
        {reviews.slice(0, 3).map((review, index) => (
          <ReviewCard key={review.id} review={review} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ReviewsPage;
