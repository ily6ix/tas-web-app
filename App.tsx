
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation as SwiperNavigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { 
  Calendar, 
  MapPin, 
  Phone, 
  Instagram, 
  Facebook, 
  Clock, 
  Scissors, 
  Sparkles, 
  ChevronRight,
  Menu,
  X,
  Star,
  User,
  Heart,
  Filter,
  ArrowLeft,
  Navigation as NavIcon,
  ExternalLink,
  Award
} from 'lucide-react';

import { SERVICES, SOCIAL_POSTS } from './constants';
import { Service, BookingDetails } from './types';
import { getBeautyRecommendations, getLocationInsights } from './geminiService';

type View = 'home' | 'services';

const Header: React.FC<{ 
  onBookClick: () => void; 
  currentView: View; 
  setView: (v: View) => void; 
}> = ({ onBookClick, currentView, setView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    if (currentView === 'home') {
      const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      };

      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      };

      const observer = new IntersectionObserver(observerCallback, observerOptions);
      const sections = ['home', 'services', 'about', 'gallery', 'location', 'social'];
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });

      return () => {
        window.removeEventListener('scroll', handleScroll);
        observer.disconnect();
      };
    }
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const navLinks = [
    { name: 'Home', action: () => setView('home'), id: 'home', isPage: true },
    { name: 'Menu', action: () => setView('services'), id: 'services', isPage: true },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Location', href: '#location', id: 'location' },
    { name: 'Social', href: '#social', id: 'social' },
  ];

  const handleLinkClick = (link: typeof navLinks[0]) => {
    setMobileMenuOpen(false);
    if (link.isPage) {
      link.action?.();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (currentView !== 'home') {
        setView('home');
        setTimeout(() => {
          document.querySelector(link.href!)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.querySelector(link.href!)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled || currentView !== 'home' ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => { setView('home'); window.scrollTo({top: 0, behavior: 'smooth'}); }}
        >
          <Sparkles className={`w-8 h-8 transition-all duration-300 group-hover:rotate-12 ${isScrolled || currentView !== 'home' ? 'text-pink-500' : 'text-white'}`} />
          <h1 className={`text-2xl font-bold tracking-tighter serif transition-colors duration-300 ${isScrolled || currentView !== 'home' ? 'text-slate-900' : 'text-white'}`}>
            TA's <span className="font-light italic">Beauty Lounge</span>
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={() => handleLinkClick(link)}
              className={`relative text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 hover:text-pink-500 ${
                (currentView === 'services' && link.id === 'services') || (currentView === 'home' && activeSection === link.id)
                  ? 'text-pink-500' 
                  : isScrolled || currentView !== 'home' ? 'text-slate-600' : 'text-white/80'
              }`}
            >
              {link.name}
              {((currentView === 'services' && link.id === 'services') || (currentView === 'home' && activeSection === link.id)) && (
                <motion.div 
                  layoutId="navUnderline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-pink-500 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
          <button 
            onClick={onBookClick}
            className="px-6 py-2 bg-pink-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-pink-600 transition-all rounded-full shadow-lg shadow-pink-500/20 active:scale-95 ml-4"
          >
            Book Now
          </button>
        </nav>

        <button className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
          <Menu className={isScrolled || currentView !== 'home' ? 'text-pink-500' : 'text-white'} />
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-white z-[60] flex flex-col p-8"
          >
            <div className="flex justify-end">
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-8 h-8 text-slate-900" />
              </button>
            </div>
            <div className="flex flex-col gap-8 mt-12 items-center">
              {navLinks.map((link) => (
                <button 
                  key={link.name} 
                  onClick={() => handleLinkClick(link)}
                  className={`text-2xl serif transition-colors ${currentView === link.id || activeSection === link.id ? 'text-pink-500 font-bold' : 'text-slate-800'}`}
                >
                  {link.name}
                </button>
              ))}
              <button 
                onClick={() => { onBookClick(); setMobileMenuOpen(false); }}
                className="mt-4 px-10 py-4 bg-pink-500 text-white text-sm font-bold uppercase tracking-widest rounded-full shadow-xl shadow-pink-500/30"
              >
                Book Appointment
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const LocationSection: React.FC = () => {
  const [insights, setInsights] = useState<{text: string, links: any[]} | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchInsights() {
      setLoading(true);
      const data = await getLocationInsights();
      setInsights(data);
      setLoading(false);
    }
    fetchInsights();
  }, []);

  return (
    <section id="location" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-pink-500 font-bold tracking-[0.3em] uppercase text-xs mb-3 block"
          >
            Visit Our Midrand Lounge
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl serif mb-4"
          >
            Our Exclusive Address
          </motion.h2>
          <div className="w-24 h-1 bg-pink-500 mx-auto opacity-30 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8 bg-pink-50/30 p-10 rounded-[3rem] border border-pink-100/50 flex flex-col justify-center"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-pink-500">
                <MapPin className="w-6 h-6" />
                <h4 className="font-bold uppercase tracking-widest text-xs">The Address</h4>
              </div>
              <p className="text-3xl serif text-slate-800 leading-tight">
                TA's Beauty Lounge <br />
                563 Seventh Road <br />
                Halfway Gardens, Midrand
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-y border-pink-100/50 py-6">
              <div>
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-pink-500 mb-2">Mon - Sat</h5>
                <p className="text-sm font-bold text-slate-700">08:30 - 18:00</p>
              </div>
              <div>
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-pink-500 mb-2">Sunday</h5>
                <p className="text-sm font-bold text-slate-700">09:00 - 14:00</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-pink-500">
                <Sparkles className="w-6 h-6" />
                <h4 className="font-bold uppercase tracking-widest text-xs">Midrand Highlights</h4>
              </div>
              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-pink-100 rounded w-full"></div>
                  <div className="h-4 bg-pink-100 rounded w-5/6"></div>
                </div>
              ) : insights ? (
                <div className="space-y-4">
                  <p className="text-slate-600 font-light leading-relaxed italic">
                    "{insights.text}"
                  </p>
                </div>
              ) : (
                <p className="text-slate-400 font-light">Unable to load area insights.</p>
              )}
            </div>

            <div className="pt-6">
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=563+Seventh+Road+Midrand"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-pink-500 transition-all active:scale-95 shadow-xl shadow-slate-200"
              >
                <NavIcon size={16} /> Get Directions
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white min-h-[450px]"
          >
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              style={{ border: 0 }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3584.582455828456!2d28.114704!3d-25.981881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e9571343770f171%3A0x7d018247072a3921!2s563%20Seventh%20Rd%2C%20Halfway%20Gardens%2C%20Midrand%2C%201686!5e0!3m2!1sen!2sza!4v1700000000000!5m2!1sen!2sza" 
              allowFullScreen
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ServicesPage: React.FC<{ onBook: () => void }> = ({ onBook }) => {
  const [filter, setFilter] = useState<string>('All');
  const categories = ['All', 'Nails', 'Feet', 'Face', 'Makeup', 'Waxing'];

  const filteredServices = useMemo(() => {
    if (filter === 'All') return SERVICES;
    return SERVICES.filter(s => s.category === filter);
  }, [filter]);

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-pink-500 font-bold tracking-[0.4em] uppercase text-xs mb-4 block"
          >
            Boutique Menu
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl serif mb-6"
          >
            Exquisite Treatments
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-slate-500 text-lg font-light leading-relaxed mb-12"
          >
            Experience a peaceful setting where attention to detail and client comfort take center stage. Every visit leaves you refreshed and well looked after.
          </motion.p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((cat, idx) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border-2 ${
                  filter === cat 
                    ? 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-200' 
                    : 'bg-white border-slate-100 text-slate-400 hover:border-pink-200 hover:text-pink-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service) => (
              <motion.div
                layout
                key={service.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-pink-50 hover:shadow-2xl hover:shadow-pink-100 transition-all duration-500"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest text-pink-500 shadow-sm">
                    {service.category}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl serif text-slate-800">{service.name}</h3>
                    <span className="text-pink-500 font-bold text-xl">{service.price}</span>
                  </div>
                  <p className="text-slate-500 text-sm font-light leading-relaxed mb-8 line-clamp-3">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-pink-50">
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      <Clock size={14} className="text-pink-300" />
                      {service.duration}
                    </div>
                    <button 
                      onClick={onBook}
                      className="flex items-center gap-2 group/btn text-pink-500 font-bold uppercase tracking-widest text-[10px] hover:text-pink-600 transition-colors"
                    >
                      Book Session <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

const HomeView: React.FC<{ 
  onBookClick: () => void; 
  onViewServices: () => void; 
}> = ({ onBookClick, onViewServices }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Hero onViewServices={onViewServices} />
      
      <section id="about" className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="aspect-[3/4] overflow-hidden rounded-[3rem] shadow-2xl"
              >
                <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop" alt="Lounge Interior" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute -bottom-10 -right-10 w-2/3 aspect-square bg-white p-6 shadow-2xl rounded-[2rem] hidden md:block border-8 border-[#fffafb]"
              >
                <div className="w-full h-full bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1596462502278-27bfac44221d?q=80&w=800&auto=format&fit=crop" alt="Details" className="w-full h-full object-cover" />
                </div>
              </motion.div>
            </div>

            <div className="space-y-8">
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-pink-500 font-bold tracking-[0.4em] uppercase text-xs"
              >
                Our Essence
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-6xl serif leading-tight text-slate-800"
              >
                Your Sanctuary <br /> in Midrand
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-slate-600 leading-relaxed italic border-l-4 border-pink-500 pl-8 py-2"
              >
                "TA's Beauty Lounge offers a peaceful and stylish setting where attention to detail and client comfort take center stage."
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-500 leading-relaxed font-light text-lg"
              >
                Our atmosphere is warm and welcoming, designed to make each visit a calming and enjoyable experience. With a focus on quality and care, every moment spent here leaves you feeling refreshed, confident, and well looked after.
              </motion.p>
              
              <div className="bg-pink-50/50 p-8 rounded-3xl border border-pink-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-white">
                    <User size={24} />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">Portia</h5>
                    <p className="text-[10px] uppercase tracking-widest text-pink-500 font-bold">Nail Tech & Beauty Therapist</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-light italic">"Dedicated to delivering artistry and care to every client, Portia leads our technical team with precision and passion."</p>
              </div>

              <button 
                onClick={onViewServices}
                className="flex items-center gap-3 group text-slate-900 font-bold uppercase tracking-[0.2em] text-[10px] pt-4 hover:text-pink-500 transition-colors"
              >
                Explore Complete Menu <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform text-pink-500" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div id="services">
        <ServicesSection onViewAll={onViewServices} />
      </div>
      
      <div id="gallery">
        <AIConsultation />
      </div>
      
      <LocationSection />
      
      <div id="social">
        <SocialFeed />
      </div>

      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl -ml-16 -mt-16"></div>
        <div className="container mx-auto px-4 md:px-8 text-center max-w-4xl relative z-10">
           <div className="flex justify-center gap-2 mb-10">
              {[...Array(5)].map((_, i) => <Star key={i} className="text-pink-500 fill-pink-500 w-5 h-5" />)}
           </div>
           <motion.p 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="text-2xl md:text-4xl serif italic mb-12 leading-relaxed text-slate-800"
            >
             "An absolutely sublime experience. The attention to detail in my acrylic set left me feeling truly rejuvenated. My aesthetic has been elevated."
           </motion.p>
           <div className="flex flex-col items-center">
             <div className="w-20 h-20 rounded-full overflow-hidden mb-6 ring-8 ring-pink-50 shadow-xl">
               <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" alt="Client" />
             </div>
             <h5 className="font-bold text-slate-900 text-lg">Alexandra Sterling</h5>
             <p className="text-[10px] uppercase tracking-[0.4em] text-pink-500 font-bold mt-1">Midrand Local Patron</p>
           </div>
        </div>
      </section>

      <section className="py-24 bg-pink-50/20">
         <div className="container mx-auto px-4 md:px-8">
            <div className="bg-slate-900 rounded-[4rem] p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12 text-white text-center md:text-left relative shadow-2xl shadow-pink-100 overflow-hidden">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px]"></div>
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-500/5 rounded-full blur-[80px]"></div>
              <div className="max-w-xl relative z-10">
                <h2 className="text-4xl md:text-6xl serif mb-6 leading-tight">Book Your Session</h2>
                <p className="text-slate-400 text-xl font-light mb-10 leading-relaxed">Secure your exclusive session in our Midrand lounge and begin your transformation.</p>
                <button 
                  onClick={onBookClick}
                  className="px-16 py-6 bg-pink-500 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-pink-600 transition-all rounded-full shadow-2xl shadow-pink-500/40 active:scale-95"
                >
                  Reserve Instant Access
                </button>
              </div>
              <div className="flex items-center justify-center gap-10 relative z-10 bg-slate-800/40 p-10 rounded-[3rem] backdrop-blur-sm border border-slate-700/50">
                <div className="space-y-4 text-center">
                  <Award size={40} className="text-pink-400 mx-auto" />
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-pink-200">Certified Techs</p>
                </div>
                <div className="w-px h-16 bg-white/10"></div>
                <div className="space-y-4 text-center">
                  <Clock size={40} className="text-pink-400 mx-auto" />
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-pink-200">Open 7 Days</p>
                </div>
              </div>
            </div>
         </div>
      </section>
    </motion.div>
  );
};

const Hero: React.FC<{ onViewServices: () => void }> = ({ onViewServices }) => {
  const slides = [
    {
      img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2000&auto=format&fit=crop',
      title: 'Artistry in Every Detail',
      subtitle: 'Premium Nail Care & Aesthetic Excellence'
    },
    {
      img: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2000&auto=format&fit=crop',
      title: 'Unveil Your Radiance',
      subtitle: 'Exclusive Midrand Beauty Experience'
    }
  ];

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{ delay: 6000 }}
        loop
        className="h-full w-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative h-full w-full">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms]"
                style={{ backgroundImage: `url(${slide.img})` }}
              >
                <div className="absolute inset-0 bg-black/40" />
              </div>
              <div className="relative h-full container mx-auto px-4 md:px-8 flex flex-col justify-center items-start text-white">
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="font-bold tracking-[0.4em] uppercase mb-4 text-pink-300 text-xs md:text-sm"
                >
                  The Midrand Elite
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-5xl md:text-8xl font-bold mb-6 serif leading-tight max-w-4xl"
                >
                  {slide.title}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-lg md:text-2xl font-light mb-10 max-w-xl opacity-90 leading-relaxed"
                >
                  {slide.subtitle}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex gap-4"
                >
                  <button 
                    onClick={onViewServices}
                    className="px-8 md:px-10 py-4 bg-white text-slate-900 font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-pink-500 hover:text-white transition-all shadow-xl active:scale-95"
                  >
                    View Treatments
                  </button>
                  <a href="#about" className="px-8 md:px-10 py-4 border-2 border-white text-white font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-white/10 transition-all backdrop-blur-sm active:scale-95">
                    Our Essence
                  </a>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

const ServicesSection: React.FC<{ onViewAll: () => void }> = ({ onViewAll }) => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-pink-500 font-bold tracking-[0.3em] uppercase text-xs mb-3 block"
          >
            Indulge Yourself
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl serif mb-4"
          >
            Featured Menu
          </motion.h2>
          <div className="w-24 h-1 bg-pink-500 mx-auto opacity-30 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.slice(0, 4).map((service, idx) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative overflow-hidden aspect-[4/5] mb-6 rounded-2xl shadow-lg group-hover:shadow-pink-200 transition-all duration-500">
                <img 
                  src={service.image} 
                  alt={service.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-pink-500/20 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 w-full bg-gradient-to-t from-pink-500/80 to-transparent">
                  <button className="bg-white text-slate-900 px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-colors rounded-full w-full">
                    Quick Book
                  </button>
                </div>
              </div>
              <h3 className="text-xl serif mb-2 group-hover:text-pink-500 transition-colors">{service.name}</h3>
              <p className="text-slate-500 text-sm mb-4 leading-relaxed line-clamp-2">{service.description}</p>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="font-bold text-slate-900 group-hover:text-pink-600 transition-colors text-lg">{service.price}</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 uppercase tracking-widest font-bold">
                  <Clock className="w-3 h-3" /> {service.duration}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <button 
            onClick={onViewAll}
            className="px-12 py-5 border-2 border-pink-500 text-pink-500 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-pink-500 hover:text-white transition-all rounded-full active:scale-95 shadow-lg shadow-pink-100"
          >
            Explore Complete Menu
          </button>
        </div>
      </div>
    </section>
  );
};

const SocialFeed: React.FC = () => {
  return (
    <section className="py-24 bg-pink-50/40">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <span className="text-pink-500 font-bold tracking-[0.3em] uppercase text-xs mb-3 block text-center md:text-left">On the Feed</span>
            <h2 className="text-4xl md:text-5xl serif text-center md:text-left">Join Our Community</h2>
          </div>
          <a 
            href="https://instagram.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-600 hover:text-pink-600 transition-colors font-bold tracking-widest text-[10px] uppercase border-b-2 border-transparent hover:border-pink-500 pb-2"
          >
            <Instagram className="w-5 h-5" /> @TAsBeautyLounge <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SOCIAL_POSTS.map((post) => (
            <motion.div 
              key={post.id}
              whileHover={{ y: -12 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-pink-100/50"
            >
              <div className="flex items-center p-4 gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                  <User className="text-pink-400 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">TA's Beauty Lounge</h4>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">{post.date}</p>
                </div>
              </div>
              <div className="overflow-hidden aspect-square">
                <img src={post.image} alt="Social post" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              <div className="p-5">
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 italic">"{post.caption}"</p>
                <div className="flex items-center gap-4 mt-4 text-pink-400">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-pink-400" />
                    <span className="text-[10px] font-bold">42 Likes</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AIConsultation: React.FC = () => {
  const [concern, setConcern] = useState('');
  const [skinType, setSkinType] = useState('normal');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const handleConsult = async () => {
    if (!concern) return;
    setLoading(true);
    const result = await getBeautyRecommendations(concern, skinType);
    if (result && result.recommendations) {
      setRecommendations(result.recommendations);
    }
    setLoading(false);
  };

  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
        <Sparkles className="w-full h-full text-pink-500" />
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-pink-400 font-bold tracking-[0.4em] uppercase text-xs mb-3 block">Intelligent Beauty</span>
            <h2 className="text-4xl md:text-5xl serif mb-6 leading-tight">Virtual Beauty Advisor</h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed font-light">
              Experience the future of personalized care. Our AI analyzes your unique needs to curate a bespoke lounge experience designed to reveal your best self.
            </p>

            <div className="space-y-6 max-w-md bg-slate-800/50 p-8 rounded-3xl backdrop-blur-md border border-slate-700">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] mb-3 font-bold text-pink-300">Skin Profile</label>
                <select 
                  value={skinType}
                  onChange={(e) => setSkinType(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-pink-500 transition-all outline-none text-sm"
                >
                  <option value="dry">Dry & Dehydrated</option>
                  <option value="oily">Oily & Acne-prone</option>
                  <option value="combination">Combination</option>
                  <option value="normal">Normal / Balanced</option>
                  <option value="sensitive">Sensitive & Reactive</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] mb-3 font-bold text-pink-300">Your Aspirations</label>
                <textarea 
                  value={concern}
                  onChange={(e) => setConcern(e.target.value)}
                  placeholder="E.g., I want to reduce fine lines and achieve a youthful glow before my event..."
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-pink-500 transition-all outline-none h-32 resize-none text-sm placeholder:text-slate-600"
                />
              </div>

              <button 
                onClick={handleConsult}
                disabled={loading}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold uppercase tracking-[0.2em] py-5 rounded-xl transition-all disabled:opacity-50 shadow-2xl shadow-pink-500/20 active:scale-95 text-[10px]"
              >
                {loading ? 'Analyzing Skin Profile...' : 'Reveal My Personal Plan'}
              </button>
            </div>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {recommendations.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid grid-cols-1 gap-4"
                >
                  {recommendations.map((rec, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-slate-800/80 p-6 rounded-2xl border-l-4 border-pink-500 backdrop-blur-md shadow-xl"
                    >
                      <h4 className="text-pink-400 font-bold mb-2 serif text-xl">{rec.title}</h4>
                      <p className="text-sm text-slate-300 mb-3 leading-relaxed">{rec.description}</p>
                      <p className="text-[10px] text-pink-300 uppercase tracking-widest font-bold flex items-center gap-2">
                        <Sparkles size={12} className="fill-pink-300" /> {rec.benefit}
                      </p>
                    </motion.div>
                  ))}
                  <button 
                    onClick={() => setRecommendations([])}
                    className="text-slate-500 hover:text-pink-400 text-[10px] uppercase tracking-[0.3em] font-bold mt-4 self-center transition-colors"
                  >
                    Reset Consultation
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="aspect-square bg-slate-800/30 rounded-[3rem] flex items-center justify-center border-2 border-dashed border-slate-700 p-12 text-center"
                >
                  <div>
                    <Sparkles className="w-20 h-20 text-pink-500/20 mx-auto mb-6 animate-pulse" />
                    <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px] font-bold">Your bespoke results will manifest here</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const BookingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState<Partial<BookingDetails>>({});

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <div className="flex h-[600px] flex-col md:flex-row">
          <div className="md:w-1/3 bg-pink-50/60 p-8 hidden md:flex flex-col">
            <h3 className="serif text-3xl mb-8 text-slate-800">Reservation</h3>
            <div className="space-y-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step >= s ? 'bg-pink-500 text-white scale-110 shadow-lg shadow-pink-200' : 'bg-pink-100 text-pink-300'}`}>
                    {s}
                  </div>
                  <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${step === s ? 'text-pink-600' : 'text-slate-400'}`}>
                    {s === 1 ? 'Selection' : s === 2 ? 'Scheduling' : 'Finalize'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 p-8 flex flex-col">
            <div className="flex justify-between mb-8 md:hidden">
              <span className="text-[10px] font-bold uppercase tracking-widest text-pink-500">Step {step} of 3</span>
              <button onClick={onClose} className="text-slate-400"><X size={20}/></button>
            </div>
            <button onClick={onClose} className="absolute top-8 right-8 hidden md:block hover:text-pink-500 transition-colors text-slate-300"><X size={24}/></button>

            <div className="flex-1 overflow-y-auto pr-2">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <h4 className="serif text-2xl mb-6 text-slate-800">Select Treatment</h4>
                  {SERVICES.map((s) => (
                    <button 
                      key={s.id}
                      onClick={() => { setDetails({ ...details, serviceId: s.id }); setStep(2); }}
                      className={`w-full text-left p-5 border-2 rounded-2xl flex justify-between items-center group transition-all duration-300 ${details.serviceId === s.id ? 'border-pink-500 bg-pink-50/50' : 'border-slate-50 hover:border-pink-200'}`}
                    >
                      <div>
                        <p className={`font-bold text-sm ${details.serviceId === s.id ? 'text-pink-600' : 'text-slate-800'}`}>{s.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{s.duration}</p>
                      </div>
                      <span className="font-bold text-pink-600 text-lg">{s.price}</span>
                    </button>
                  ))}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <h4 className="serif text-2xl mb-6 text-slate-800">Choose Appointment</h4>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] mb-3 font-bold text-pink-400">Preferred Date</label>
                    <input type="date" className="w-full border-2 border-slate-50 rounded-xl p-4 outline-none focus:border-pink-500 transition-all bg-slate-50/30 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] mb-3 font-bold text-pink-400">Available Slots</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'].map((t) => (
                        <button key={t} className="py-3 border-2 border-slate-50 rounded-xl text-[10px] font-bold uppercase tracking-tighter hover:bg-pink-500 hover:border-pink-500 hover:text-white transition-all active:scale-95">{t}</button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 space-y-3">
                    <button onClick={() => setStep(3)} className="w-full bg-pink-500 text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl shadow-pink-500/30 active:scale-95 transition-all">
                      Continue to Details
                    </button>
                    <button onClick={() => setStep(1)} className="w-full text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-pink-500 transition-colors">
                      Back to Selection
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center py-4">
                  <div className="w-24 h-24 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Sparkles size={48} className="animate-pulse" />
                  </div>
                  <h4 className="serif text-3xl text-slate-800">Final Confirmation</h4>
                  <p className="text-slate-400 text-sm font-light">Enter your contact profile to secure your session.</p>
                  <div className="space-y-3">
                    <input placeholder="Full Name" className="w-full border-2 border-slate-50 rounded-xl p-4 outline-none focus:border-pink-500 bg-slate-50/30 text-sm" />
                    <input placeholder="Personal Email" className="w-full border-2 border-slate-50 rounded-xl p-4 outline-none focus:border-pink-500 bg-slate-50/30 text-sm" />
                    <input placeholder="Mobile Number" className="w-full border-2 border-slate-50 rounded-xl p-4 outline-none focus:border-pink-500 bg-slate-50/30 text-sm" />
                  </div>
                  <button onClick={onClose} className="w-full bg-pink-500 text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl shadow-pink-500/30 active:scale-95 transition-all mt-6">
                    Confirm Reservation
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Footer: React.FC<{ setView: (v: View) => void }> = ({ setView }) => {
  return (
    <footer className="bg-white pt-24 pb-12 border-t border-pink-100">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setView('home'); window.scrollTo({top:0, behavior:'smooth'}); }}>
              <Sparkles className="w-8 h-8 text-pink-500" />
              <h1 className="text-2xl font-bold tracking-tighter serif text-slate-900">
                TA's <span className="font-light italic">Beauty Lounge</span>
              </h1>
            </div>
            <p className="text-slate-500 leading-relaxed text-sm font-light">
              Midrand's peaceful and stylish sanctuary where attention to detail and client comfort take center stage.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all text-pink-500 shadow-sm"><Facebook size={20} /></a>
              <a href="#" className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all text-pink-500 shadow-sm"><Instagram size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-pink-500">Quick Navigation</h4>
            <ul className="space-y-5 text-xs text-slate-500 font-bold uppercase tracking-widest">
              <li><button onClick={() => { setView('services'); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:text-pink-500 transition-colors">Treatment Menu</button></li>
              <li><button onClick={() => { setView('home'); setTimeout(() => document.getElementById('about')?.scrollIntoView({behavior:'smooth'}), 100); }} className="hover:text-pink-500 transition-colors">Our Story</button></li>
              <li><button onClick={() => { setView('home'); setTimeout(() => document.getElementById('location')?.scrollIntoView({behavior:'smooth'}), 100); }} className="hover:text-pink-500 transition-colors">Visit Midrand</button></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">Safety Standard</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-pink-500">Contact Boutique</h4>
            <ul className="space-y-6 text-xs text-slate-500">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-pink-400 shrink-0" />
                <span className="leading-relaxed">563 Seventh Road<br />Halfway Gardens, Midrand</span>
              </li>
              <li className="flex items-center gap-4">
                <Clock className="w-5 h-5 text-pink-400 shrink-0" />
                <span>Mon-Sat: 08:30 - 18:00<br />Sun: 09:00 - 14:00</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-pink-500">Updates</h4>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">Join our inner circle for seasonal promotions and Midrand event access.</p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="Exquisite Email"
                className="w-full bg-pink-50/40 border border-pink-100 rounded-full px-6 py-5 pr-14 text-xs outline-none focus:border-pink-500 transition-all placeholder:text-pink-300"
              />
              <button className="absolute right-2 top-2 w-11 h-11 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors shadow-lg shadow-pink-500/20 active:scale-90">
                <ChevronRight size={20} />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] text-slate-400 uppercase tracking-[0.3em] font-bold">
            © 2024 TA'S BEAUTY LOUNGE MIDRAND. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 text-[9px] text-slate-400 uppercase tracking-[0.3em] font-bold">
            <a href="#" className="hover:text-pink-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-pink-500 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');

  return (
    <div className="min-h-screen">
      <Header 
        onBookClick={() => setIsBookingOpen(true)} 
        currentView={currentView}
        setView={setCurrentView}
      />
      
      <main>
        <AnimatePresence mode="wait">
          {currentView === 'home' ? (
            <HomeView 
              key="home"
              onBookClick={() => setIsBookingOpen(true)}
              onViewServices={() => { setCurrentView('services'); window.scrollTo({top:0, behavior:'smooth'}); }}
            />
          ) : (
            <ServicesPage 
              key="services" 
              onBook={() => setIsBookingOpen(true)} 
            />
          )}
        </AnimatePresence>
      </main>

      <Footer setView={setCurrentView} />

      <AnimatePresence>
        {isBookingOpen && (
          <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
