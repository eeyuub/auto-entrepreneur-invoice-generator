import React, { useState, useEffect } from 'react';
import { Search, Trash2, Edit, FileText, Download, Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Invoices = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, FACTURE, DEVIS
  const { loadInvoice, createNewInvoice } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      if (response.ok) {
        const result = await response.json();
        setDocuments(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch documents', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    createNewInvoice();
    navigate('/create');
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
      }
    } catch (err) {
      console.error('Error deleting document:', err);
    }
  };

  const handleEdit = async (doc) => {
    try {
      const response = await fetch(`/api/documents/${doc.id}`);
      if (!response.ok) throw new Error('Failed to load document');
      const result = await response.json();
      
      let content;
      if (typeof result.data.content === 'string') {
        content = JSON.parse(result.data.content);
      } else {
        content = result.data.content;
      }
      
      loadInvoice(content, result.data.id);
      navigate('/create');
    } catch (err) {
      console.error('Error loading document:', err);
      alert('Failed to load document for editing');
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = (doc.clientName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Invoices & Quotes</h2>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <button
                onClick={handleCreateNew}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium order-first md:order-last"
            >
                <Plus size={18} />
                Create New
            </button>
            <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search clients..." 
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select 
                    className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="ALL">All Types</option>
                    <option value="FACTURE">Facture</option>
                    <option value="DEVIS">Devis</option>
                </select>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-4 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="py-4 px-6 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
              ) : filteredDocuments.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-slate-500">No documents found</td></tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        doc.type === 'FACTURE' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {doc.type}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                        <div className="font-medium text-slate-900">{doc.clientName || 'Untitled Client'}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                        {new Date(doc.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-slate-900">
                        {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(doc.total)}
                    </td>
                    <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <button 
                                onClick={() => handleEdit(doc)}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={(e) => handleDelete(doc.id, e)}
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
    </div>
  );
};

export default Invoices;
