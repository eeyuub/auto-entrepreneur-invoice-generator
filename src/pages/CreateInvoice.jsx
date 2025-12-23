import React, { useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { Save, RefreshCw, Download, PlusCircle, Eye, EyeOff } from 'lucide-react';
import InvoiceForm from '../components/InvoiceForm';
import InvoicePDF from '../components/InvoicePDF';
import { useAppContext } from '../context/AppContext';

const CreateInvoice = () => {
  const { 
    invoiceData, 
    updateInvoiceData, 
    addItem, 
    removeItem, 
    updateItem, 
    saveInvoice, 
    createNewInvoice,
    saving 
  } = useAppContext();

  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Action Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">
                {invoiceData.docSettings.type === 'FACTURE' ? 'Edit Invoice' : 'Edit Quote'}
            </h2>
            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-sm font-mono">
                #{invoiceData.docSettings.number}
            </span>
        </div>
        
        <div className="flex flex-wrap gap-3">
            <button
              onClick={createNewInvoice}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
            >
              <PlusCircle className="w-4 h-4" />
              New
            </button>
            
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>

            <button
              onClick={saveInvoice}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>

            <PDFDownloadLink
              document={<InvoicePDF data={invoiceData} />}
              fileName={`${invoiceData.docSettings.type}_${invoiceData.docSettings.number.replace('/', '-')}.pdf`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-all hover:shadow text-sm"
            >
              {({ loading }) => (
                <>
                  {loading ? <RefreshCw className="animate-spin h-4 w-4" /> : <Download className="h-4 w-4" />}
                  {loading ? 'Generating...' : 'Download PDF'}
                </>
              )}
            </PDFDownloadLink>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className={showPreview ? 'lg:col-span-1' : 'lg:col-span-2'}>
            <InvoiceForm 
                data={invoiceData}
                updateData={updateInvoiceData}
                addItem={addItem}
                removeItem={removeItem}
                updateItem={updateItem}
            />
        </div>

        {/* Live Preview Section (Hidden by default or toggled) */}
        {showPreview && (
            <div className="hidden lg:block sticky top-24 h-[calc(100vh-8rem)]">
                <div className="bg-slate-800 rounded-xl shadow-lg p-1 h-full flex flex-col">
                    <div className="text-white text-center py-2 text-sm font-medium">PDF Preview</div>
                    <div className="flex-1 bg-white rounded-lg overflow-hidden">
                        <PDFViewer width="100%" height="100%" className="w-full h-full border-none">
                            <InvoicePDF data={invoiceData} />
                        </PDFViewer>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CreateInvoice;
