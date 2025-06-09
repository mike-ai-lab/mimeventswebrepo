
import React, { useLayoutEffect, useRef } from 'react';
import { Service } from '../types';
import { gsap } from 'gsap';
import AnimatedHeading from './AnimatedHeading'; 

interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const helperTextStyle = "font-['Gambetta',_serif] text-[22px] text-white/60 font-normal italic leading-[24.2px]";

  useLayoutEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.15, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, cardRef); 

    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="bg-[#1f2324] rounded-lg shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-[#a3a3a4]/20 hover:scale-105 group h-full flex flex-col font-['Inter']"
    >
      <img src={service.image} alt={service.title} className="w-full h-56 object-cover group-hover:opacity-90 transition-opacity duration-300" />
      <div className="p-6 flex-grow flex flex-col">
        <AnimatedHeading 
          as="h3" 
          text={service.title} 
          className="text-[22px] font-['Anton_SC'] font-normal text-[#a3a3a4] mb-3" 
          animationType="lines" 
          delay={0.1 + index * 0.15}
        />
        <AnimatedHeading 
          as="p" 
          text={service.description} 
          className="text-gray-200 text-[16px] leading-relaxed mb-4 font-normal flex-grow" 
          animationType="lines" 
          delay={0.2 + index * 0.15}
        />
        {service.longDescription && (
             <AnimatedHeading 
                as="p" 
                text={service.longDescription} 
                className="text-gray-400 text-[14px] italic leading-relaxed mb-4 font-normal" 
                animationType="lines" 
                delay={0.3 + index * 0.15}
              />
        )}
        <a href="#/contact" className={`mt-auto inline-block ${helperTextStyle} hover:text-white/80 transition-colors duration-300 group-hover:translate-x-1 self-start`}>
          Learn More &rarr;
        </a>
      </div>
    </div>
  );
};

export default ServiceCard;
