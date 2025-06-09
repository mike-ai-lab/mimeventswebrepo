
import React, { useState, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useLayoutEffect(() => {
    if (!formRef.current) return;

    const ctx = gsap.context(() => {
      const formElements = Array.from(formRef.current!.elements).filter(
        (el) => el instanceof HTMLElement && el.tagName !== 'BUTTON' 
      ) as HTMLElement[];
      const buttonElement = formRef.current!.querySelector('button');
      
      if (formElements.length > 0) {
        gsap.fromTo(formElements, 
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            stagger: 0.1, 
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: { 
              trigger: formRef.current,
              start: 'top 85%', 
              toggleActions: 'play none none none'
            }
          }
        );
      }
      if (buttonElement) {
         gsap.fromTo(buttonElement, 
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.6,
            delay: formElements.length * 0.1, 
            ease: 'power2.out',
            scrollTrigger: {
              trigger: formRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }, formRef);
    
    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
        setError('Please fill in all required fields.');
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address.');
        return;
    }

    console.log('Form data submitted:', formData);
    setIsSubmitted(true);
    setError('');
    setFormData({ name: '', email: '', phone: '', message: '' });
    
    setTimeout(() => {
        setIsSubmitted(false);
    }, 5000); 
  };

  const inputClass = "w-full px-4 py-3 bg-[#2a2d2f]/80 border border-[#3a3e3f] rounded-lg text-white font-normal font-['Inter'] focus:ring-2 focus:ring-[#a3a3a4] focus:border-[#a3a3a4] outline-none transition-all duration-200 placeholder-gray-500 text-[16px]"; // Updated bg, border, focus colors
  const labelClass = "block text-[14px] font-medium text-gray-200 mb-1.5 font-['Inter']";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className={labelClass}>Full Name <span className="text-[#a3a3a4]">*</span></label> {/* Color updated */}
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className={inputClass} placeholder="e.g. John Doe" />
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>Email Address <span className="text-[#a3a3a4]">*</span></label> {/* Color updated */}
        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="you@example.com" />
      </div>
      <div>
        <label htmlFor="phone" className={labelClass}>Phone Number (Optional)</label>
        <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+961 XX XXX XXX" />
      </div>
      <div>
        <label htmlFor="message" className={labelClass}>Your Message / Event Details <span className="text-[#a3a3a4]">*</span></label> {/* Color updated */}
        <textarea name="message" id="message" value={formData.message} onChange={handleChange} rows={5} required className={inputClass} placeholder="Tell us about your event, preferred dates, number of guests, etc..."></textarea>
      </div>
      
      {error && (
        <p className="text-[14px] text-red-400 bg-red-900/30 p-3 rounded-md font-['Inter']">{error}</p>
      )}

      {isSubmitted && (
        <p className="text-[14px] text-green-300 bg-green-900/50 p-3 rounded-md text-center font-['Inter']">
          Thank you! Your message has been sent. We'll be in touch very soon.
        </p>
      )}

      <div>
        <button
          type="submit"
          className="w-full text-[#a3a3a4] hover:text-white border border-[#a3a3a4] hover:border-white font-['Inter'] font-semibold py-3.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#a3a3a4] focus:ring-opacity-75 text-[16px]"
        >
          SEND YOUR REQUEST
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
