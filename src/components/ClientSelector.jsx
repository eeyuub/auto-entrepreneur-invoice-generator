import React, { useState, useEffect } from 'react';
import { Plus, X, Search, ChevronDown, Check } from 'lucide-react';

const ClientSelector = ({ onSelect, currentClient }) => {
  const [clients, setClients] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New Client Form State
  const [newClient, setNewClient] = useState({
    name: '',
    address: '',
    ice: '',
    if_id: '',
    taxe_pro: '',
    phone: ''
  });

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

  const handleCreateClient = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      });
      
      if (response.ok) {
        const result = await response.json();
        const createdClient = result.data;
        setClients([...clients, createdClient]);
        handleSelect(createdClient);
        setShowAddForm(false);
        setNewClient({ name: '', address: '', ice: '', if_id: '', taxe_pro: '', phone: '' });
      }
    } catch (error) {
      alert('Failed to create client');
    }
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Add New Client</h3>
              <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateClient} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Client Name / Company <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  className="input-field"
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  placeholder="Ex: Société X SARL"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Phone</label>
                    <input
                      type="text"
                      className="input-field"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                      placeholder="06..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">ICE</label>
                    <input
                      type="text"
                      className="input-field"
                      value={newClient.ice}
                      onChange={(e) => setNewClient({...newClient, ice: e.target.value})}
                      placeholder="000..."
                    />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Identifiant Fiscal (IF)</label>
                    <input
                      type="text"
                      className="input-field"
                      value={newClient.if_id}
                      onChange={(e) => setNewClient({...newClient, if_id: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Taxe Pro / AE ID</label>
                    <input
                      type="text"
                      className="input-field"
                      value={newClient.taxe_pro}
                      onChange={(e) => setNewClient({...newClient, taxe_pro: e.target.value})}
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Address</label>
                <textarea
                  className="input-field min-h-[80px]"
                  value={newClient.address}
                  onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                  placeholder="Full address..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientSelector;
