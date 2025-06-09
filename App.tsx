
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
    // A small delay can help ensure calculations are correct after route transitions.
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100); // Adjust delay if needed, or use a more robust solution for post-render refresh

    return () => clearTimeout(timer);
  }, [location]);

  // Kill all ScrollTriggers when App unmounts or on location change before new ones are created
  // This helps prevent lingering triggers from previous pages.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {}, appRef); // Establish a context
    return () => {
      ctx.revert(); // This will kill all ScrollTriggers and animations created within this context
      // We might need to be more selective if Navbar/Footer create STs outside page context
      // For now, pages will create their STs, and this should clean them up.
      // Let's refine if Navbar/Footer need their own independent contexts.
      // For robust cleanup, ensure all STs are created within a context that's reverted.
      ScrollTrigger.getAll().forEach(st => st.kill()); // A more aggressive cleanup
      ScrollTrigger.refresh(); // Refresh after killing to reset scroll state
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