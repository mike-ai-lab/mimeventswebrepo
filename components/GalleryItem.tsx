
import React, { useLayoutEffect, useRef } from 'react';
import { GalleryImageItem } from '../types';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Import ScrollTrigger

gsap.registerPlugin(ScrollTrigger); // Register ScrollTrigger

interface GalleryItemProps {
  image: GalleryImageItem;
  onImageClick: (image: GalleryImageItem, index: number) => void;
  index: number;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ image, onImageClick, index }) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!itemRef.current) return;

    const ctx = gsap.context(() => { // GSAP Context for GalleryItem
      gsap.fromTo(
        itemRef.current,
        { opacity: 0, yPercent: 15 }, // Initial state for parallax: slightly down and transparent
        {
          opacity: 1,
          yPercent: 0, // Final state: fully visible and at original y position
          ease: 'none', // Typically 'none' for scrubbed animations for direct mapping
          scrollTrigger: {
            trigger: itemRef.current,
            start: 'top bottom-=10%', // Start animation when item is 10% from bottom of viewport
            end: 'center center+=10%',   // End animation when item's center reaches 10% past viewport center
            scrub: 0.5, // Smoothly links animation to scroll progress (0.5s lag)
          },
        }
      );
    }, itemRef); // scope context to itemRef

    return () => ctx.revert();
  }, [index]); // index dependency if delay is needed, but for parallax, it's less common

  return (
    <div
      ref={itemRef}
      className="group relative aspect-[4/3] overflow-hidden cursor-pointer" // Removed rounded-lg, shadow-lg, added aspect-[4/3]
      onClick={() => onImageClick(image, index)}
      role="button"
      tabIndex={0}
      aria-label={`View image: ${image.alt}`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onImageClick(image, index);}}
    >
      {/* Image directly inside the root, which now controls aspect ratio and overflow */}
      <img
        src={image.src} // Use the potentially modified thumbnail src
        alt={image.alt} // Keep alt text for accessibility
        className="w-full h-full object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110"
      />
      {/* Caption Overlay */}
      <div 
        className="absolute inset-0 flex items-center justify-center p-3 sm:p-4 bg-black/40 opacity-100 group-hover:opacity-0 transition-opacity duration-300 ease-in-out"
      >
        <p className="font-['Gambetta',_serif] italic font-normal text-white text-center text-[15px] sm:text-[16px] md:text-[18px] lg:text-[20px] leading-snug">
          {image.alt} {/* This is the visual caption */}
        </p>
      </div>
    </div>
  );
};

export default GalleryItem;