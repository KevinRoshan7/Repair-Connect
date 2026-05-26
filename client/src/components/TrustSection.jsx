import React from 'react';
import { ShieldCheck, Zap, Award, Navigation, Activity } from 'lucide-react';

const valueProps = [
  {
    icon: ShieldCheck,
    title: '100% Certified Components',
    desc: 'Zero tolerance for substandard hardware. Only strict OEM components and certified enterprise-grade spares clear our supply lines.',
    glow: 'group-hover:text-emerald-400'
  },
  {
    icon: Zap,
    title: 'Rapid Deployment Nodes',
    desc: 'Real-time routing engines pair your diagnostic log with specialists instantly to ensure same-day local arrival windows.',
    glow: 'group-hover:text-amber-400'
  },
  {
    icon: Award,
    title: 'Extended Bench Warranty',
    desc: 'Every micro-soldering operation and modular replacement cycle is backed by our full 90-day comprehensive service guarantee.',
    glow: 'group-hover:text-blue-400'
  },
  {
    icon: Navigation,
    title: 'Telemetry & Live Tracking',
    desc: 'Monitor your component repair stages from dispatch to structural quality testing via live encrypted tracking streams.',
    glow: 'group-hover:text-purple-400'
  }
];

export default function TrustSection() {
  return (
    <section id="about" className="py-24 bg-[#09090b] relative overflow-hidden">
      
      {/* Decorative Cyber Radial Overlay */}
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-zinc-900/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* LEFT COLUMN: THE NEW GOLD STANDARD BLOCK */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-zinc-400 w-fit mb-6">
              <Activity size={12} className="text-zinc-500 animate-pulse" />
              Operational Integrity
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-zinc-50 leading-[1.15] tracking-tight mb-6">
              The Blueprint for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600">
                Modern Hardware.
              </span>
            </h2>
            
            <p className="text-sm lg:text-base text-zinc-400 font-medium leading-relaxed max-w-md">
              We engineered a system built on speed, verifiable quality components, and transparent logistics pipelines. Your hardware stays secure from scan to bench delivery.
            </p>
          </div>

          {/* RIGHT COLUMN: HIGH-CONTRAST GRID DYNAMICS */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {valueProps.map((prop, index) => {
              const IconComponent = prop.icon;
              return (
                <div 
                  key={index}
                  className="group relative p-6 rounded-3xl border border-zinc-900 bg-zinc-950/50 backdrop-blur-md transition-fluid hover:border-zinc-800 hover:bg-zinc-950 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]"
                >
                  {/* Subtle Top Accent Glow Line */}
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Animated Icon Housing */}
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900/80 border border-zinc-800/60 flex items-center justify-center mb-5 transition-all duration-300 group-hover:border-zinc-700 group-hover:bg-zinc-900">
                    <IconComponent 
                      size={20} 
                      strokeWidth={2} 
                      className={`text-zinc-400 transition-colors duration-300 ${prop.glow}`} 
                    />
                  </div>

                  {/* Text Nodes */}
                  <h3 className="text-base font-bold text-zinc-100 mb-2 tracking-wide group-hover:text-zinc-50 transition-colors">
                    {prop.title}
                  </h3>
                  
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-medium">
                    {prop.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}