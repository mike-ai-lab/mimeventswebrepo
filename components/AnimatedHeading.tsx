
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

type AnimatedHeadingAsTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';

interface AnimatedHeadingProps {
  text: string;
  as?: AnimatedHeadingAsTags;
  className?: string;
  animationType?: 'chars' | 'words' | 'lines' | 'typing';
  staggerAmount?: number;
  duration?: number;
  delay?: number;
  y?: number;
  once?: boolean; // To control if animation runs only once
}

const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  text,
  as: ElementTag = 'h1',
  className = '',
  animationType = 'lines', // Default to 'lines' for block animation
  staggerAmount,
  duration,
  delay = 0,
  y,
  once = true,
}) => {
  const headingRef = useRef<HTMLElement>(null);

  // Set defaults based on animationType
  const currentY = y ?? (animationType === 'lines' ? 40 : (animationType === 'typing' ? 0 : 30));
  const currentDuration = duration ?? (animationType === 'lines' ? 0.9 : (animationType === 'typing' ? 0.01 : 0.8));
  const currentStaggerAmount = staggerAmount ?? (
    animationType === 'lines' ? 0 :
    (animationType === 'typing' ? 0.04 :
    (animationType === 'words' ? 0.025 : 0.02))
  );
  const currentEase = animationType === 'typing' ? 'stepped(1)' : 'power3.out';


  const defaultBaseFont = ElementTag.startsWith('h') ? "font-['Anton_SC']" : "font-['Inter']";
  const defaultWeight = ElementTag.startsWith('h') ? 'font-normal' : 'font-normal';

  const hasCustomFontFamily = className.includes('font-[');
  const hasCustomFontWeight = className.match(/font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)/);

  let combinedClassName = className;
  if (!hasCustomFontFamily) {
    combinedClassName = `${defaultBaseFont} ${combinedClassName}`;
  }
  if (!hasCustomFontWeight) {
    combinedClassName = `${defaultWeight} ${combinedClassName}`;
  }
  combinedClassName = combinedClassName.trim();


  useLayoutEffect(() => {
    if (!headingRef.current || !text) {
      // Ensure the element is empty if no text is provided, to clear any previous content or {text} prop.
      if (headingRef.current) {
        headingRef.current.innerHTML = '';
      }
      return;
    }

    const el = headingRef.current!;
    const originalTextContent = el.innerHTML; // Capture initial state (which is {text} from render)

    const ctx = gsap.context(() => {
      let elementsToAnimate: NodeListOf<Element> | HTMLElement[] = [];

      // Crucial: Clear pre-existing content (the raw 'text' prop from JSX render)
      // before creating new span structure. This prevents flash.
      el.innerHTML = '';

      const escapeHtml = (unsafeText: string) => {
        return unsafeText
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
      };

      if (animationType === 'typing') {
        el.innerHTML = text.split('').map(char =>
            `<span class="anim-element" style="display: inline-block; opacity:0;">${char === ' ' ? '&nbsp;' : escapeHtml(char)}</span>`
        ).join('');
        elementsToAnimate = el.querySelectorAll('.anim-element');

      } else if (animationType === 'chars') {
         el.innerHTML = text.split('').map(char =>
            `<span class="anim-element" style="display: inline-block; opacity:0; transform: translateY(${currentY}px);">${char === ' ' ? '&nbsp;' : escapeHtml(char)}</span>`
        ).join('');
        elementsToAnimate = el.querySelectorAll('.anim-element');
      } else if (animationType === 'words') {
        el.innerHTML = text.split(' ').map(word =>
            `<span class="anim-element" style="display: inline-block; opacity:0; transform: translateY(${currentY}px); margin-right: 0.25em;">${escapeHtml(word)}</span>`
        ).join('');
        elementsToAnimate = el.querySelectorAll('.anim-element');
      } else { // 'lines'
        // For 'lines', the text is treated as a single block.
        // It's wrapped in a span that will be animated.
        el.innerHTML = `<span class="anim-element" style="display: inline-block; opacity:0; transform: translateY(${currentY}px);">${escapeHtml(text)}</span>`;
        elementsToAnimate = el.querySelectorAll('.anim-element');
      }

      if (elementsToAnimate.length === 0) {
        // If, after attempting to create elements, none are found (e.g. text was empty after all, or only spaces for word split)
        // ensure the element is empty and return.
        el.innerHTML = ''; // Ensure it's clean
        return;
      }

      if (animationType !== 'typing') {
        gsap.to(elementsToAnimate, {
          opacity: 1,
          y: 0,
          duration: currentDuration,
          stagger: currentStaggerAmount,
          ease: currentEase,
          delay,
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: once ? 'play none none none' : 'play reset play reset',
          },
        });
      } else { // Typing animation has slightly different parameters
         gsap.to(elementsToAnimate, {
          opacity: 1,
          // y: 0, // Not typically used for typing opacity animation
          duration: currentDuration,
          stagger: currentStaggerAmount,
          ease: currentEase,
          delay,
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: once ? 'play none none none' : 'play reset play reset',
          },
        });
      }
    }, el);

    return () => {
        if (el) {
            el.innerHTML = originalTextContent;
        }
        ctx.revert();
    }
  // IMPORTANT: Added `text` to dependency array. If `text` prop changes, effect should re-run.
  }, [text, animationType, currentStaggerAmount, currentDuration, currentY, currentEase, delay, ElementTag, className, once]);

  return (
    <ElementTag ref={headingRef as React.Ref<any>} className={combinedClassName}>
      {/*
        The content of this tag is initially the {text} prop.
        useLayoutEffect will synchronously clear this and replace it with animated spans.
        This should prevent a flash of the raw {text} before animation.
      */}
      {text}
    </ElementTag>
  );
};

export default AnimatedHeading;
