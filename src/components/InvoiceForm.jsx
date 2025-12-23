import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ClientSelector from './ClientSelector';

const InvoiceForm = ({ data, updateData, addItem, removeItem, updateItem }) => {
  const handleChange = (section, field, value) => {
    updateData(section, field, value);
  };

  const handleClientSelect = (clientData) => {
      // Update all client fields at once
      updateData('clientInfo', 'name', clientData.name);
      updateData('clientInfo', 'address', clientData.address);
      updateData('clientInfo', 'ice', clientData.ice);
      updateData('clientInfo', 'if', clientData.if);
      updateData('clientInfo', 'taxePro', clientData.taxePro);
      updateData('clientInfo', 'phone', clientData.phone);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* My Info */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Mes Informations (Auto-Entrepreneur)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1">Nom Complet / Raison Sociale</label>
            <input
              type="text"
              placeholder="Ex: Yassine Benali"
              className="input-field"
              value={data.myInfo.name}
              onChange={(e) => handleChange('myInfo', 'name', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Adresse</label>
            <input
              type="text"
              placeholder="Ex: 123 Bd Zerktouni, Casablanca"
              className="input-field"
              value={data.myInfo.address}
              onChange={(e) => handleChange('myInfo', 'address', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Téléphone</label>
            <input
              type="text"
              placeholder="Ex: +212 6..."
              className="input-field"
              value={data.myInfo.phone}
              onChange={(e) => handleChange('myInfo', 'phone', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
             <div>
               <label className="block text-sm font-medium text-slate-600 mb-1">ICE</label>
               <input
                type="text"
                placeholder="000123456000089"
                className="input-field"
                value={data.myInfo.ice}
                onChange={(e) => handleChange('myInfo', 'ice', e.target.value)}
              />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-600 mb-1">Identifiant Fiscal (IF)</label>
               <input
                type="text"
                placeholder="12345678"
                className="input-field"
                value={data.myInfo.if}
                onChange={(e) => handleChange('myInfo', 'if', e.target.value)}
              />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-600 mb-1">Taxe Pro / AE ID</label>
               <input
                type="text"
                placeholder="12345678"
                className="input-field"
                value={data.myInfo.aeId}
                onChange={(e) => handleChange('myInfo', 'aeId', e.target.value)}
              />
             </div>
          </div>
        </div>
      </div>

      {/* Document Settings & Client Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Document Settings */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Paramètres du Document</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                className={`flex-1 py-2 rounded font-medium transition-colors ${data.docSettings.type === 'FACTURE' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                onClick={() => handleChange('docSettings', 'type', 'FACTURE')}
              >
                FACTURE
              </button>
              <button
                className={`flex-1 py-2 rounded font-medium transition-colors ${data.docSettings.type === 'DEVIS' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                onClick={() => handleChange('docSettings', 'type', 'DEVIS')}
              >
                DEVIS
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Numéro (ex: 001/2025)</label>
              <input
                type="text"
                className="input-field"
                value={data.docSettings.number}
                onChange={(e) => handleChange('docSettings', 'number', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
              <input
                type="date"
                className="input-field"
                value={data.docSettings.date}
                onChange={(e) => handleChange('docSettings', 'date', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Informations Client</h2>
          <div className="space-y-4">
            
            {/* New Client Selector */}
            <ClientSelector 
                currentClient={data.clientInfo} 
                onSelect={handleClientSelect} 
            />

            <div className="pt-2 border-t border-slate-100 mt-2">
                <p className="text-xs text-slate-400 mb-3 uppercase font-bold tracking-wider">Client Details (Auto-filled)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-600 mb-1">Nom du Client / Société</label>
                        <input
                            type="text"
                            placeholder="Ex: Société X SARL"
                            className="input-field bg-slate-50"
                            value={data.clientInfo.name}
                            onChange={(e) => handleChange('clientInfo', 'name', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">ICE Client</label>
                        <input
                            type="text"
                            placeholder="000..."
                            className="input-field"
                            value={data.clientInfo.ice}
                            onChange={(e) => handleChange('clientInfo', 'ice', e.target.value)}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Téléphone</label>
                        <input
                            type="text"
                            placeholder="06..."
                            className="input-field"
                            value={data.clientInfo.phone || ''}
                            onChange={(e) => handleChange('clientInfo', 'phone', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Identifiant Fiscal (IF)</label>
                        <input
                            type="text"
                            className="input-field"
                            value={data.clientInfo.if || ''}
                            onChange={(e) => handleChange('clientInfo', 'if', e.target.value)}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Taxe Pro / AE ID</label>
                        <input
                            type="text"
                            className="input-field"
                            value={data.clientInfo.taxePro || ''}
                            onChange={(e) => handleChange('clientInfo', 'taxePro', e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-600 mb-1">Adresse</label>
                        <textarea
                            placeholder="Ex: 45 Av..."
                            className="input-field min-h-[60px]"
                            value={data.clientInfo.address}
                            onChange={(e) => handleChange('clientInfo', 'address', e.target.value)}
                        />
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-bold text-slate-800">Articles / Services</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm">
                <th className="py-2 px-3 text-left w-1/2">Description</th>
                <th className="py-2 px-3 text-center w-24">Qté</th>
                <th className="py-2 px-3 text-right w-32">Prix Unitaire</th>
                <th className="py-2 px-3 text-right w-32">Total</th>
                <th className="py-2 px-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={index} className="border-b border-slate-100">
                  <td className="p-2">
                    <input
                      type="text"
                      className="input-field"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Description"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      min="1"
                      className="input-field text-center"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="input-field text-right"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="p-2 text-right font-medium text-slate-700">
                    {(item.quantity * item.price).toFixed(2)}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Supprimer la ligne"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={addItem}
          className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded hover:bg-blue-50 transition-colors"
        >
          <Plus size={18} /> Ajouter une ligne
        </button>

        {/* Totals & Words */}
        <div className="mt-8 border-t pt-6 flex flex-col items-end">
           <div className="w-full md:w-1/2 space-y-3">
             <div className="flex justify-between text-slate-600">
               <span>Total HT:</span>
               <span>{data.total.toFixed(2)} DH</span>
             </div>
             <div className="flex justify-between text-slate-600">
               <span>TVA (Exonéré):</span>
               <span>0.00 DH</span>
             </div>
             <div className="flex justify-between text-xl font-bold text-slate-800 pt-3 border-t">
               <span>Total à Payer:</span>
               <span>{data.total.toFixed(2)} DH</span>
             </div>
           </div>

           <div className="w-full mt-6 bg-yellow-50 p-4 rounded border border-yellow-100">
             <label className="block text-sm font-medium text-yellow-800 mb-1">
               Arrêté la présente facture à la somme de (en lettres) :
             </label>
             <input
               type="text"
               className="input-field w-full italic border-yellow-200 focus:ring-yellow-400"
               placeholder="Ex: Deux mille cinq cents dirhams"
               value={data.totalInWords}
               onChange={(e) => updateData('root', 'totalInWords', e.target.value)}
             />
             <p className="text-xs text-yellow-600 mt-1">
               * Obligatoire pour la validité administrative.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
