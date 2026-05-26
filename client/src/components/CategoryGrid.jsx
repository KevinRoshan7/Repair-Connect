import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 'smartphone', name: 'Smartphone', system: 'SYSTEM', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop' },
  { id: 'laptop', name: 'Laptop', system: 'SYSTEM', img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600&auto=format&fit=crop' },
  { id: 'tv', name: 'TV & Display', system: 'SYSTEM', img: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=600&auto=format&fit=crop' },
  { id: 'fridge', name: 'Fridge', system: 'APPLIANCE', img: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcT07F5L7Su6yVhxaRnv6IHFpmV3NV5BHMyqHLzgl9EE3vUfqtX5j4tXYses03o4' },
  { id: 'ac', name: 'Air Conditioner', system: 'CLIMATE', img: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTS76SkrjoaJvfpFvNcQkJ7KXry0oqm28DYTH_X7Y9Jfl2XzqK0KZzOB9aD9Uhj' },
  { id: 'electrical', name: 'Electrical', system: 'INFRA', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=600&auto=format&fit=crop' },
  { id: 'plumbing', name: 'Plumbing', system: 'INFRA', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop' },
  { id: 'furniture', name: 'Furniture Assembly', system: 'LIVING', img: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=600&auto=format&fit=crop' },
  { id: 'smarthome', name: 'Smart Home', system: 'AUTOMATION', img: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=600&auto=format&fit=crop' }
];

export default function CategoryGrid() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-[#09090b] relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">SERVICE DIRECTORY</span>
          <h2 className="text-3xl font-bold text-zinc-50 tracking-tight">Engineering Verticals</h2>
        </div>

        {/* Dynamic Grid Engine */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/services/${cat.id}`)}
              className="group relative h-64 rounded-3xl overflow-hidden border border-zinc-900 bg-zinc-950 cursor-pointer transition-fluid hover:border-zinc-800 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)]"
            >
              {/* CLEAR, BRIGHT IMAGE LAYER */}
              <div className="absolute inset-0 z-0">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-all duration-500 ease-out brightness-[0.65] group-hover:brightness-[0.85] group-hover:scale-105 pointer-events-none"
                />
                {/* Subtle protective bottom gradient shielding so white text stays completely legible */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />
              </div>

              {/* CARD INTERACTION CONTENT */}
              <div className="absolute inset-0 z-10 p-6 flex flex-col justify-between">
                
                {/* Meta System Tag */}
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 group-hover:text-zinc-200 transition-colors">
                    {cat.system}
                  </span>
                </div>

                {/* Bottom Row Label Components */}
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-100 tracking-wide group-hover:text-white transition-all duration-300">
                      {cat.name}
                    </h3>
                  </div>
                  
                  {/* Premium Action Circular Trigger Arrow */}
                  <div className="w-10 h-10 rounded-full border border-zinc-800 bg-zinc-950/80 backdrop-blur-md text-zinc-200 flex items-center justify-center transition-fluid group-hover:border-zinc-100 group-hover:bg-zinc-100 group-hover:text-zinc-950 group-hover:rotate-45">
                    <ArrowUpRight size={16} strokeWidth={2.5} />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}