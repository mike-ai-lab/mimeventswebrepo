
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import ScrollToTop from './components/ScrollToTop';

gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  const location = useLocation();
  const appRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Refresh ScrollTrigger on location change AFTER new page content is rendered
    // and pinning logic has had a chance to run.
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150); // Slightly increased delay for safety after context reverts

    return () => clearTimeout(timer);
  }, [location]);

  // Cleanup GSAP animations and ScrollTriggers on location change
  useLayoutEffect(() => {
    // Create a context for all GSAP animations and ScrollTriggers within the App's main content area
    const ctx = gsap.context(() => {
      // Animations and ScrollTriggers created by child components (pages)
      // will be automatically added to this context if they are created
      // after this context is established and targeting elements within appRef.
      // If pages create their own contexts, those will handle their own cleanup.
    }, appRef); 

    return () => {
      ctx.revert(); // Revert all GSAP animations and ScrollTriggers created within this context
      // ScrollTrigger.refresh(); // Refresh ScrollTrigger's calculations after reverting
      // Call refresh in the useEffect above with a slight delay to ensure DOM is settled.
    };
  }, [location]);


  return (
    <div ref={appRef} className="bg-[#181a1b] text-white min-h-screen flex flex-col font-['Inter']">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
