import React, { useState, useEffect } from 'react';
import { User, Menu, X, ShoppingCart, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import useStore from '../store/useStore';
import { supabase } from '../supabase';
import BecomePartnerModal from './BecomePartnerModal'; // 🔥 Integrated brand-new modal connection

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileName, setProfileName] = useState('PROFILE');
  const [partnerModalOpen, setPartnerModalOpen] = useState(false); // 🔥 Toggles the form popup open/closed
  
  const cart = useStore((state) => state.cart);
  const user = useStore((state) => state.user);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) {
            console.error("Header profile fetch error:", error);
          }

          if (data?.full_name) {
            setProfileName(data.full_name.split(' ')[0].toUpperCase());
          } else {
            const googleName = user?.user_metadata?.full_name || user?.user_metadata?.name;
            if (googleName) {
              setProfileName(googleName.split(' ')[0].toUpperCase());
            } else {
              setProfileName('USER');
            }
          }
        });
    } else {
      setProfileName('LOGIN / SIGN UP');
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      supabase.from('profiles').select('role').eq('id', user.id).single()
        .then(({ data }) => {
          if (data) setRole(data.role);
        });
    } else {
      setRole(null);
    }
  }, [user]);

  const navLinks = role === 'partner' 
    ? [
        { name: 'Home', path: '/' },
        { name: 'Partner Dashboard', path: '/dashboard' }
      ]
    : [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'How It Works', path: '/#how-it-works' }, 
        { name: 'About Us', path: '/#about' }, 
      ];

  return (
    <>
      <header 
        className={`fixed top-6 left-0 right-0 z-[999] px-4 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? 'translate-y-0' : '-translate-y-[150%]'
        }`}
      >
        <nav 
          className={`max-w-5xl mx-auto flex items-center justify-between px-8 py-3 rounded-full transition-all duration-300 ${
            isScrolled 
              ? 'glass-panel bg-zinc-950/80 backdrop-blur-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] py-2.5 scale-[0.98]' 
              : 'glass-panel bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 w-full'
          }`}
        >
          {/* LOGO & PARTNER BADGE */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center transition-opacity hover:opacity-90">
              <img src={logo} alt="RepairConnect" className="h-8 w-auto brightness-125 contrast-125" />
            </Link>
            
            {role === 'partner' && (
              <span className="hidden md:flex bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full items-center">
                Partner Portal
              </span>
            )}
          </div>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <Link 
                key={index} 
                to={link.path} 
                className="text-[11px] font-bold text-zinc-300 hover:text-zinc-50 transition-colors duration-200 uppercase tracking-[0.2em]"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-5">
            {/* 🔥 Desktop Become a Partner Button (Hidden if they are already logged in as a partner) */}
            {role !== 'partner' && (
              <button 
                onClick={() => setPartnerModalOpen(true)}
                className="hidden md:block text-[10px] font-bold text-zinc-400 hover:text-zinc-50 border border-zinc-800 hover:border-zinc-500 px-4 py-2.5 rounded-full transition-all duration-200 tracking-wider uppercase font-mono"
              >
                Become a Partner
              </button>
            )}

            {/* Desktop Cart Icon */}
            {role !== 'partner' && (
              <Link to="/cart" className="relative text-zinc-300 hover:text-zinc-50 transition-colors duration-200 hidden md:block p-1">
                <ShoppingCart size={18} strokeWidth={2.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-zinc-100 text-zinc-950 text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

          {/* Desktop Profile Action */}
          <Link to={user ? "/dashboard" : "/login"} className="hidden md:block">
            <button className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 transform active:scale-95 shadow-lg shadow-black/20">
              <User size={13} strokeWidth={2.5} /> 
              {user ? profileName : 'LOGIN / SIGN UP'}
            </button>
          </Link>
          
          {/* MOBILE TOGGLE CONTROLS */}
          <div className="md:hidden flex items-center gap-4">
            {role !== 'partner' && (
              <Link to="/cart" className="relative text-zinc-300 p-1">
                <ShoppingCart size={18} strokeWidth={2.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-zinc-100 text-zinc-950 text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-zinc-300 p-1 hover:text-zinc-50 transition-colors"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </nav>

        {/* MOBILE DROP MENU LAYER */}
        {mobileMenuOpen && (
          <div className="absolute top-20 left-4 right-4 bg-zinc-950/95 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl md:hidden flex flex-col gap-6 items-center border border-zinc-800/80 animate-in fade-in slide-in-from-top-4 duration-200">
            {navLinks.map((link, index) => (
              <Link 
                key={index} 
                to={link.path} 
                onClick={() => setMobileMenuOpen(false)} 
                className="text-xs font-bold text-zinc-300 hover:text-zinc-50 uppercase tracking-widest"
              >
                {link.name}
              </Link>
            ))}

            {/* 🔥 Mobile Become a Partner Button */}
            {role !== 'partner' && (
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setPartnerModalOpen(true);
                }}
                className="w-full max-w-[240px] flex items-center justify-center gap-2 border border-zinc-700 text-zinc-300 hover:text-zinc-150 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest font-mono"
              >
                <Briefcase size={13} />
                Become a Partner
              </button>
            )}

            <Link to={user ? "/dashboard" : "/login"} onClick={() => setMobileMenuOpen(false)} className="w-full max-w-[240px]">
              <button className="w-full flex items-center justify-center gap-2 bg-zinc-100 text-zinc-950 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest">
                <User size={13} strokeWidth={2.5} />
                {user ? profileName : 'LOGIN / SIGN UP'}
              </button>
            </Link>
          </div>
        )}
      </header>

      {/* 🔥 Render target overlay backdrop portals outside navbar layout bounds */}
      <BecomePartnerModal 
        user={user} 
        isOpen={partnerModalOpen} 
        onClose={() => setPartnerModalOpen(false)} 
      />
    </>
  );
}