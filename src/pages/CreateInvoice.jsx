import React, { useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { Save, RefreshCw, Download, PlusCircle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import InvoiceForm from '../components/InvoiceForm';
import InvoicePDF from '../components/InvoicePDF';
import { useAppContext } from '../context/AppContext';
import { confirmAlert } from '../utils/confirmToast';

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

  const handleNew = () => {
    confirmAlert({
      message: 'Create new document? Unsaved changes will be lost.',
      onConfirm: () => {
        createNewInvoice();
        toast.success('New document created');
      }
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Action Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-10 transition-all">
        {/* Title Section */}
        <div className="flex items-center gap-3 w-full sm:w-auto border-b sm:border-b-0 pb-3 sm:pb-0 border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                {invoiceData.docSettings.type === 'FACTURE' ? 'Edit Invoice' : 'Edit Quote'}
            </h2>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-mono font-medium border border-slate-200">
                #{invoiceData.docSettings.number}
            </span>
        </div>
        
        {/* Actions Section */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
            {/* New Button */}
            <button
              onClick={handleNew}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-all text-sm font-medium shadow-sm hover:shadow-md active:scale-95"
              title="Create New"
            >
              <PlusCircle className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">New</span>
            </button>
            
            {/* Preview Button */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="hidden md:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-all text-sm font-medium shadow-sm hover:shadow-md active:scale-95"
            >
              {showPreview ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-slate-500" />}
              <span className="hidden lg:inline">{showPreview ? 'Hide' : 'Preview'}</span>
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

            {/* Save Button */}
            <button
              onClick={saveInvoice}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-all text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:hover:bg-slate-900 active:scale-95 whitespace-nowrap"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>

            {/* Download Button */}
            <PDFDownloadLink
              document={<InvoicePDF data={invoiceData} />}
              fileName={`${invoiceData.docSettings.type}_${invoiceData.docSettings.number.replace('/', '-')}.pdf`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-sm font-medium shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap"
            >
              {({ loading }) => (
                <>
                  {loading ? <RefreshCw className="animate-spin h-4 w-4" /> : <Download className="h-4 w-4" />}
                  <span>{loading ? '...' : 'PDF'}</span>
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
