import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import initialData from '../data/userProfile.json';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const session = localStorage.getItem('auth_session');
    if (session) {
      try {
        const { expiry } = JSON.parse(session);
        if (new Date().getTime() < expiry) {
          return true;
        }
        localStorage.removeItem('auth_session');
      } catch (e) {
        localStorage.removeItem('auth_session');
      }
    }
    return false;
  });

  const login = () => {
    const expiry = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours
    localStorage.setItem('auth_session', JSON.stringify({ expiry }));
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('auth_session');
    setIsAuthenticated(false);
  };

  // --- Invoice Data State ---
  const [invoiceData, setInvoiceData] = useState({
    ...initialData,
    docSettings: {
      ...initialData.docSettings,
      date: new Date().toISOString().split('T')[0]
    }
  });

  const [currentDocId, setCurrentDocId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Auto-calculate total
  useEffect(() => {
    const newTotal = invoiceData.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    setInvoiceData(prev => ({ ...prev, total: newTotal }));
  }, [invoiceData.items]);

  const updateInvoiceData = (section, field, value) => {
    if (section === 'root') {
      setInvoiceData(prev => ({ ...prev, [field]: value }));
    } else {
      setInvoiceData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
  };

  const addItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (index) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setInvoiceData(prev => ({ ...prev, items: newItems }));
  };

  const createNewInvoice = () => {
    setInvoiceData({
      ...initialData,
      docSettings: {
        ...initialData.docSettings,
        date: new Date().toISOString().split('T')[0]
      }
    });
    setCurrentDocId(null);
  };

  const loadInvoice = (loadedData, id) => {
    setInvoiceData(loadedData);
    setCurrentDocId(id);
  };

  const saveInvoice = async () => {
    setSaving(true);
    try {
      const payload = {
        type: invoiceData.docSettings.type,
        clientName: invoiceData.clientInfo.name,
        date: invoiceData.docSettings.date,
        total: invoiceData.total,
        content: invoiceData
      };
      
      let response;
      if (currentDocId) {
        response = await fetch(`/api/documents/${currentDocId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch('/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      
      if (!response.ok) throw new Error('Failed to save');
      const result = await response.json();
      
      if (!currentDocId && result.data && result.data.id) {
        setCurrentDocId(result.data.id);
      }
      
      toast.success(currentDocId ? 'Document updated successfully!' : 'Document saved successfully!');
      return true;
    } catch (err) {
      toast.error('Error saving document: ' + err.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      invoiceData,
      setInvoiceData,
      currentDocId,
      setCurrentDocId,
      saving,
      updateInvoiceData,
      addItem,
      removeItem,
      updateItem,
      createNewInvoice,
      loadInvoice,
      saveInvoice
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
