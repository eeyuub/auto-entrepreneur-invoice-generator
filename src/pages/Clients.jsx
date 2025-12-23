import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Users, Building, Phone, FileText, File } from 'lucide-react';
import ClientFormModal from '../components/ClientFormModal';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  const handleClientSaved = (savedClient) => {
    if (editingClient) {
      setClients(clients.map(c => c.id === savedClient.id ? savedClient : c));
    } else {
      setClients([...clients, savedClient]);
    }
    setEditingClient(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    try {
      const response = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setClients(clients.filter(c => c.id !== id));
      } else {
        alert('Failed to delete client');
      }
    } catch (error) {
      alert('Error deleting client');
    }
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.phone && client.phone.includes(searchTerm)) ||
    (client.ice && client.ice.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Clients</h2>
          <p className="text-slate-500 text-sm">Manage your client base</p>
        </div>
        <button 
          onClick={() => { setEditingClient(null); setShowAddModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          <Plus size={18} /> Add Client
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Clients</p>
            <h3 className="text-2xl font-bold text-slate-800">{clients.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <Building size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Companies</p>
            <h3 className="text-2xl font-bold text-slate-800">
                {clients.filter(c => c.ice && c.ice.length > 0).length}
            </h3>
          </div>
        </div>
        {/* Placeholder for future stats like "Top Client" */}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search clients by name, phone or ICE..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Clients List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-4 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Client Name</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Info</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Legal IDs</th>
                <th className="py-4 px-6 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="4" className="text-center py-8">Loading...</td></tr>
              ) : filteredClients.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-8 text-slate-500">No clients found</td></tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-900">{client.name}</div>
                      <div className="text-sm text-slate-500 truncate max-w-xs">{client.address}</div>
                    </td>
                    <td className="py-4 px-6">
                        {client.phone ? (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Phone size={14} /> {client.phone}
                            </div>
                        ) : (
                            <span className="text-sm text-slate-400">-</span>
                        )}
                    </td>
                    <td className="py-4 px-6">
                        <div className="text-xs text-slate-500 space-y-1">
                            {client.ice && <div><span className="font-semibold">ICE:</span> {client.ice}</div>}
                            {client.if_id && <div><span className="font-semibold">IF:</span> {client.if_id}</div>}
                        </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <button 
                                onClick={() => { setEditingClient(client); setShowAddModal(true); }}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => handleDelete(client.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <ClientFormModal 
          initialData={editingClient}
          onClose={() => setShowAddModal(false)} 
          onSuccess={handleClientSaved} 
        />
      )}
    </div>
  );
};

export default Clients;
