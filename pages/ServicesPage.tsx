
import React, { useLayoutEffect, useRef } from 'react';
import AnimatedHeading from '../components/AnimatedHeading';
import ParallaxBackground from '../components/ParallaxBackground';
import { Service } from '../types';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const servicesData: Service[] = [
  {
    id: 'weddings',
    title: 'Exquisite Wedding Planning',
    description: 'From intimate ceremonies to grand receptions, we orchestrate every detail of your special day with elegance and precision. Our comprehensive wedding planning services cover venue selection, vendor management, design and decor, guest coordination, and flawless execution.',
    longDescription: 'We understand that your wedding day is one of the most important moments of your life. Our team works closely with you to understand your vision, preferences, and cultural traditions, ensuring a personalized and unforgettable celebration. We handle everything, so you can cherish every moment.',
    image: 'https://picsum.photos/seed/weddingservicepage/800/533', // Adjusted size
  },
  {
    id: 'corporate',
    title: 'Professional Corporate Events',
    description: 'We specialize in designing and executing impactful corporate events, including conferences, seminars, product launches, award ceremonies, and galas. Our focus is on creating events that align with your brand identity and business objectives.',
    longDescription: 'MIMEVENTS helps you make a statement. We manage logistics, technology, entertainment, and branding to deliver seamless and engaging corporate experiences. Whether it’s an internal team-building event or a large-scale international conference, we ensure professionalism and sophistication.',
    image: 'https://picsum.photos/seed/corporateservicepage/800/533', // Adjusted size
  },
  {
    id: 'private',
    title: 'Bespoke Private Celebrations',
    description: 'Celebrate life\'s special moments with uniquely designed private parties. From milestone birthdays and anniversaries to themed gatherings and exclusive soirées, we craft personalized experiences that reflect your individual style.',
    longDescription: 'Our team excels in creating intimate and memorable private events. We take care of every aspect, from conceptualization and design to entertainment and catering, allowing you to relax and enjoy your celebration with your guests. Let us turn your private party into an extraordinary affair.',
    image: 'https://picsum.photos/seed/partyservicepage/800/533', // Adjusted size
  },
  {
    id: 'destination',
    title: 'Luxury Destination Events',
    description: 'Dreaming of an event in a breathtaking location? We plan and manage luxury destination events in Lebanon and beyond, handling all complexities from travel logistics to local vendor coordination.',
    longDescription: 'MIMEVENTS offers full-service planning for destination weddings, corporate retreats, and exclusive parties. We leverage our extensive network and local expertise to create seamless and stunning events in idyllic settings, ensuring an unforgettable experience for you and your guests.',
    image: 'https://picsum.photos/seed/destinationservicepage/800/533', // Adjusted size
  },
];

const ServiceItemDisplay: React.FC<{ service: Service; index: number }> = ({ service, index }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  useLayoutEffect(() => {
    if (!itemRef.current) return;
    const ctx = gsap.context(() => { // GSAP Context for ServiceItemDisplay
      ScrollTrigger.create({
        trigger: itemRef.current,
        start: () => itemRef.current!.offsetHeight < window.innerHeight ? "top top" : "bottom bottom",
        pin: true,
        pinSpacing: false,
      });
    }, itemRef);
    return () => ctx.revert();
  }, []);

  // Determine original aspect ratio from seed (assuming 1200/800 or 800/600)
  // Defaulting to 1200x800 for these seeds if not specified otherwise.
  const originalWidth = 1200;
  const originalHeight = 800;


  return (
    <div ref={itemRef} className={`grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-16 items-center py-10 sm:py-12 md:py-16 bg-[#181a1b]`}>
      <div className={`rounded-lg overflow-hidden shadow-2xl ${isEven ? 'md:order-1' : 'md:order-2'}`}>
        <img 
          src={service.image} 
          alt={service.title} 
          className="w-full h-auto object-cover transform transition-transform duration-500 hover:scale-105" 
          width={originalWidth} // Added width
          height={originalHeight} // Added height
        />
      </div>
      <div className={`${isEven ? 'md:order-2' : 'md:order-1'}`}>
        <AnimatedHeading text={service.title} as="h3" className="!font-['Anton_SC'] !font-normal text-[32px] sm:text-[36px] md:text-[40px] lg:text-[48px] text-white mb-3 sm:mb-4 !leading-tight" animationType="lines"/>
        <AnimatedHeading 
          as="p" 
          text={service.description} 
          className="text-gray-100 text-[16px] sm:text-[17px] md:text-[18px] leading-relaxed mb-3 font-normal" 
          animationType="lines" 
        />
        {service.longDescription && 
          <AnimatedHeading 
            as="p" 
            text={service.longDescription} 
            className="text-gray-300 text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed font-normal italic" 
            animationType="lines" 
          />
        }
      </div>
    </div>
  );
};

