
import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedHeading from './AnimatedHeading'; 

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="relative z-20 bg-white text-[#0e1011] pt-24 md:pt-32 pb-16 md:pb-20 font-['Inter']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:text-left">
          <Link to="/" className="text-6xl md:text-8xl font-normal font-['Anton_SC'] text-[#0e1011] hover:text-gray-700 transition-colors duration-300 tracking-normal">
            MIMEVENTS
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-12">
          <div>
            <AnimatedHeading as="h4" text="(Pages)" className="text-[14px] font-['Gambetta',_serif] italic text-gray-500 mb-4" animationType="lines" />
            <ul className="space-y-3 text-[16px] font-medium">
              <li><Link to="/" className="hover:text-[#a3a3a4] transition-colors"><AnimatedHeading as="span" text="Home" animationType="lines"/></Link></li>
              <li><Link to="/services" className="hover:text-[#a3a3a4] transition-colors"><AnimatedHeading as="span" text="Services" animationType="lines"/></Link></li>
              <li><Link to="/gallery" className="hover:text-[#a3a3a4] transition-colors"><AnimatedHeading as="span" text="Gallery" animationType="lines"/></Link></li>
              <li><Link to="/contact" className="hover:text-[#a3a3a4] transition-colors"><AnimatedHeading as="span" text="Contact" animationType="lines"/></Link></li>
            </ul>
          </div>

          <div>
            <AnimatedHeading as="h4" text="(Explore)" className="text-[14px] font-['Gambetta',_serif] italic text-gray-500 mb-4" animationType="lines" />
            <ul className="space-y-3 text-[16px] font-medium">
               <li><a href="#/contact" className="hover:text-[#a3a3a4] transition-colors"><AnimatedHeading as="span" text="About Us (Soon)" animationType="lines"/></a></li>
               <li><a href="#/contact" className="hover:text-[#a3a3a4] transition-colors"><AnimatedHeading as="span" text="Blog (Soon)" animationType="lines"/></a></li>
            </ul>
          </div>

          <div>
            <AnimatedHeading as="h4" text="(Contact Us)" className="text-[14px] font-['Gambetta',_serif] italic text-gray-500 mb-4" animationType="lines" />
            <ul className="space-y-3 text-[16px] font-medium">
              <li><a href="mailto:info@mimevents.com" className="hover:text-[#a3a3a4] transition-colors"><AnimatedHeading as="span" text="info@mimevents.com" animationType="lines"/></a></li>
              <li><a href="tel:+961000000" className="hover:text-[#a3a3a4] transition-colors"><AnimatedHeading as="span" text="+961 X XXX XXX" animationType="lines"/></a></li>
            </ul>
          </div>

          <div>
            <AnimatedHeading as="h4" text="(Socials)" className="text-[14px] font-['Gambetta',_serif] italic text-gray-500 mb-4" animationType="lines" />
            <ul className="space-y-3 text-[16px] font-medium">
              <li><a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-[#a3a3a4] transition-colors"><AnimatedHeading as="span" text="Instagram" animationType="lines"/></a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-[#a3a3a4] transition-colors"><AnimatedHeading as="span" text="Facebook" animationType="lines"/></a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-[#a3a3a4] transition-colors"><AnimatedHeading as="span" text="LinkedIn" animationType="lines"/></a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#0e1011]/20 text-[14px] text-[#0e1011]/80">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} MIMEVENTS. All rights reserved.</p>
            <button 
              onClick={scrollToTop} 
              className="mt-4 sm:mt-0 hover:text-[#a3a3a4] transition-colors flex items-center font-medium"
              aria-label="Back to top"
            >
              Back to Top 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
