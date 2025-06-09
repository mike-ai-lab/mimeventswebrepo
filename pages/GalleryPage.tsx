
import React, { useState, useMemo, useLayoutEffect, useRef, useEffect, useCallback } from 'react';
import AnimatedHeading from '../components/AnimatedHeading';
import GalleryItem from '../components/GalleryItem';
import { GalleryImageItem } from '../types';
import ParallaxBackground from '../components/ParallaxBackground';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const allGalleryImages: GalleryImageItem[] = [
  { id: 'g1', src: 'https://picsum.photos/seed/gallerypage1/800/600', alt: 'Elegant Wedding Setup', category: 'Weddings' },
  { id: 'g2', src: 'https://picsum.photos/seed/gallerypage2/800/600', alt: 'Corporate Gala Dinner', category: 'Corporate' },
  { id: 'g3', src: 'https://picsum.photos/seed/gallerypage3/800/600', alt: 'Chic Birthday Celebration', category: 'Private Parties' },
  { id: 'g4', src: 'https://picsum.photos/seed/gallerypage4/800/600', alt: 'Outdoor Wedding Ceremony', category: 'Weddings' },
  { id: 'g5', src: 'https://picsum.photos/seed/gallerypage5/800/600', alt: 'Product Launch Event', category: 'Corporate' },
  { id: 'g6', src: 'https://picsum.photos/seed/gallerypage6/800/600', alt: 'Luxury Anniversary Party', category: 'Private Parties' },
  { id: 'g7', src: 'https://picsum.photos/seed/gallerypage7/800/600', alt: 'Wedding Table Setting', category: 'Weddings' },
  { id: 'g8', src: 'https://picsum.photos/seed/gallerypage8/800/600', alt: 'Conference Setup', category: 'Corporate' },
  { id: 'g9', src: 'https://picsum.photos/seed/gallerypage9/800/600', alt: 'Garden Party Decor', category: 'Private Parties' },
  { id: 'g10', src: 'https://picsum.photos/seed/gallerypage10/800/600', alt: 'Bridal Bouquet Detail', category: 'Weddings' },
  { id: 'g11', src: 'https://picsum.photos/seed/gallerypage11/800/600', alt: 'Networking Event', category: 'Corporate' },
  { id: 'g12', src: 'https://picsum.photos/seed/gallerypage12/800/600', alt: 'Themed Kids Party', category: 'Private Parties' },
  { id: 'g13', src: 'https://picsum.photos/seed/gallerypage13/800/600', alt: 'Enchanting Floral Arch', category: 'Weddings' },
  { id: 'g14', src: 'https://picsum.photos/seed/gallerypage14/800/600', alt: 'Modern Conference Stage', category: 'Corporate' },
  { id: 'g15', src: 'https://picsum.photos/seed/gallerypage15/800/600', alt: 'Vintage Themed Soirée', category: 'Private Parties' },
  { id: 'g16', src: 'https://picsum.photos/seed/gallerypage16/800/600', alt: 'Candid Wedding Moments', category: 'Weddings' },
  { id: 'g17', src: 'https://picsum.photos/seed/gallerypage17/800/600', alt: 'Executive Boardroom Meeting', category: 'Corporate' },
  { id: 'g18', src: 'https://picsum.photos/seed/gallerypage18/800/600', alt: 'Poolside Cocktail Party', category: 'Private Parties' },
  { id: 'g19', src: 'https://picsum.photos/seed/gallerypage19/800/600', alt: 'Romantic Beach Wedding', category: 'Weddings' },
  { id: 'g20', src: 'https://picsum.photos/seed/gallerypage20/800/600', alt: 'Interactive Workshop Setup', category: 'Corporate' },
  { id: 'g21', src: 'https://picsum.photos/seed/gallerypage21/800/600', alt: 'Glamorous Masquerade Ball', category: 'Private Parties' },
  { id: 'g22', src: 'https://picsum.photos/seed/gallerypage22/800/600', alt: 'Rustic Barn Wedding Decor', category: 'Weddings' },
  { id: 'g23', src: 'https://picsum.photos/seed/gallerypage23/800/600', alt: 'Team Building Event Activities', category: 'Corporate' },
  { id: 'g24', src: 'https://picsum.photos/seed/gallerypage24/800/600', alt: 'Elegant Dinner Party Setting', category: 'Private Parties' },
];

const categories = ['All', 'Weddings', 'Corporate', 'Private Parties'];

