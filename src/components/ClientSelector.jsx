import React, { useState, useEffect } from 'react';
import { Plus, X, Search, ChevronDown, Check } from 'lucide-react';
import ClientFormModal from './ClientFormModal';

const ClientSelector = ({ onSelect, currentClient }) => {
  const [clients, setClients] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      if (response.ok) {
        const result = await response.json();
        setClients(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleClientCreated = (createdClient) => {
    setClients([...clients, createdClient]);
    handleSelect(createdClient);
  };

  const handleSelect = (client) => {
    onSelect({
      name: client.name,
      address: client.address || '',
      ice: client.ice || '',
      if: client.if_id || '',
      taxePro: client.taxe_pro || '',
      phone: client.phone || ''
    });
    setIsOpen(false);
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-600 mb-1">Select Client</label>
      
      {/* Dropdown Trigger */}
      <div 
        className="w-full px-3 py-2 border border-slate-300 rounded cursor-pointer bg-white flex justify-between items-center hover:border-blue-400 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={currentClient.name ? 'text-slate-800' : 'text-slate-400'}>
          {currentClient.name || 'Select a client...'}
        </span>
        <ChevronDown size={16} className="text-slate-400" />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
          {/* Search */}
          <div className="p-2 sticky top-0 bg-white border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search clients..."
                className="w-full pl-8 pr-2 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* Add New Button */}
          <div 
            className="p-2 text-blue-600 hover:bg-blue-50 cursor-pointer flex items-center gap-2 text-sm font-medium border-b border-slate-100"
            onClick={() => {
              setIsOpen(false);
              setShowAddForm(true);
            }}
          >
            <Plus size={14} />
            Create New Client
          </div>

          {/* Client List */}
          <div className="py-1">
            {filteredClients.length === 0 ? (
              <div className="p-3 text-sm text-slate-400 text-center">No clients found</div>
            ) : (
              filteredClients.map(client => (
                <div
                  key={client.id}
                  className="px-3 py-2 hover:bg-slate-50 cursor-pointer flex justify-between items-center group"
                  onClick={() => handleSelect(client)}
                >
                  <div>
                    <div className="text-sm font-medium text-slate-800">{client.name}</div>
                    {(client.ice || client.phone) && (
                      <div className="text-xs text-slate-500 flex gap-2">
                        {client.ice && <span>ICE: {client.ice}</span>}
                        {client.phone && <span>Tel: {client.phone}</span>}
                      </div>
                    )}
                  </div>
                  {currentClient.name === client.name && (
                    <Check size={14} className="text-blue-600" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddForm && (
        <ClientFormModal 
            onClose={() => setShowAddForm(false)} 
            onSuccess={handleClientCreated} 
        />
      )}
    </div>
  );
};

export default ClientSelector;

