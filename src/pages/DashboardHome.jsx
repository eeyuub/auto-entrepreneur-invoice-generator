import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, FileText, DollarSign, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-2">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const DashboardHome = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loadInvoice } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
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
    fetchDocuments();
  }, []);

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

  // Calculate Stats
  const invoicesOnly = documents.filter(doc => doc.type === 'FACTURE');
  
  const totalInvoices = invoicesOnly.length;
  const totalRevenue = invoicesOnly.reduce((sum, doc) => sum + (doc.total || 0), 0);
  const thisMonthRevenue = invoicesOnly
    .filter(doc => new Date(doc.date).getMonth() === new Date().getMonth())
    .reduce((sum, doc) => sum + (doc.total || 0), 0);

  // Prepare Chart Data (Last 6 months)
  const chartData = invoicesOnly.reduce((acc, doc) => {
    const date = new Date(doc.date);
    const month = date.toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.name === month);
    if (existing) {
      existing.amount += doc.total;
    } else {
      acc.push({ name: month, amount: doc.total });
    }
    return acc;
  }, []).slice(-6);

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(totalRevenue)}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard 
          title="Invoices Created" 
          value={totalInvoices}
          icon={FileText}
          color="bg-blue-500"
        />
        <StatCard 
          title="This Month" 
          value={new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(thisMonthRevenue)}
          icon={TrendingUp}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Revenue Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(value)}
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Invoices</h3>
          <div className="space-y-4">
            {documents.slice(0, 5).map((doc) => (
              <div 
                key={doc.id}
                onClick={() => handleEdit(doc)}
                className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${doc.type === 'FACTURE' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{doc.clientName || 'Unknown Client'}</p>
                    <p className="text-xs text-slate-500">{new Date(doc.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-700">
                  {new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(doc.total)}
                </span>
              </div>
            ))}
            {documents.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