const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<GalleryImageItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(-1);

  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const galleryContentRef = useRef<HTMLDivElement>(null); 


  const filteredImages = useMemo(() => {
    if (selectedCategory === 'All') {
      return allGalleryImages;
    }
    return allGalleryImages.filter(image => image.category === selectedCategory);
  }, [selectedCategory]);

  const handleImageClick = (image: GalleryImageItem, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const closeModal = useCallback(() => {
    setSelectedImage(null);
    setCurrentImageIndex(-1);
  }, []);

  const goToPrevImage = useCallback(() => {
    if (filteredImages.length === 0) return;
    const prevIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[prevIndex]);
    setCurrentImageIndex(prevIndex);
  }, [currentImageIndex, filteredImages]);

  const goToNextImage = useCallback(() => {
    if (filteredImages.length === 0) return;
    const nextIndex = (currentImageIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
    setCurrentImageIndex(nextIndex);
  }, [currentImageIndex, filteredImages]);

  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPrevImage();
      } else if (event.key === 'ArrowRight') {
        goToNextImage();
      } else if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage, goToPrevImage, goToNextImage, closeModal]);


  useLayoutEffect(() => {
    const ctx = gsap.context(() => { // GSAP Context for GalleryPage
      if (heroRef.current) {
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: () => heroRef.current!.offsetHeight < window.innerHeight ? "top top" : "bottom bottom",
          pin: true,
          pinSpacing: false,
        });
      }
      // Note: GalleryItem components handle their own ScrollTrigger animations within their own context.
    }, pageRef);
    return () => ctx.revert();
  }, []); 

  useLayoutEffect(() => {
    const timer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 0); 
    return () => clearTimeout(timer);
  }, [filteredImages]);


  return (
    <div ref={pageRef} className="pt-20 md:pt-24 pb-16 font-['Inter'] bg-[#181a1b] text-white">
      <ParallaxBackground ref={heroRef} imageUrl="https://picsum.photos/seed/gallerypagehero/1920/1080" speed={0.1} minHeight="60vh" contentClassName="items-center justify-center text-center px-4">
        <AnimatedHeading text="EVENT GALLERY" as="h1" className="!font-['Anton_SC'] !font-normal text-[52px] xs:text-[60px] sm:text-[80px] md:text-[100px] lg:text-[112px] text-white uppercase !leading-none" animationType="lines" />
        <AnimatedHeading 
          as="p" 
          text="A glimpse into the unforgettable moments and meticulously crafted details of our events." 
          className="mt-4 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] text-gray-100 max-w-3xl text-center font-normal parallax-content-item" 
          animationType="lines"
        />
      </ParallaxBackground>

      <div ref={galleryContentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        <div className="sticky top-[80px] md:top-[96px] z-40 bg-[#181a1b] py-3 sm:py-4 flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 md:mb-16">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 text-[12px] sm:text-[14px] rounded-md font-semibold font-['Inter'] transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#a3a3a4] focus:ring-opacity-50 ${
                selectedCategory === category
                  ? 'text-white border-2 border-[#a3a3a4] shadow-lg' 
                  : 'text-gray-300 border border-transparent hover:text-[#a3a3a4] hover:border-[#a3a3a4]'
              }`}
            >
              {category.toUpperCase()}
            </button>
          ))}
        </div>

        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0"> 
            {filteredImages.map((image, index) => {
              // Modify src for thumbnail
              const thumbnailSrc = image.src.includes('picsum.photos') 
                ? image.src.replace('/800/600', '/400/300') 
                : image.src; // Assuming Unsplash URLs are already handled or don't need this specific replacement pattern here.
              const thumbnailImage = { ...image, src: thumbnailSrc };
              return (
                <GalleryItem key={image.id} image={thumbnailImage} onImageClick={() => handleImageClick(image, index)} index={index} />
              );
            })}
          </div>
        ) : (
           <AnimatedHeading 
            as="p"
            text="No images found for this category. Please check back later!"
            className="text-center text-gray-300 text-[16px] sm:text-[18px] col-span-full py-10"
            animationType="lines"
          />
        )}
      </div>

      {selectedImage && (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-2 sm:p-4 cursor-pointer" 
            onClick={closeModal} 
            role="dialog"
            aria-modal="true"
            aria-labelledby="imageModalTitle"
        >
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center cursor-default"
            onClick={(e) => e.stopPropagation()} 
          >
            <img 
                src={selectedImage.src.replace('/800/600', '/1600/1000')} // Load larger image for modal
                alt={selectedImage.alt} 
                className="block object-contain max-w-full max-h-full shadow-2xl"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 sm:p-3 text-center">
                <p id="imageModalTitle" className="text-white text-sm sm:text-base md:text-lg font-['Inter'] font-medium">{selectedImage.alt}</p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 sm:p-2.5 focus:outline-none z-[110] transition-colors duration-200" 
            aria-label="Close image modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {filteredImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrevImage(); }}
                className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 md:left-8 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 sm:p-3 focus:outline-none z-[110] transition-all duration-200 hover:scale-110"
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToNextImage(); }}
                className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 md:right-8 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 sm:p-3 focus:outline-none z-[110] transition-all duration-200 hover:scale-110"
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GalleryPage;