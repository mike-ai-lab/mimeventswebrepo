import React, { useLayoutEffect, useRef, useState } from 'react';
import { Testimonial } from '../types';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedHeading from './AnimatedHeading';

gsap.registerPlugin(ScrollTrigger);

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
  className?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, index, className }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(false);

  useLayoutEffect(() => {
    if (!cardRef.current) return;

    // GSAP sets the initial state. No need for inline styles on the div itself for this.
    gsap.set(cardRef.current, { opacity: 0, y: 50, scale: 0.95 });

    const ctx = gsap.context(() => {
      gsap.to(cardRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        delay: index * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
          once: true,
          onEnter: () => setShowContent(true), // Only show text after card is in view
        }
      });
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  const baseClasses =
    "bg-[#1f2324]/70 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-[#3a3e3f]/50 relative overflow-hidden h-full flex flex-col font-['Inter'] self-animated"; // Added 'self-animated'

  return (
    <div
      ref={cardRef}
      className={`${baseClasses} ${className || ''}`.trim()}
    >
      <div className="absolute -top-3 -left-2 text-[80px] font-['Anton_SC'] text-[#a3a3a4]/30 opacity-80 select-none" aria-hidden="true">
        “
      </div>
      <blockquote className="flex-grow">
        {showContent && (
          <AnimatedHeading
            as="p"
            text={testimonial.quote}
            className="text-white italic text-[18px] leading-relaxed mb-6 font-normal"
            animationType="lines"
            delay={0} // Text animation delay relative to when showContent becomes true
            once={true} // Ensure text animates once
          />
        )}
      </blockquote>
      <div className="text-right mt-auto pt-4 border-t border-[#3a3e3f]/40">
        {showContent && (
          <>
            <AnimatedHeading
              as="p"
              text={testimonial.author}
              className="font-semibold text-[#a3a3a4] text-[16px] font-['Inter']"
              animationType="lines"
              delay={0.1} // Text animation delay
              once={true} // Ensure text animates once
            />
            {testimonial.eventDate &&
              <AnimatedHeading
                as="p"
                text={testimonial.eventDate}
                className="text-[12px] text-gray-400 font-normal"
                animationType="lines"
                delay={0.2} // Text animation delay
                once={true} // Ensure text animates once
              />
            }
          </>
        )}
      </div>
    </div>
  );
};

export default TestimonialCard;
