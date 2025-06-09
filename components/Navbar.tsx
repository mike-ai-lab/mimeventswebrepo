
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link, NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { NavLinkItem } from '../types';
import { gsap } from 'gsap';

const navLinks: NavLinkItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Gallery', path: '/gallery' },
];

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Adjust threshold as needed
    };
    window.addEventListener('scroll', handleScroll);
    // Call handler once to set initial state
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu on location change
    setIsMobileMenuOpen(false);
  }, [location]);

  useLayoutEffect(() => {
    if (!navRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(navRef.current!.querySelectorAll('.nav-item-desktop'), 
        { opacity: 0, y: -20 }, 
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, delay: 0.3, ease: 'power3.out' }
      );
      gsap.fromTo(navRef.current!.querySelector('.logo-text'), 
        { opacity: 0, x: -20 }, 
        { opacity: 1, x: 0, duration: 0.8, delay: 0.1, ease: 'power3.out' }
      );
    }, navRef); 

    return () => ctx.revert();
  }, []); 

  useLayoutEffect(() => {
    if (mobileMenuRef.current) {
      if (isMobileMenuOpen) {
        gsap.fromTo(mobileMenuRef.current, 
          { maxHeight: 0, opacity: 0 }, 
          { maxHeight: '500px', opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
        gsap.fromTo(mobileMenuRef.current.querySelectorAll('.nav-item-mobile'),
          { opacity: 0, y: -15 },
          { opacity: 1, y: 0, stagger: 0.05, duration: 0.3, delay: 0.1, ease: 'power2.out' }
        );
      } else {
        // Only animate to hidden if it's not the initial state (maxHeight will be 0 initially due to style)
        if (mobileMenuRef.current.style.maxHeight !== '0px') {
            gsap.to(mobileMenuRef.current, 
            { maxHeight: 0, opacity: 0, duration: 0.2, ease: 'power2.in' }
            );
        }
      }
    }
  }, [isMobileMenuOpen]);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `nav-item-desktop px-3 py-2 rounded-md text-[16px] font-normal font-['Inter'] transition-colors duration-300 ${
      isActive ? 'text-[#a3a3a4]' : 'text-white hover:text-[#a3a3a4]'
    }`;
  
  const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `nav-item-mobile block px-3 py-3 rounded-md text-base font-medium font-['Inter'] transition-colors duration-300 ${
      isActive ? 'text-[#a3a3a4] font-semibold' : 'text-white hover:text-[#a3a3a4]'
    }`;

  return (
    <nav 
      ref={navRef} 
      className={`fixed w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled || isMobileMenuOpen 
          ? 'bg-[#181a1b]/90 backdrop-blur-sm shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          <div className="flex items-center">
            <Link to="/" className="text-4xl md:text-5xl font-normal logo-text font-['Anton_SC'] text-white hover:text-gray-200 transition-colors duration-300 tracking-normal">
              MIM<span className="text-[#a3a3a4]">EVENTS</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navLinks.map((link) => (
              <RouterNavLink key={link.label} to={link.path} className={navLinkClasses}>
                {link.label.toUpperCase()}
              </RouterNavLink>
            ))}
            <Link
              to="/contact"
              className="nav-item-desktop ml-2 text-[#a3a3a4] hover:text-white font-['Inter'] font-semibold px-5 py-2.5 text-[16px] rounded-md transition-all duration-300 ease-in-out transform hover:scale-105" // Removed border and shadow
            >
              LET'S TALK
            </Link>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-[#a3a3a4] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#a3a3a4]"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu - background will match main nav based on isMobileMenuOpen */}
      <div 
        ref={mobileMenuRef} 
        id="mobile-menu" 
        className="md:hidden overflow-hidden" // Removed specific background classes, inherits from parent nav
        style={{ maxHeight: 0, opacity: 0 }}
      >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <RouterNavLink
                key={link.label}
                to={link.path}
                className={mobileNavLinkClasses}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label.toUpperCase()}
              </RouterNavLink>
            ))}
            <RouterNavLink
              to="/contact"
              className="nav-item-mobile block px-3 py-3 rounded-md text-base font-medium font-['Inter'] mt-2 w-full text-center text-[#a3a3a4] hover:text-white transition-all duration-300 ease-in-out" // Removed border
              onClick={() => setIsMobileMenuOpen(false)}
            >
              LET'S TALK
            </RouterNavLink>
          </div>
        </div>
    </nav>
  );
};

export default Navbar;