const ServicesPage: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const servicesListRef = useRef<HTMLDivElement>(null);
  const whyChooseRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => { // GSAP Context for ServicesPage
      const sectionsToPin = [
        heroRef.current,
        whyChooseRef.current,
      ].filter(Boolean) as HTMLElement[];

      sectionsToPin.forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: () => section.offsetHeight < window.innerHeight ? "top top" : "bottom bottom",
          pin: true,
          pinSpacing: false,
        });
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="pt-20 md:pt-24 pb-16 font-['Inter'] bg-[#181a1b] text-white">
      <ParallaxBackground ref={heroRef} imageUrl="https://picsum.photos/seed/servicepagehero/1920/1080" speed={0.15} minHeight="60vh" contentClassName="items-center justify-center text-center px-4">
        <AnimatedHeading text="OUR SERVICES" as="h1" className="!font-['Anton_SC'] !font-normal text-[52px] xs:text-[60px] sm:text-[80px] md:text-[100px] lg:text-[112px] text-white uppercase !leading-none" animationType="lines" />
        <AnimatedHeading
          as="p"
          text="Tailored event planning solutions meticulously designed to surpass your every expectation and craft unforgettable moments."
          className="mt-4 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] text-gray-100 max-w-3xl text-center font-normal parallax-content-item"
          animationType="lines"
        />
      </ParallaxBackground>

      <div ref={servicesListRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {servicesData.map((service, index) => (
          <ServiceItemDisplay key={service.id} service={service} index={index} />
        ))}
      </div>

      <section ref={whyChooseRef} className="mt-12 sm:mt-16 md:mt-24 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedHeading text="Why Choose MIMEVENTS?" as="h2" className="!font-['Anton_SC'] !font-normal text-[36px] sm:text-[44px] md:text-[48px] lg:text-[60px] text-white mb-8 sm:mb-10 !leading-tight" animationType="lines" />
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8 text-left">
                <div className="p-4 sm:p-6">
                    <AnimatedHeading as="h4" text="Bespoke Designs" className="text-[18px] sm:text-[20px] md:text-[22px] font-semibold text-[#a3a3a4] mb-2 font-['Inter']" animationType="lines" />
                    <AnimatedHeading as="p" text="Every event is uniquely tailored to reflect your personal style, vision, and objectives with creative flair." className="text-gray-300 text-[15px] sm:text-[16px] font-normal" animationType="lines" />
                </div>
                <div className="p-4 sm:p-6">
                    <AnimatedHeading as="h4" text="Meticulous Execution" className="text-[18px] sm:text-[20px] md:text-[22px] font-semibold text-[#a3a3a4] mb-2 font-['Inter']" animationType="lines" />
                    <AnimatedHeading as="p" text="We manage every detail with precision and proactivity, ensuring a flawless and stress-free experience for you." className="text-gray-300 text-[15px] sm:text-[16px] font-normal" animationType="lines" />
                </div>
                <div className="p-4 sm:p-6">
                    <AnimatedHeading as="h4" text="Premium Network" className="text-[18px] sm:text-[20px] md:text-[22px] font-semibold text-[#a3a3a4] mb-2 font-['Inter']" animationType="lines" />
                    <AnimatedHeading as="p" text="Access to Lebanon's finest vendors, venues, and suppliers, guaranteeing unparalleled quality and service." className="text-gray-300 text-[15px] sm:text-[16px] font-normal" animationType="lines" />
                </div>
            </div>
             <Link
                to="/contact"
                className="mt-10 sm:mt-12 inline-block text-[#a3a3a4] hover:text-white border border-[#a3a3a4] hover:border-white font-semibold py-3 px-6 sm:px-8 text-[15px] sm:text-[16px] rounded-md shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
            >
                START PLANNING TODAY
            </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;