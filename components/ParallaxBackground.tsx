
import React, { useLayoutEffect, useRef, forwardRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxBackgroundProps {
  imageUrl: string;
  speed?: number;
  children?: React.ReactNode;
  className?: string;
  minHeight?: string;
  contentClassName?: string;
  overlay?: boolean;
}

const ParallaxBackground = forwardRef<HTMLDivElement, ParallaxBackgroundProps>(({
  imageUrl,
  speed = 0.2,
  children,
  className = '',
  minHeight = 'auto',
  contentClassName = 'items-center justify-center text-center',
  overlay = true,
}, ref) => {
  const sectionRef = useRef<HTMLDivElement>(null); // Internal ref for GSAP context
  const bgRef = useRef<HTMLDivElement>(null);

  // Use the forwarded ref if available, otherwise use the internal sectionRef
  const effectiveRef = ref || sectionRef;

  useLayoutEffect(() => {
    const currentSectionRef = (effectiveRef as React.RefObject<HTMLDivElement>)?.current;
    if (!currentSectionRef || !bgRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgRef.current,
        { backgroundPositionY: '40%' },
        {
          backgroundPositionY: `${40 - speed * 40}%`,
          ease: 'none',
          scrollTrigger: {
            trigger: currentSectionRef,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );

      // Select only parallax items that are NOT self-animated for the generic entrance animation
      const contentElements = currentSectionRef.querySelectorAll<HTMLElement>('.parallax-content-item:not(.self-animated)');
      if (contentElements.length > 0) {
        gsap.fromTo(contentElements,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                stagger: 0.2,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: currentSectionRef,
                    start: 'top 75%',
                    toggleActions: 'play none none none',
                    once: true, // Ensure this entrance animation runs once
                }
            }
        );
      }

    }, currentSectionRef);

    return () => ctx.revert();
  }, [imageUrl, speed, minHeight, effectiveRef]); // Removed children from deps, as cloning logic doesn't directly influence this effect's core GSAP setup

  return (
    <div
      ref={effectiveRef}
      className={`relative overflow-hidden ${className}`}
      style={{ minHeight }}
    >
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
        aria-hidden="true"
      />
      {overlay && <div className="absolute inset-0 bg-[#181a1b]/60" aria-hidden="true"></div>}
      <div
        className={`relative z-10 flex flex-col h-full p-8 md:p-12 lg:p-16 ${contentClassName}`}
        style={{ minHeight }}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const currentChildProps = child.props as { className?: string; [key: string]: any };
            let existingClassName = currentChildProps.className || '';

            // Check if child is AnimatedHeading or if it already has parallax-content-item or self-animated
            const isAnimatedHeading = typeof child.type !== 'string' && (child.type as any).name === 'AnimatedHeading';
            const hasParallaxClass = existingClassName.includes('parallax-content-item');
            
            // Add 'parallax-content-item' if it's not an AnimatedHeading and doesn't already have it.
            // This class is used by HomePage for yPercent scrubbing on TestimonialCards.
            // TestimonialCards will get 'parallax-content-item' via their explicit prop in HomePage.
            // Other direct children of ParallaxBackground (that are not AnimatedHeading) might need it.
            // This logic mainly targets direct children that aren't pre-configured.
            if (!isAnimatedHeading && !hasParallaxClass && !existingClassName.includes('self-animated')) {
                 existingClassName = `${existingClassName} parallax-content-item`.trim();
            }
            
            const clonedElementProps = {
              ...currentChildProps,
              className: existingClassName,
            };

            return React.cloneElement(child, clonedElementProps as any);
          }
          return child;
        })}
      </div>
    </div>
  );
});

ParallaxBackground.displayName = 'ParallaxBackground';
export default ParallaxBackground;
