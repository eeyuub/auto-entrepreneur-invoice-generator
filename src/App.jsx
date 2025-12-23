import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Invoices from './pages/Invoices';
import Clients from './pages/Clients';
import CreateInvoice from './pages/CreateInvoice';
import Login from './components/Login';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, login } = useAppContext();
  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }
  return children;
};

// Login wrapper to handle onLogin prop which Login component expects or context usage
const LoginWrapper = () => {
    const { isAuthenticated, login } = useAppContext();
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return <Login onLogin={login} />;
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginWrapper />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="clients" element={<Clients />} />
            <Route path="create" element={<CreateInvoice />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
