import React from 'react';
import { X, FileText, Trash2, Download } from 'lucide-react';

const SavedDocuments = ({ onClose, onLoad }) => {
  const [documents, setDocuments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      if (!response.ok) throw new Error('Failed to fetch documents');
      const data = await response.json();
      setDocuments(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDocuments();
  }, []);

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

  const handleLoad = async (id) => {
    try {
      const response = await fetch(`/api/documents/${id}`);
      if (!response.ok) throw new Error('Failed to load document');
      const result = await response.json();
      const content = JSON.parse(result.data.content);
      onLoad(content);
      onClose();
    } catch (err) {
      alert('Error loading document: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto animate-slide-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">Saved Documents</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8 text-slate-500">No saved documents found</div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div 
                key={doc.id}
                onClick={() => handleLoad(doc.id)}
                className="p-4 border border-slate-200 rounded-lg hover:border-blue-500 hover:shadow-md cursor-pointer transition-all group bg-slate-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${doc.type === 'FACTURE' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {doc.type}
                      </span>
                      <span className="text-sm text-slate-500">{new Date(doc.date).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-medium text-slate-800">{doc.clientName || 'Untitled Client'}</h3>
                    <p className="text-sm font-bold text-slate-900 mt-1">
                      {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(doc.total)}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => handleDelete(doc.id, e)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedDocuments;
