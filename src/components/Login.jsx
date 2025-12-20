import React, { useState } from 'react';
import { Lock } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const secretKey = import.meta.env.VITE_SECRET_KEY;
    
    if (password === secretKey) {
      onLogin();
    } else {
      setError('Clé secrète incorrecte');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Authentification Requise</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Clé Secrète</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700"
              placeholder="Entrez votre clé secrète"
              autoFocus
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-100">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Accéder à l'application
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
