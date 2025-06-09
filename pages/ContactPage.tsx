
import React, { useLayoutEffect, useRef } from 'react';
import AnimatedHeading from '../components/AnimatedHeading';
import ContactForm from '../components/ContactForm';
import ParallaxBackground from '../components/ParallaxBackground';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ContactPage: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const contactContentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => { // GSAP Context for ContactPage
      const sectionsToPin = [
        heroRef.current,
        contactContentRef.current,
      ].filter(Boolean) as HTMLElement[];

      sectionsToPin.forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: () => section.offsetHeight < window.innerHeight ? "top top" : "bottom bottom",
          pin: true,
          pinSpacing: false,
        });
      });
    }, pageRef); // scope context to pageRef
    return () => ctx.revert();
  }, []);


  return (
    <div ref={pageRef} className="pt-20 md:pt-24 pb-16 font-['Inter'] bg-[#181a1b] text-white">
       <ParallaxBackground ref={heroRef} imageUrl="https://picsum.photos/seed/contactpagehero/1920/1080" speed={0.05} minHeight="60vh" contentClassName="items-center justify-center text-center px-4">
        <AnimatedHeading text="GET IN TOUCH" as="h1" className="!font-['Anton_SC'] !font-normal text-[52px] xs:text-[60px] sm:text-[80px] md:text-[100px] lg:text-[112px] text-white uppercase !leading-none" animationType="lines"/>
        <AnimatedHeading 
          as="p" 
          text="Let's discuss how MIMEVENTS can transform your vision into an unforgettable, flawlessly executed event." 
          className="mt-4 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] text-gray-100 max-w-3xl text-center font-normal parallax-content-item" 
          animationType="lines" 
        />
      </ParallaxBackground>

      <div ref={contactContentRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 bg-[#181a1b]">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          <div className="bg-[#1f2324]/70 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl border border-[#3a3e3f]/50">
            <AnimatedHeading text="Send Us a Message" as="h2" className="!font-['Anton_SC'] !font-normal text-[36px] sm:text-[40px] md:text-[48px] text-white mb-6 sm:mb-8 !leading-tight" animationType="lines" />
            <ContactForm />
          </div>
          
          <div className="space-y-8 sm:space-y-10">
            <div>
              <AnimatedHeading text="Contact Information" as="h2" className="!font-['Anton_SC'] !font-normal text-[36px] sm:text-[40px] md:text-[48px] text-white mb-4 sm:mb-6 !leading-tight" animationType="lines" />
              <div className="space-y-4 text-gray-100 text-[16px] sm:text-[17px] md:text-[18px] font-normal">
                <div>
                  <strong className="font-semibold text-[#a3a3a4] block mb-1">Address:</strong>
                  <AnimatedHeading as="span" text="MIMEVENTS Headquarters," animationType="lines" className="block" />
                  <AnimatedHeading as="span" text="Beirut, Lebanon" animationType="lines" className="block" delay={0.1}/>
                </div>
                <div>
                  <strong className="font-semibold text-[#a3a3a4] block mb-1">Phone:</strong>
                  <a href="tel:+961000000" className="hover:text-[#8a8a8b] transition-colors duration-200">
                     <AnimatedHeading as="span" text="+961 X XXX XXX" animationType="lines"/>
                  </a>
                </div>
                <div>
                  <strong className="font-semibold text-[#a3a3a4] block mb-1">Email:</strong>
                  <a href="mailto:info@mimevents.com" className="hover:text-[#8a8a8b] transition-colors duration-200">
                    <AnimatedHeading as="span" text="info@mimevents.com" animationType="lines"/>
                  </a>
                </div>
                <div>
                  <strong className="font-semibold text-[#a3a3a4] block mb-1">Business Hours:</strong>
                  <AnimatedHeading as="span" text="Monday - Friday: 9 AM - 6 PM" animationType="lines" className="block" />
                  <AnimatedHeading as="span" text="Saturday: 10 AM - 3 PM (By Appointment)" animationType="lines" className="block" delay={0.1}/>
                </div>
              </div>
            </div>
            
            <div>
              <AnimatedHeading text="Find Us" as="h3" className="!font-['Anton_SC'] !font-normal text-[24px] sm:text-[26px] md:text-[28px] text-white mb-3 sm:mb-4 !leading-tight" animationType="lines" />
              
              <div className="aspect-w-16 aspect-h-9 bg-[#2a2d2f] rounded-lg shadow-md overflow-hidden border border-[#3a3e3f]">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d211999.8809999908!2d35.37083401037466!3d33.889297200000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f17215880a78f%3A0x729182bae99836b4!2sBeirut%2C%20Lebanon!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
                    width="100%" 
                    height="100%" 
                    style={{border:0}} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="MIMEVENTS Location Map - Beirut"
                ></iframe>
              </div>
              <AnimatedHeading 
                as="p" 
                text="Our office is centrally located in the vibrant heart of Beirut." 
                className="text-sm text-gray-400 mt-2 sm:mt-3 text-center font-normal" 
                animationType="lines" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;