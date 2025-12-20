import React, { useState, useEffect } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import InvoiceForm from './components/InvoiceForm';
import InvoicePDF from './components/InvoicePDF';
import Login from './components/Login';
import SavedDocuments from './components/SavedDocuments';
import { FileText, Download, RefreshCw, Save, History } from 'lucide-react';
import initialData from './data/userProfile.json';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const session = localStorage.getItem('auth_session');
    if (session) {
      try {
        const { expiry } = JSON.parse(session);
        if (new Date().getTime() < expiry) {
          return true;
        }
        // Session expired
        localStorage.removeItem('auth_session');
      } catch (e) {
        // Invalid session data
        localStorage.removeItem('auth_session');
      }
    }
    return false;
  });

  const [data, setData] = useState({
    ...initialData,
    docSettings: {
      ...initialData.docSettings,
      date: new Date().toISOString().split('T')[0]
    }
  });

  const [showPreview, setShowPreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [saving, setSaving] = useState(false);

  // Auto-calculate total
  useEffect(() => {
    const newTotal = data.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    setData(prev => ({ ...prev, total: newTotal }));
  }, [data.items]);

  const updateData = (section, field, value) => {
    if (section === 'root') {
      setData(prev => ({ ...prev, [field]: value }));
    } else {
      setData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
  };

  const addItem = () => {
    setData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (index) => {
    setData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setData(prev => ({ ...prev, items: newItems }));
  };

  const handleLogin = () => {
    const expiry = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours
    localStorage.setItem('auth_session', JSON.stringify({ expiry }));
    setIsAuthenticated(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        type: data.docSettings.type,
        clientName: data.clientInfo.name,
        date: data.docSettings.date,
        total: data.total,
        content: data
      };
      
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error('Failed to save');
      alert('Document saved successfully!');
    } catch (err) {
      alert('Error saving document: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const loadDocument = (loadedData) => {
    setData(loadedData);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-20">
      {/* Header Bar */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="text-blue-400" />
            <h1 className="text-xl font-bold tracking-tight">Auto-Entrepreneur <span className="text-blue-400">Invoice</span> Generator</h1>
          </div>
          <div className="flex gap-4">
             <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors text-sm font-medium disabled:opacity-50"
             >
               <Save className="w-4 h-4" />
               {saving ? 'Saving...' : 'Save'}
             </button>
             <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors text-sm font-medium"
             >
               <History className="w-4 h-4" />
               History
             </button>
             <button
              onClick={() => setShowPreview(!showPreview)}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded transition-colors text-sm font-medium"
            >
              {showPreview ? 'Masquer Aperçu' : 'Voir Aperçu'}
            </button>
            <PDFDownloadLink
              document={<InvoicePDF data={data} />}
              fileName={`${data.docSettings.type}_${data.docSettings.number.replace('/', '-')}.pdf`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium shadow-md transition-all hover:shadow-lg"
            >
              {({ loading }) => (
                <>
                  {loading ? <RefreshCw className="animate-spin h-4 w-4" /> : <Download className="h-4 w-4" />}
                  {loading ? 'Génération...' : 'Télécharger PDF'}
                </>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className={`flex-1 transition-all ${showPreview ? 'lg:w-1/2' : 'w-full'}`}>
            <InvoiceForm
              data={data}
              updateData={updateData}
              addItem={addItem}
              removeItem={removeItem}
              updateItem={updateItem}
            />
          </div>

          {/* Preview Section (Desktop) */}
          {showPreview && (
            <div className="hidden lg:block w-1/2 sticky top-24 h-[calc(100vh-8rem)]">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden h-full border border-slate-200">
                <div className="bg-slate-800 text-white px-4 py-2 text-sm font-medium flex justify-between items-center">
                  <span>Aperçu du document</span>
                </div>
                <PDFViewer width="100%" height="100%" className="border-none">
                  <InvoicePDF data={data} />
                </PDFViewer>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* History Sidebar */}
      {showHistory && (
        <SavedDocuments 
          onClose={() => setShowHistory(false)} 
          onLoad={loadDocument} 
        />
      )}
    </div>
  );
}

export default App;
