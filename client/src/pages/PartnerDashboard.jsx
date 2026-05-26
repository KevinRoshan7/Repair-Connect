import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import useStore from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Briefcase, CheckCircle, Clock, MapPin, Wrench, LogOut } from 'lucide-react';

export default function PartnerDashboard() {
  const { user } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('available'); // 'available', 'active', 'history'
  const [orders, setOrders] = useState([]);
  const [profileName, setProfileName] = useState('Partner');

  useEffect(() => {
    if (!user) return navigate('/login');
    
    supabase.from('profiles').select('full_name').eq('id', user.id).single()
      .then(({ data }) => { if (data?.full_name) setProfileName(data.full_name); });

    fetchOrders();
  }, [user, navigate, activeTab]);

  const fetchOrders = async () => {
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    
    if (activeTab === 'available') {
      query = query.eq('status', 'Pending').is('partner_id', null);
    } else if (activeTab === 'active') {
      query = query.eq('partner_id', user.id).in('status', ['Assigned', 'In Progress']);
    } else {
      query = query.eq('partner_id', user.id).eq('status', 'Completed');
    }

    const { data } = await query;
    setOrders(data || []);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const updates = { status: newStatus };
    if (newStatus === 'Assigned') updates.partner_id = user.id;

    const { error } = await supabase.from('orders').update(updates).eq('id', orderId);
    if (!error) fetchOrders();
    else alert('Error updating operational log: ' + error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#09090b] pt-32 pb-24 px-6 text-zinc-100">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* OPERATIONAL NAVIGATION SIDEBAR */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="glass-panel rounded-3xl p-6 sticky top-32 border-zinc-800/60">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-brand-accent">
                <Briefcase size={20} />
              </div>
              <div>
                <h2 className="text-sm font-bold truncate">{profileName}</h2>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Technician Portal</p>
              </div>
            </div>

            <nav className="space-y-2">
              {[
                { id: 'available', icon: Clock, label: 'Job Marketplace' },
                { id: 'active', icon: Wrench, label: 'My Active Runs' },
                { id: 'history', icon: CheckCircle, label: 'Work History' }
              ].map(item => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveTab(item.id)} 
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-fluid text-xs font-bold uppercase tracking-widest ${activeTab === item.id ? 'bg-brand-accent text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
                >
                  <item.icon size={16} /> {item.label}
                </button>
              ))}
            </nav>

            <button 
              onClick={handleLogout} 
              className="mt-8 w-full flex items-center gap-3 p-3 rounded-xl text-zinc-500 hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-widest"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </aside>

        {/* OPERATIONS GRID MONITOR */}
        <section className="flex-1">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-zinc-50 tracking-tight">
              {activeTab === 'available' ? 'Open Ticket Matrix' : activeTab === 'active' ? 'Active Diagnostics' : 'Dispatched Archives'}
            </h1>
          </div>

          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="glass-panel rounded-3xl p-16 text-center border-dashed border-zinc-800">
                <p className="text-zinc-500 text-sm">No dispatched requests found in this matrix tier.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div 
                  key={order.id} 
                  className="glass-panel rounded-2xl p-6 border-zinc-800/60 hover:border-zinc-700 transition-fluid"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4 pb-4 border-b border-zinc-800/50">
                    <div>
                      <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest block mb-1">
                        Ticket UUID: {order.id.slice(0, 8)}
                      </span>
                      <h3 className="text-lg font-semibold text-zinc-200 tracking-tight mb-2">
                        {order.items?.[0]?.title || 'Hardware Diagnostic Deployment'}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <Clock size={14} className="text-brand-accent" />
                        <span>{order.scheduled_date}</span>
                        <span className="text-zinc-700">•</span>
                        <span>{order.scheduled_time}</span>
                      </div>
                    </div>
                    
                    <div className="sm:text-right flex sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-2">
                      <p className="text-xl font-bold text-zinc-50 tracking-tight">₹{order.total_amount}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'Pending' 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                    <div className="flex items-center gap-2 text-xs text-zinc-400 max-w-md">
                      <MapPin size={14} className="text-zinc-600 shrink-0" />
                      <span className="truncate">{order.service_address}</span>
                    </div>

                    {/* DYNAMIC ACTION TRIGGER ENGINES */}
                    <div className="w-full sm:w-auto shrink-0">
                      {activeTab === 'available' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'Assigned')} 
                          className="w-full sm:w-auto bg-zinc-100 text-zinc-950 px-5 py-2 rounded-xl font-bold uppercase text-[11px] tracking-wider hover:bg-zinc-200 transition-fluid active:scale-95"
                        >
                          Accept Ticket
                        </button>
                      )}
                      {activeTab === 'active' && order.status === 'Assigned' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'In Progress')} 
                          className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2 rounded-xl font-bold uppercase text-[11px] tracking-wider hover:bg-blue-500 transition-fluid active:scale-95 shadow-md shadow-blue-900/20"
                        >
                          Initialize Repair
                        </button>
                      )}
                      {activeTab === 'active' && order.status === 'In Progress' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'Completed')} 
                          className="w-full sm:w-auto bg-emerald-600 text-white px-5 py-2 rounded-xl font-bold uppercase text-[11px] tracking-wider hover:bg-emerald-500 transition-fluid active:scale-95 shadow-md shadow-emerald-900/20"
                        >
                          Finalize Completion
                        </button>
                      )}
                    </div>
                  </div>
                  
                </div>
              ))
            )}
          </div>
        </section>
        
      </div>
    </div>
  );
}