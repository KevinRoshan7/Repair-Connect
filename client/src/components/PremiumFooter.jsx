import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, Smartphone, Laptop, Fan, Cpu, Globe, Share2 } from 'lucide-react';

export default function PremiumFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#09090b] border-t border-zinc-900 pt-16 pb-8 relative overflow-hidden">
      {/* Ambient decorative layout glow backdrop */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[150px] bg-zinc-800/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          
          {/* BRAND IDENTITY COLUMN */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-zinc-50 font-black text-xl tracking-wider">
              <Shield className="text-zinc-100 w-6 h-6 stroke-[2.5]" />
              REPAIRCONNECT
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm font-medium">
              Next-generation engineering platforms optimizing consumer hardware diagnostics, modular restoration cycles, and certified technical device logistics.
            </p>
          </div>

          {/* SERVICES LINK COLUMN */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="text-zinc-50 text-xs font-black uppercase tracking-[0.2em]">Engineering Verticals</h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium">
              <li>
                <Link to="/services/smartphone" className="text-zinc-400 hover:text-zinc-100 flex items-center gap-2 transition-colors">
                  <Smartphone size={14} className="text-zinc-500" /> Smartphone Engineering
                </Link>
              </li>
              <li>
                <Link to="/services/laptop" className="text-zinc-400 hover:text-zinc-100 flex items-center gap-2 transition-colors">
                  <Laptop size={14} className="text-zinc-500" /> Architecture & Compute
                </Link>
              </li>
              <li>
                <Link to="/services/ac" className="text-zinc-400 hover:text-zinc-100 flex items-center gap-2 transition-colors">
                  <Fan size={14} className="text-zinc-500" /> Climate Control Systems
                </Link>
              </li>
              <li>
                <Link to="/services/smarthome" className="text-zinc-400 hover:text-zinc-100 flex items-center gap-2 transition-colors">
                  <Cpu size={14} className="text-zinc-500" /> Automation Nodes (IoT)
                </Link>
              </li>
            </ul>
          </div>

          {/* FRAMEWORK LINK COLUMN - SECURITY PROTOCOLS LINK DELETED */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="text-zinc-50 text-xs font-black uppercase tracking-[0.2em]">Framework</h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium">
              <li><Link to="/#about" className="text-zinc-400 hover:text-zinc-100 transition-colors">About Directory</Link></li>
              <li><Link to="/#how-it-works" className="text-zinc-400 hover:text-zinc-100 transition-colors">Architecture</Link></li>
              <li><Link to="/services" className="text-zinc-400 hover:text-zinc-100 transition-colors">Deployments</Link></li>
            </ul>
          </div>

          {/* COMMUNICATIONS CHANNELS COLUMN */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="text-zinc-50 text-xs font-black uppercase tracking-[0.2em]">Communications</h4>
            <ul className="flex flex-col gap-3 text-xs sm:text-sm font-medium">
              <li>
                <a href="mailto:support@repairconnect.com" className="text-zinc-400 hover:text-zinc-100 flex items-center gap-2.5 transition-colors">
                  <Mail size={15} className="text-zinc-500" /> support@repairconnect.com
                </a>
              </li>
              <li>
                <a href="tel:1800-REPAIR-NOW" className="text-zinc-400 hover:text-zinc-100 flex items-center gap-2.5 transition-colors">
                  <Phone size={15} className="text-zinc-500" /> 1800-REPAIR-NOW
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* METADATA BAR FOOTNOTE */}
        <div className="border-t border-zinc-900/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-medium text-zinc-500 tracking-wide">
            &copy; {currentYear} REPAIRCONNECT PLATFORM. ALL RIGHTS RESERVED.
          </p>
          
          <div className="flex items-center gap-6 text-zinc-600">
            <Globe size={14} className="hover:text-zinc-400 cursor-pointer transition-colors" />
            <Share2 size={14} className="hover:text-zinc-400 cursor-pointer transition-colors" />
          </div>

          <p className="text-[11px] font-black tracking-[0.15em] text-zinc-400 uppercase">
            DEVELOPED BY <span className="text-zinc-100 border-b border-zinc-700 pb-0.5">KEVIN ROSHAN</span>
          </p>
        </div>

      </div>
    </footer>
  );
}