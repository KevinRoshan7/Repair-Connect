import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import useStore from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Clock,
  LogOut,
  Calendar,
  CheckCircle,
  XCircle,
  Wrench
} from 'lucide-react';

import PartnerDashboard from './PartnerDashboard';

// 🚀 Dynamically pull local or production API endpoint directly from .env configuration profile
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const { user } = useStore();
  const [role, setRole] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [profileName, setProfileName] = useState('Customer');

  /* =========================================================
      INITIALIZE DASHBOARD
  ========================================================= */
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          navigate('/login');
          return;
        }

        /* =========================================
            FETCH PROFILE
        ========================================= */
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile) {
          setRole(profile.role || 'customer');
          if (profile.full_name) {
            setProfileName(profile.full_name);
          }
        }

        /* =========================================
            FETCH ORDERS FROM BACKEND
        ========================================= */
        const response = await fetch(
          `${API_URL}/api/orders?user_id=${session.user.id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        
        // Backend order.js directly returns the data array now!
        if (Array.isArray(result)) {
          setOrders(result);
        } else if (result.success && Array.isArray(result.bookings)) {
          setOrders(result.bookings);
        } else {
          setOrders([]);
        }

      } catch (error) {
        console.error('Dashboard Initialization Error:', error);
      } finally {
        setAuthChecking(false);
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, [navigate]);

  /* =========================================================
      LOGOUT
  ========================================================= */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  /* =========================================================
      FILTER ORDERS BY BOOKING DATE
  ========================================================= */
  const today = new Date().toISOString().split('T')[0];

  const filteredOrders = orders.filter((o) => {
    // 🛡️ FIXED: Remapped from scheduled_date to booking_date
    const orderDate = o.booking_date
      ? o.booking_date.split('T')[0]
      : today;

    return activeTab === 'active'
      ? orderDate >= today
      : orderDate < today;
  });

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white">
        Initializing Dashboard Platform Matrix...
      </div>
    );
  }

  if (role === 'partner') {
    return <PartnerDashboard />;
  }

  return (
    <div className="min-h-screen bg-[#09090b] pt-32 pb-24 px-6 text-zinc-100">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* =========================================
            SIDEBAR
        ========================================= */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="glass-panel rounded-3xl p-6 border border-zinc-800/60 bg-zinc-900/20 backdrop-blur-md">
            <h2 className="text-sm font-bold tracking-wide text-zinc-400">AUTHORIZED ACCOUNT</h2>
            <p className="text-lg font-extrabold mt-1 text-white">{profileName}</p>

            <nav className="mt-8 space-y-2">
              {[
                { id: 'active', icon: Package, label: 'Active Repairs' },
                { id: 'history', icon: Clock, label: 'History Archive' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-medium text-sm ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              ))}

              <button
                onClick={handleLogout}
                className="mt-8 w-full text-zinc-500 hover:text-red-400 uppercase text-xs font-bold tracking-widest flex items-center justify-start p-3 transition-colors"
              >
                <LogOut size={16} className="inline mr-2" />
                Sign Out
              </button>
            </nav>
          </div>
        </aside>

        {/* =========================================
            MAIN CONTENT
        ========================================= */}
        <section className="flex-1">
          <h1 className="text-2xl font-extrabold tracking-tight mb-8">
            {activeTab === 'active'
              ? 'Active Diagnostic Sessions'
              : 'Repair History Logs'}
          </h1>

          {isLoading ? (
            <p className="text-zinc-400 animate-pulse">Fetching systemic order streams...</p>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl">
              <p className="text-zinc-500 text-sm">No recorded diagnostic deployment traces found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="glass-panel p-6 rounded-2xl border border-zinc-800 bg-zinc-900/10 hover:border-zinc-700 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Wrench size={16} className="text-blue-500" />
                        <p className="font-bold text-lg text-white">
                          {order.service_title || "Hardware Architecture Repair"}
                        </p>
                      </div>

                      <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-zinc-800 text-blue-400 font-mono">
                        {order.category || "General Logic"}
                      </span>

                      <p className="text-xs text-zinc-400 mt-4 flex items-center gap-2">
                        <span className="font-semibold text-zinc-500">ADDRESS:</span> {order.address || "No Address Declared"}
                      </p>

                      <p className="text-sm text-zinc-400 mt-2">
                        <Calendar size={14} className="inline mr-2 text-zinc-500" />
                        {order.booking_date
                          ? new Date(order.booking_date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric"
                            })
                          : 'Date trace unassigned'}
                      </p>
                    </div>

                    <div className="text-right flex flex-col items-end justify-between min-h-[100px]">
                      {/* Status Tag Matrix Check */}
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          order.status === 'completed'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : order.status === 'cancelled'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}
                      >
                        {order.status === 'completed' ? (
                          <CheckCircle size={12} />
                        ) : order.status === 'cancelled' ? (
                          <XCircle size={12} />
                        ) : (
                          <Clock size={12} />
                        )}
                        {order.status || 'allocated'}
                      </div>

                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                          Invoice Settlement
                        </p>
                        <p className="font-black text-xl text-white mt-0.5">
                          ₹{(order.price || 0).toLocaleString('en-IN')}
                        </p>
                        <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded mt-1 inline-block">
                          {order.payment_status || 'PAID via Razorpay'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}