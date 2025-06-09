
import React, { useRef, useLayoutEffect, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedHeading from '../components/AnimatedHeading';
import ParallaxBackground from '../components/ParallaxBackground';
import TestimonialCard from '../components/TestimonialCard';
import GsapHorizontalLoopCarousel from '../components/GsapHorizontalLoopCarousel'; // New Carousel
import { GalleryImageItem } from '../types';

gsap.registerPlugin(ScrollTrigger);

const homeServices = [
  {
    id: 'weddings',
    title: 'Enchanting Weddings',
    description: 'From fairytale ceremonies to lavish receptions, we orchestrate every detail of your special day with elegance and precision, creating memories that last a lifetime.',
    image: 'https://picsum.photos/seed/luxewedding/800/600',
    longDescription: "Our comprehensive wedding planning services cover venue scouting, bespoke design and decor, world-class vendor management, guest journey curation, and flawless on-the-day execution. We embrace your vision and elevate it with our expertise."
  },
  {
    id: 'corporate',
    title: 'Impactful Corporate Events',
    description: 'We specialize in designing and executing sophisticated corporate events, including global conferences, high-profile product launches, prestigious award ceremonies, and executive galas.',
    image: 'https://picsum.photos/seed/corpogala/800/600',
    longDescription: "MIMEVENTS helps your brand make a definitive statement. We manage complex logistics, cutting-edge AV & technology, captivating entertainment, and seamless branding integration to deliver engaging and memorable corporate experiences."
  },
  {
    id: 'private',
    title: 'Exclusive Private Soirées',
    description: 'Celebrate life\'s milestones with uniquely designed private parties. From landmark birthdays and anniversaries to themed extravaganzas and exclusive gatherings, we craft personalized experiences that reflect your individual style.',
    image: 'https://picsum.photos/seed/luxeparty/800/600',
    longDescription: "Our dedicated team excels in creating intimate and unforgettable private events. We handle every facet, from conceptualization and immersive design to gourmet catering and world-class entertainment, allowing you to indulge in your celebration."
  },
];

const homeTestimonials = [
  { id: 't1', quote: "MIMEVENTS transformed our wedding into an absolute fairytale. Their attention to detail was impeccable, and the team was a dream to work with. Truly unforgettable!", author: "Aisha & Karim R.", eventDate: "October 2023" },
  { id: 't2', quote: "Our annual corporate gala was the best one yet, thanks to MIMEVENTS. Professional, creative, and flawlessly executed. They exceeded all expectations.", author: "CEO, Levant Innovate Corp.", eventDate: "December 2023" },
  { id: 't3', quote: "The 50th anniversary party they planned for my parents was beyond stunning. Every element was thoughtfully curated. Our family is still talking about it!", author: "Layla S.", eventDate: "September 2023" },
];

const homeProjects: GalleryImageItem[] = [
  { id: 'hp1', src: 'https://images.unsplash.com/photo-1659733582156-d2a11801e59f?q=50&w=1600', alt: 'Royal Garden Wedding', category: 'Weddings' },
  { id: 'hp2', src: 'https://images.unsplash.com/photo-1543362137-5df0547b039d?q=50&w=1600', alt: 'Innovate Summit 2023', category: 'Corporate' },
  { id: 'hp3', src: 'https://images.unsplash.com/photo-1631142260228-305ccb610dba?q=50&w=1600', alt: 'Azure Villa Party', category: 'Private Parties' },
  { id: 'hp4', src: 'https://images.unsplash.com/photo-1708022766976-49ca46c0f7de?q=50&w=1600', alt: 'Charity Gala Dinner', category: 'Corporate' },
  { id: 'hp5', src: 'https://images.unsplash.com/photo-1631142260079-970258649676?q=50&w=1600', alt: 'Desert Mirage Festival', category: 'Special Events' },
  { id: 'hp6', src: 'https://images.unsplash.com/photo-1708022809820-2668e65877b9?q=50&w=1600', alt: 'Vintage Vineyard Wedding', category: 'Weddings' },
  { id: 'hp7', src: 'https://images.unsplash.com/photo-1708022796522-ff65b57439de?q=50&w=1600', alt: 'FutureTech Conference', category: 'Corporate' },
  { id: 'hp8', src: 'https://images.unsplash.com/photo-1708022790103-a514cb89a034?q=50&w=1600', alt: 'Grand Masquerade Ball', category: 'Private Parties' },
];


const heroSliderImages = [
  "https://picsum.photos/seed/mimhero1/1200/1500",
  "https://picsum.photos/seed/mimhero2/1200/1500",
  "https://picsum.photos/seed/mimhero3/1200/1500",
  "https://picsum.photos/seed/mimhero4/1200/1500",
];

const SWIPE_THRESHOLD = 50; 

const HomePage: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroImageFrameRef = useRef<HTMLDivElement>(null);
  const heroTextPanelRef = useRef<HTMLDivElement>(null); 

  const newProjectsSectionRef = useRef<HTMLElement>(null);

  const servicesSectionRef = useRef<HTMLElement>(null);
  const servicesTextContentRef = useRef<HTMLDivElement>(null);
  
  const testimonialsRef = useRef<HTMLDivElement>(null); 
  
  const ctaRef = useRef<HTMLElement>(null);
  const ctaTextContentRef = useRef<HTMLDivElement>(null);


  const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);
  const [isDraggingHero, setIsDraggingHero] = useState(false);
  const [heroDragStartX, setHeroDragStartX] = useState(0);
  const heroIntervalRef = useRef<number | null>(null);

  const helperTextStyleBase = "font-['Gambetta',_serif] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] text-white/60 font-normal italic leading-[1.1]";


  const startHeroInterval = useCallback(() => {
    if (heroIntervalRef.current) {
      clearInterval(heroIntervalRef.current);
    }
    heroIntervalRef.current = window.setInterval(() => {
      setCurrentHeroImageIndex((prevIndex) => (prevIndex + 1) % heroSliderImages.length);
    }, 5000);
  }, []);

  useEffect(() => {
    startHeroInterval();
    return () => {
      if (heroIntervalRef.current) {
        clearInterval(heroIntervalRef.current);
      }
    };
  }, [startHeroInterval]);

  const handleHeroPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDraggingHero(true);
    setHeroDragStartX(e.clientX);
    heroImageFrameRef.current?.setPointerCapture(e.pointerId);
    if (heroIntervalRef.current) {
      clearInterval(heroIntervalRef.current);
    }
    heroImageFrameRef.current?.style.setProperty('cursor', 'grabbing');
  };

  const handleHeroPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingHero) return;
  };

  const handleHeroPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingHero) return;
    heroImageFrameRef.current?.releasePointerCapture(e.pointerId);
    setIsDraggingHero(false);
    heroImageFrameRef.current?.style.setProperty('cursor', 'grab');

    const deltaX = e.clientX - heroDragStartX;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      if (deltaX < 0) {
        setCurrentHeroImageIndex((prevIndex) => (prevIndex + 1) % heroSliderImages.length);
      } else {
        setCurrentHeroImageIndex((prevIndex) => (prevIndex - 1 + heroSliderImages.length) % heroSliderImages.length);
      }
    }
    startHeroInterval();
  };
  
  const handleHeroPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingHero) return;
    heroImageFrameRef.current?.releasePointerCapture(e.pointerId);
    setIsDraggingHero(false);
    heroImageFrameRef.current?.style.setProperty('cursor', 'grab');
    startHeroInterval();
  };


  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(heroImageFrameRef.current,
        { opacity: 0, scale: 1.05 }, 
        { opacity: 1, scale: 1, duration: 1.2, delay: 0.2, ease: 'power3.out' }
      );
      
      gsap.utils.toArray<HTMLElement>('.section-reveal').forEach(section => {
        gsap.fromTo(section, 
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
      
      const allSectionsForStackingPin = [
        newProjectsSectionRef.current, 
        servicesSectionRef.current,
        testimonialsRef.current,
        ctaRef.current,
      ].filter(Boolean) as HTMLElement[];

      allSectionsForStackingPin.forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: () => section.offsetHeight < window.innerHeight ? "top top" : "bottom bottom",
          pin: true,
          pinSpacing: false, 
        });

        // Parallax for content inside pinned sections
        if (section === servicesSectionRef.current && servicesTextContentRef.current) {
          gsap.to(servicesTextContentRef.current, {
            yPercent: -10, ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true }
          });
          gsap.utils.toArray<HTMLElement>('.service-item-parallax-parent').forEach((item, index) => {
            gsap.to(item, { 
              yPercent: (index % 2 === 0 ? -3 : -5), ease: 'none', 
              scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true }
            });
          });
        } else if (section === testimonialsRef.current) {
            // Target only TestimonialCards for yPercent parallax within this section
            const cards = testimonialsRef.current?.querySelectorAll<HTMLElement>('.parallax-content-item');
            if (cards) {
                cards.forEach((card, index) => { // these are the TestimonialCard components
                    gsap.to(card, {
                        yPercent: -(5 + index * 1.5), 
                        ease: 'none',
                        scrollTrigger: {
                            trigger: section, 
                            start: 'top bottom', 
                            end: 'bottom top',   
                            scrub: true,
                        }
                    });
                });
            }
        } else if (section === ctaRef.current && ctaTextContentRef.current) {
          gsap.to(ctaTextContentRef.current, {
            yPercent: -10, ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true }
          });
        }
      });

      gsap.utils.toArray<HTMLElement>('.service-item-parallax-parent').forEach(item => {
        const imageWrapper = item.querySelector('.service-item-image-wrapper');
        const textBlock = item.querySelector('.service-item-text-block');

        if (imageWrapper) {
          gsap.to(imageWrapper, {
            yPercent: -15, 
            ease: 'none',
            scrollTrigger: {
              trigger: item, 
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            }
          });
        }
        if (textBlock) {
          gsap.to(textBlock, {
            yPercent: 15, 
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            }
          });
        }
      });

    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="font-['Inter'] text-white bg-[#181a1b]">
      <section 
        ref={heroRef} 
        className="hero-section min-h-screen md:min-h-[175vh] flex flex-col md:flex-row bg-[#181a1b] relative"
      >
        <div 
          ref={heroImageFrameRef} 
          className="hero-image-frame w-full h-[60vh] md:w-1/2 md:h-screen md:sticky md:top-0 bg-[#111314] overflow-hidden cursor-grab"
          style={{ touchAction: 'pan-y', userSelect: 'none' }}
          onPointerDown={handleHeroPointerDown}
          onPointerMove={handleHeroPointerMove}
          onPointerUp={handleHeroPointerUp}
          onPointerCancel={handleHeroPointerCancel}
        >
          {heroSliderImages.map((src, index) => (
            <img
              key={src + index}
              src={src}
              alt={`MIMEVENTS Hero Image ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out pointer-events-none`}
              style={{ 
                opacity: index === currentHeroImageIndex ? 1 : 0,
              }}
            />
          ))}
        </div>
        <div ref={heroTextPanelRef} className="w-full md:w-1/2 flex flex-col p-6 sm:p-10 md:p-16 lg:p-24">
          <div className="relative z-10 flex flex-col flex-grow">
            
            <div className="mb-auto pt-8 md:pt-12">
               <h1 className="font-['Anton_SC'] font-normal uppercase tracking-normal">
                <AnimatedHeading
                  as="span"
                  text="MIM"
                  className="block text-white text-[60px] xs:text-[70px] sm:text-[80px] md:text-[90px] lg:text-[112px] leading-none"
                  animationType="lines"
                  delay={0.5}
                />
                <AnimatedHeading
                  as="span"
                  text="EVENTS"
                  className="block text-[#a3a3a4] text-[60px] xs:text-[70px] sm:text-[80px] md:text-[90px] lg:text-[112px] -mt-2 xs:-mt-3 sm:-mt-4 md:-mt-5 lg:-mt-8 leading-none"
                  animationType="lines"
                  delay={0.5} 
                />
              </h1>
              <AnimatedHeading
                as="p"
                text="(A Beirut-Based House of Events.)"
                className={`${helperTextStyleBase} mt-2 sm:mt-3`}
                animationType="lines"
                delay={0.7}
              />
            </div>

            <div className="my-6 md:my-10">
              <AnimatedHeading
                as="p"
                text="Crafting bespoke experiences for bold brands and iconic moments. We transform visions into unforgettable realities."
                className="text-[16px] md:text-[18px] text-gray-200 max-w-xl font-normal mb-6 sm:mb-8 md:mb-12" 
                animationType="lines"
                delay={0.8}
              />
              <div>
                <div className="flex justify-between items-baseline mb-3 sm:mb-4">
                  <AnimatedHeading 
                    as="span" 
                    text="(More About Us)" 
                    className={`${helperTextStyleBase}`}
                    animationType="lines"
                  />
                </div>
                <AnimatedHeading text="Creative Vision, Flawless Execution." as="h2" className="!font-['Anton_SC'] !font-normal text-[32px] sm:text-[40px] md:text-[48px] lg:text-[52px] text-white uppercase mt-4 sm:mt-6 md:mt-8 !leading-tight" animationType="lines"/> 
                <AnimatedHeading
                  as="p"
                  text="At MIMEVENTS, we believe every event is a unique story waiting to be told. Based in the heart of Lebanon, we specialize in creating bespoke, luxurious events that leave lasting impressions."
                  className="text-gray-200 text-[15px] sm:text-[16px] md:text-[18px] leading-relaxed mt-3 sm:mt-4 font-normal" 
                  animationType="lines"
                />
                <AnimatedHeading
                  as="p"
                  text="Our passion for perfection and dedication to our clients ensure a seamless and extraordinary experience from concept to memorable execution."
                  className="text-gray-200 text-[15px] sm:text-[16px] md:text-[18px] leading-relaxed mt-3 sm:mt-4 font-normal" 
                  animationType="lines"
                />
              </div>
            </div>
            
            <div className="mt-auto">
              <Link
                to="/services"
                className={`inline-block ${helperTextStyleBase} hover:text-white/80 transition-colors duration-300 group pt-4`}
              >
                <AnimatedHeading as="span" text="Discover Our Services " animationType="lines" />
                 <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section 
        ref={newProjectsSectionRef} 
        className="section-reveal gsap-carousel-section py-12 sm:py-16 md:py-20 min-h-screen flex flex-col justify-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center md:text-left mb-8 sm:mb-10 md:mb-12 pt-10 sm:pt-12 md:pt-16 lg:pt-20">
            <div className="flex justify-between items-baseline mb-2 sm:mb-4">
              <AnimatedHeading as="span" text="(Selected Work)" className={`${helperTextStyleBase}`} animationType="lines" />
              <AnimatedHeading as="span" text="01" className={`${helperTextStyleBase}`} animationType="lines" />
            </div>
            <AnimatedHeading text="PROJECTS" as="h2" className="!font-['Anton_SC'] !font-normal text-[52px] xs:text-[60px] sm:text-[80px] md:text-[100px] lg:text-[140px] text-white uppercase mt-1 !leading-none" animationType="lines" />
            <AnimatedHeading as="p" text="Explore our recent projects showcasing creativity, innovation, and impactful design solutions." className="text-gray-300 mt-3 sm:mt-4 max-w-xl font-normal text-[15px] sm:text-[16px] md:text-[18px] mx-auto md:mx-0" animationType="lines" />
        </div>
        
        <div className="gsap-carousel-container w-full"> 
          <GsapHorizontalLoopCarousel projects={homeProjects} />
        </div>
      </section>


      <section ref={servicesSectionRef} className="py-12 sm:py-16 md:py-24 bg-[#181a1b] section-reveal min-h-screen flex flex-col justify-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={servicesTextContentRef} className="mb-10 sm:mb-12 md:mb-16 text-center md:text-left">
            <div className="flex justify-between items-baseline mb-2 sm:mb-4">
              <AnimatedHeading as="span" text="(What We Do)" className={`${helperTextStyleBase} reveal-content`} animationType="lines"/>
              <AnimatedHeading as="span" text="02" className={`${helperTextStyleBase} reveal-content`} animationType="lines"/>
            </div>
            <AnimatedHeading text="SERVICES" as="h2" className="!font-['Anton_SC'] !font-normal text-[52px] xs:text-[60px] sm:text-[80px] md:text-[100px] lg:text-[140px] text-white uppercase mt-1 !leading-none reveal-content" animationType="lines" />
            <AnimatedHeading as="p" text="Discover our tailored services designed to elevate your brand and enhance user experience through unforgettable events." className="text-gray-300 mt-3 sm:mt-4 max-w-xl font-normal text-[15px] sm:text-[16px] md:text-[18px] mx-auto md:mx-0 reveal-content" animationType="lines" />
          </div>
          <div className="space-y-12 sm:space-y-16 md:space-y-20">
            {homeServices.map((service, index) => (
              <div
                key={service.id}
                className={`service-item-parallax-parent flex flex-col md:flex-row items-center gap-6 sm:gap-8 lg:gap-12 reveal-content ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="service-item-image-wrapper md:w-1/2 rounded-lg shadow-2xl overflow-hidden">
                  <img src={service.image} alt={service.title} className="w-full h-auto object-cover transform transition-transform duration-500 hover:scale-105" />
                </div>
                <div className="service-item-text-block md:w-1/2">
                  <AnimatedHeading text={service.title} as="h3" className="!font-['Anton_SC'] !font-normal text-[28px] sm:text-[32px] md:text-[36px] lg:text-[48px] text-white mb-3 sm:mb-4 leading-tight" animationType="lines" />
                  <AnimatedHeading as="p" text={service.description} className="text-gray-200 text-[15px] sm:text-[16px] md:text-[18px] leading-relaxed font-normal mb-3" animationType="lines" />
                  {service.longDescription && <AnimatedHeading as="p" text={service.longDescription} className="text-gray-300 text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed font-normal italic" animationType="lines" />}
                  <Link to="/services" className={`mt-4 sm:mt-6 inline-block ${helperTextStyleBase} hover:text-white/80 transition-colors duration-300 group`}>
                     <AnimatedHeading as="span" text="Learn More " animationType="lines" />
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ParallaxBackground 
        ref={testimonialsRef} 
        imageUrl="https://picsum.photos/seed/luxurybgblur/1600/900" 
        speed={0.1} 
        minHeight="auto" 
        className="pt-16 pb-12 sm:pt-24 sm:pb-16 md:pt-36 md:pb-24 section-reveal bg-[#131516] min-h-screen flex flex-col" /* Removed justify-center from here */
        contentClassName="text-left" /* Override default justify-center and text-center for the inner content wrapper */
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 self-animated"> {/* This div handles its own horizontal centering with mx-auto */}
          <div className="mb-10 sm:mb-12 md:mb-16 text-center md:text-left"> 
            <div className="flex justify-between items-baseline mb-2 sm:mb-4">
              <AnimatedHeading as="span" text="(Testimonials)" className={`${helperTextStyleBase}`} animationType="lines"/>
              <AnimatedHeading as="span" text="03" className={`${helperTextStyleBase}`} animationType="lines"/>
            </div>
            <AnimatedHeading text="WHAT OUR CLIENTS SAY" as="h2" className="!font-['Anton_SC'] !font-normal text-[40px] xs:text-[48px] sm:text-[60px] md:text-[70px] lg:text-[80px] text-white uppercase mt-1 !leading-tight" animationType="lines" />
            <AnimatedHeading as="p" text="Hear about their success stories and experiences with MIMEVENTS." className="text-gray-100 mt-3 sm:mt-4 max-w-xl font-normal text-[15px] sm:text-[16px] md:text-[18px] mx-auto md:mx-0" animationType="lines"/>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {homeTestimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} className="parallax-content-item" />
            ))}
          </div>
        </div>
      </ParallaxBackground>

      <section ref={ctaRef} className="py-16 sm:py-20 md:py-28 section-reveal bg-[#181a1b] min-h-screen flex flex-col justify-center">
        <div ref={ctaTextContentRef} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <AnimatedHeading text="Ready to Create Magic?" as="h2" className="!font-['Anton_SC'] !font-normal text-[40px] xs:text-[48px] sm:text-[52px] md:text-[60px] lg:text-[80px] text-white mb-4 sm:mb-6 !leading-tight reveal-content" animationType="lines" />
          <AnimatedHeading as="p" text="Let MIMEVENTS bring your dream event to life. Contact us today for a consultation and let's begin crafting your unforgettable story." className="text-gray-200 text-[16px] sm:text-[18px] md:text-[20px] mb-8 sm:mb-10 font-normal reveal-content" animationType="lines" />
          <Link
            to="/contact"
            className="reveal-content text-[#a3a3a4] hover:text-white border border-[#a3a3a4] hover:border-white font-semibold py-3 sm:py-4 px-8 sm:px-10 rounded-md text-[16px] sm:text-[18px] shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            GET IN TOUCH
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
