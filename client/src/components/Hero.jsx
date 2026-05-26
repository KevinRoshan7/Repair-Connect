import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import heroBg from '../assets/heropage.png';

export default function Hero() {
  return (
    <section className="relative pt-36 pb-24 lg:pt-52 lg:pb-40 overflow-hidden bg-[#09090b] min-h-[90vh] flex items-center">
      
      {/* CINEMATIC BACKDROP PICTURE IMAGE LAYER */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Technical Workspace Background" 
          /* 💡 Boosted opacity to 65% and removed luminosity blend so the image is fully visible */
          className="w-full h-full object-cover opacity-65 scale-105 pointer-events-none"
        />
        {/* 💡 Lightened the gradient shades (dropped down to 60% on the left, completely clear on the right) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/90 via-[#09090b]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/70 via-transparent to-[#09090b]/30" />
      </div>

      {/* CINEMATIC LOGO WATERMARK — left-anchored, deep in the scene */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <img
          src={logo}
          alt=""
          aria-hidden="true"
          className="absolute left-[-6%] top-1/2 -translate-y-1/2 w-[520px] lg:w-[680px] opacity-[0.04] mix-blend-screen brightness-200 contrast-50 blur-[1px] select-none"
        />
        {/* Radial fade so the watermark dissolves smoothly */}
        <div className="absolute left-0 top-0 h-full w-[55%] bg-gradient-to-r from-[#09090b]/0 via-transparent to-[#09090b]" />
        <div className="absolute left-0 top-0 h-full w-[55%] bg-[radial-gradient(ellipse_at_20%_50%,transparent_30%,#09090b_75%)]" />
      </div>

      {/* Premium ambient backdrop glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-zinc-700/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10 w-full">
        <div className="w-full lg:w-[65%] flex flex-col justify-center">
          
          {/* 🚀 BRAND RE-IDENTITY MATURED: Swapped in RepairConnect */}
          <div className="inline-flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-zinc-400 w-fit mb-6">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            REPAIRCONNECT // AI-POWERED DIAGNOSTICS
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-zinc-50 leading-[1.15] tracking-tight mb-6">
            Precision Engineering. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-500">
              Seamless Repairs.
            </span>
          </h1>
          
          <p className="text-sm sm:text-base lg:text-lg text-zinc-400 font-medium mb-10 max-w-lg leading-relaxed">
            Instantly diagnose complex hardware anomalies through intelligent evaluation models. Schedule on-demand deployments with certified technical engineers for precision restoration.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link 
              to="/services" 
              className="bg-zinc-100 text-zinc-950 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-all duration-300 shadow-xl active:scale-95"
            >
              Book a Service
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}