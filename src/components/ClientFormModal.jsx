import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const ClientFormModal = ({ onClose, onSuccess, initialData = null }) => {
  const [client, setClient] = useState({
    name: '',
    address: '',
    ice: '',
    if_id: '',
    taxe_pro: '',
    phone: ''
  });

  useEffect(() => {
    if (initialData) {
      setClient({
        name: initialData.name || '',
        address: initialData.address || '',
        ice: initialData.ice || '',
        if_id: initialData.if_id || initialData.if || '', // Handle both field names if different
        taxe_pro: initialData.taxe_pro || initialData.taxePro || '',
        phone: initialData.phone || ''
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = initialData ? `/api/clients/${initialData.id}` : '/api/clients';
      const method = initialData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client)
      });
      
      if (response.ok) {
        const result = await response.json();
        onSuccess(result.data);
        toast.success(initialData ? 'Client updated successfully' : 'Client created successfully');
        onClose();
      } else {
        throw new Error('Failed to save client');
      }
    } catch (error) {
      toast.error('Failed to save client: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">{initialData ? 'Edit Client' : 'Add New Client'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Client Name / Company <span className="text-red-500">*</span></label>
            <input
              required
              type="text"
              className="input-field"
              value={client.name}
              onChange={(e) => setClient({...client, name: e.target.value})}
              placeholder="Ex: Société X SARL"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Phone</label>
                <input
                  type="text"
                  className="input-field"
                  value={client.phone}
                  onChange={(e) => setClient({...client, phone: e.target.value})}
                  placeholder="06..."
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">ICE</label>
                <input
                  type="text"
                  className="input-field"
                  value={client.ice}
                  onChange={(e) => setClient({...client, ice: e.target.value})}
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
                  value={client.if_id}
                  onChange={(e) => setClient({...client, if_id: e.target.value})}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Taxe Pro / AE ID</label>
                <input
                  type="text"
                  className="input-field"
                  value={client.taxe_pro}
                  onChange={(e) => setClient({...client, taxe_pro: e.target.value})}
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Address</label>
            <textarea
              className="input-field min-h-[80px]"
              value={client.address}
              onChange={(e) => setClient({...client, address: e.target.value})}
              placeholder="Full address..."
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {initialData ? 'Update Client' : 'Save Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientFormModal;
