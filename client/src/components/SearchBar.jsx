import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [serviceQuery, setServiceQuery] = useState('');
  const navigate = useNavigate();

  const handleServiceSearch = () => {
    if (serviceQuery.trim()) {
      navigate(`/services?q=${encodeURIComponent(serviceQuery)}`);
    } else {
      navigate('/services');
    }
  };

  return (
    <div className="relative flex items-center w-full max-w-3xl bg-white rounded-full shadow-xl p-2 z-50">
      
      <input
        type="text"
        placeholder="What service do you need?"
        className="flex-1 px-8 text-sm font-medium outline-none bg-transparent"
        value={serviceQuery}
        onChange={(e) => setServiceQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleServiceSearch()}
      />

      <button
        onClick={handleServiceSearch}
        className="bg-blue-600 text-white p-4 rounded-full hover:bg-blue-700 shadow-md transition-colors flex-shrink-0"
      >
        <Search size={20} />
      </button>
    </div>
  );
}