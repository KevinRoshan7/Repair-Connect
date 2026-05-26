import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search, ShieldCheck, Star, Clock, AlertCircle } from 'lucide-react';

import BookingModal from './BookingModal';
import { supabase } from '../supabase';

const multiServiceCatalog = [
  { id: 'sp-1', title: 'OLED Display Matrix Restoration', category: 'smartphone', price: '₹4,499', speed: '2 Hour Cycle', rating: '4.9', description: 'Advanced structural replacement of premium OLED panels with full digitizer integration and true-tone calibration.' },
  { id: 'sp-2', title: 'Logic Board Micro-Soldering & IC Repair', category: 'smartphone', price: '₹5,800', speed: 'Same Day', rating: '4.8', description: 'Precision multi-layer mainboard diagnostics targeting surface mount capacitors and localized trace micro-soldering.' },

  { id: 'lt-1', title: 'Liquid Cooling Thermal Repaste & Dust Purge', category: 'laptop', price: '₹2,499', speed: '3 Hour Cycle', rating: '5.0', description: 'Deep architecture cleaning paired with premium non-conductive thermal interface material deployment for optimized TDP.' },
  { id: 'lt-2', title: 'NVMe Architecture Storage & RAM Multiplexing', category: 'laptop', price: '₹1,899', speed: '60 Mins', rating: '4.7', description: 'High-speed solid-state logic array integration with comprehensive block-level operating system migration data handling.' },

  { id: 'tv-1', title: '4K/8K Backlight Array Array Refactoring', category: 'tv', price: '₹6,500', speed: '24-48 Hours', rating: '4.8', description: 'Full-grid diagnostic testing and module level replacement of structural LED backlighting nodes for luminance uniformity.' },
  { id: 'tv-2', title: 'Main Logic Board Firmware & Port Remediation', category: 'tv', price: '₹3,999', speed: 'Same Day', rating: '4.6', description: 'Remediation of digital signal interfaces including dynamic HDMI 2.1 bus routing channels and central software refleshing.' },
];

export default function ServiceMarketplace() {
  const { id } = useParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // NEW
  const [user, setUser] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // NEW
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    fetchUser();
  }, []);

  const activeCategoryKey = id
    ? id.toLowerCase().replace(/[^a-z]/g, '')
    : '';

  const filteredServices = multiServiceCatalog.filter(service => {
    const normalizedServiceCat = service.category.toLowerCase();

    const matchesCategory = activeCategoryKey
      ? normalizedServiceCat === activeCategoryKey
      : true;

    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleInitializeBooking = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#09090b] text-zinc-100 pt-32 pb-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-zinc-900 pb-8 relative z-10">
          <div>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-[0.25em] block mb-2.5">
              OPERATIONAL HUB / {id ? id.toUpperCase() : 'ALL CONFIGURATIONS'}
            </span>

            <h1 className="text-3xl sm:text-4xl font-black text-zinc-50 tracking-tight capitalize">
              {id ? `${id} Deployments` : 'Engineering Framework Catalog'}
            </h1>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />

            <input
              type="text"
              placeholder="Query active diagnostics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700 transition-colors placeholder:text-zinc-600 font-medium"
            />
          </div>
        </div>

        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">

            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="group relative bg-[#0d0d11]/40 border border-zinc-900/80 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-zinc-800/80 hover:bg-[#0d0d11]/80 hover:translate-y-[-2px]"
              >

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase bg-zinc-900 px-3 py-1 rounded-md border border-zinc-800/50">
                      {service.category}
                    </span>

                    <div className="flex items-center gap-1 text-xs font-bold text-blue-500 bg-blue-950/20 px-2 py-0.5 rounded-md border border-blue-900/30">
                      <Star size={12} className="fill-blue-500 stroke-blue-500" />
                      {service.rating}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-100 group-hover:text-white transition-colors mb-2.5 tracking-tight">
                    {service.title}
                  </h3>

                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                    {service.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-4 text-xs text-zinc-500 mb-6 font-semibold border-t border-zinc-900/40 pt-4">
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-zinc-600" />
                      {service.speed}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-zinc-600" />
                      OEM Standards
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-zinc-900/80">
                    <div>
                      <span className="text-[9px] font-black text-zinc-500 block uppercase tracking-wider">
                        ESTIMATED COST
                      </span>

                      <span className="text-xl font-black text-zinc-100 tracking-tight">
                        {service.price}
                      </span>
                    </div>

                    <button
                      onClick={() => handleInitializeBooking(service)}
                      className="bg-zinc-100 text-zinc-950 font-black text-xs px-4 py-2.5 rounded-xl hover:bg-white active:scale-95 transition-all shadow-sm"
                    >
                      Initialize Booking
                    </button>
                  </div>
                </div>

              </div>
            ))}

          </div>
        ) : (
          <div className="text-center py-24 rounded-2xl border border-dashed border-zinc-900 bg-zinc-950/20 flex flex-col items-center justify-center max-w-xl mx-auto mt-12">
            <AlertCircle className="text-zinc-700 mb-3 w-8 h-8 stroke-[1.5]" />

            <h3 className="text-zinc-300 font-bold text-base mb-1">
              No Operations Mounted
            </h3>

            <p className="text-zinc-500 text-xs sm:text-sm font-medium px-6">
              The vertical parameters or search phrase entered do not sync with our active field service manifests.
            </p>
          </div>
        )}

      </div>

      {isModalOpen && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          service={selectedService}
          user={user}
        />
      )}
    </div>
  );
}