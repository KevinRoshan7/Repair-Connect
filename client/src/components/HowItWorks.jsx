import React, { useState, useEffect, useRef } from 'react';
import { Search, Cpu, Sparkles, ShieldCheck } from 'lucide-react';

const steps = [
  { id: 1, title: 'Scan Diagnostics', desc: 'Initialize automated platform scanning to isolate system vulnerabilities and hardware anomalies.', icon: Search },
  { id: 2, title: 'Analyze Analytics', desc: 'Process metrics using intelligent engineering valuation nodes to determine precise repair paths.', icon: Cpu },
  { id: 3, title: 'Deploy Logistics', desc: 'Schedule verified diagnostic specialists for precise, dedicated hardware restoration cycles.', icon: Sparkles },
  { id: 4, title: 'Secure Integration', desc: 'System integration verified through deep benchmark verification routines before client release.', icon: ShieldCheck },
];

export default function HowItWorks() {
  const [revealProgress, setRevealProgress] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      const sectionTop = sectionRef.current.offsetTop;
      
      const triggerPoint = sectionTop - windowHeight * 1.2; // Trigger earlier for rapid scrolling safety
      if (scrollPos > triggerPoint) {
        const progress = (scrollPos - triggerPoint) / windowHeight;
        setRevealProgress(Math.min(Math.max(progress, 0), 1));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      id="how-it-works" 
      ref={sectionRef}
      className="py-32 relative bg-[#09090b] overflow-hidden transition-all duration-700 ease-out"
      style={{
        transform: `translateY(${(1 - revealProgress) * 30}px)`,
        opacity: revealProgress > 0.05 ? 1 : revealProgress * 20,
      }}
    >
      {/* 🚀 NEW: Ambient Glow Matrix layer to bring brightness and depth into the dark backdrop */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-zinc-700/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-12 left-10 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Background Decorative Grid Textures */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_50%,transparent_100%)] opacity-25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 z-10">
        
        {/* Header Block Section */}
        <div className={`text-center mb-24 transition-all duration-1000 ${revealProgress > 0.1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
            OPERATIONAL ARCHITECTURE
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
            How It Works
          </h2>
        </div>

        <div className="relative">
          {/* High-Contrast Connecting Flow Line */}
          <div className="hidden md:block absolute top-[2.5rem] left-[12.5%] right-[12.5%] h-[1px] -z-10 overflow-hidden">
            <div 
              className="w-full h-full border-t border-dashed border-zinc-700 transition-all duration-[1200ms]"
              style={{ transform: `translateX(${(revealProgress - 1) * 100}%)` }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className="flex flex-col items-center text-center group p-6 rounded-3xl border border-zinc-900/60 bg-zinc-950/40 backdrop-blur-sm transition-all hover:bg-zinc-900/30"
                style={{ 
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${index * 80}ms`,
                  opacity: revealProgress > 0.15 ? 1 : 0,
                  transform: revealProgress > 0.15 ? 'translateY(0)' : 'translateY(25px)'
                }}
              >
                {/* Structural Index Number Badge */}
                <div className="w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 font-bold text-[11px] flex items-center justify-center mb-6 shadow-md group-hover:border-zinc-400 group-hover:text-white transition-colors duration-300">
                  0{step.id}
                </div>

                {/* 🚀 NEW: High Contrast Border Card Box containing the step icons */}
                <div className="w-20 h-20 bg-zinc-900/60 border border-zinc-800 rounded-2xl shadow-xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:border-zinc-100 group-hover:bg-zinc-900 group-hover:shadow-zinc-100/5">
                  <step.icon 
                    size={26} 
                    strokeWidth={1.75} 
                    className="text-zinc-400 group-hover:text-white group-hover:scale-110 transition-all duration-300" 
                  />
                </div>

                {/* Content Descriptions */}
                <h3 className="text-base font-bold text-zinc-100 mb-2.5 tracking-wide group-hover:text-white transition-colors">
                  {step.name || step.title}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed px-1 font-medium max-w-[240px] group-hover:text-zinc-300 transition-colors">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}