import React, { useState, useRef } from 'react';
import { FileText, Plus, Download, Trash2, MoreVertical, Upload, X, File } from 'lucide-react';

const PCNDocuments = ({ documents, onAddDocument, onDeleteDocument }) => {
  const [activeActionsMenu, setActiveActionsMenu] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef(null);

  const UploadModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
      name: '',
      type: 'Contract',
      file: null
    });
    const [dragActive, setDragActive] = useState(false);

    const handleFileSelect = (file) => {
      if (file) {
        setFormData({
          ...formData,
          file: file,
          name: formData.name || file.name
        });
      }
    };

    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (formData.file) {
        const newDocument = {
          id: Date.now(),
          name: formData.name,
          type: formData.type,
          uploadDate: new Date().toISOString().split('T')[0],
          size: (formData.file.size / (1024 * 1024)).toFixed(2) + ' MB'
        };
        onAddDocument(newDocument);
        onClose();
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-core-surface-dark rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200 dark:border-core-border-dark">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-core-border-dark flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upload Document</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-core-primary-900/20 rounded-lg transition-colors">
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive 
                  ? 'border-blue-500 dark:border-core-primary-600 bg-blue-50 dark:bg-core-primary-900/20' 
                  : 'border-gray-300 dark:border-core-border-dark hover:border-gray-400 dark:hover:border-gray-600'
              }`}
            >
              {formData.file ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <File className="text-blue-600 dark:text-blue-400" size={32} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{formData.file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, file: null})}
                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-core-primary-900/20 rounded-xl flex items-center justify-center">
                    <Upload className="text-gray-400 dark:text-gray-500" size={32} />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-semibold mb-1">
                      Drop your file here, or{' '}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-blue-600 dark:text-core-primary-400 hover:text-blue-700 dark:hover:text-core-primary-300"
                      >
                        browse
                      </button>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Supports: PDF, DOC, DOCX, XLS, XLSX (Max 10MB)</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    className="hidden"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Document Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-core-border-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-core-primary-600 focus:border-transparent bg-white dark:bg-core-bg-dark text-gray-900 dark:text-white"
                placeholder="e.g., Service Agreement 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Document Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-core-border-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-core-primary-600 focus:border-transparent bg-white dark:bg-core-bg-dark text-gray-900 dark:text-white"
              >
                <option value="Contract">Contract</option>
                <option value="Compliance">Compliance</option>
                <option value="Report">Report</option>
                <option value="Invoice">Invoice</option>
                <option value="Policy">Policy</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-core-border-dark">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-core-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-core-primary-900/20 transition-colors font-medium text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.file}
                className={`flex-1 px-4 py-2.5 rounded-lg transition-all font-medium ${
                  formData.file
                    ? 'bg-blue-500 dark:bg-core-primary-600 text-white hover:bg-blue-600 dark:hover:bg-core-primary-700'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                Upload Document
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const DeleteConfirmModal = ({ document, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-core-surface-dark rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-core-border-dark">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Document</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete <strong className="text-gray-900 dark:text-white">{document.name}</strong>?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-core-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-core-primary-900/20 text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onDeleteDocument(document.id);
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const ActionsMenu = ({ document }) => (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setActiveActionsMenu(activeActionsMenu === document.id ? null : document.id);
        }}
        className="p-2 hover:bg-gray-100 dark:hover:bg-core-primary-900/20 rounded-lg transition-colors"
      >
        <MoreVertical size={18} className="text-gray-600 dark:text-gray-400" />
      </button>

      {activeActionsMenu === document.id && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setActiveActionsMenu(null)}
          />
          <div className="absolute right-0 top-10 w-40 bg-white dark:bg-core-surface-dark rounded-lg shadow-lg border border-gray-200 dark:border-core-border-dark py-1 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Download functionality
                setActiveActionsMenu(null);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-core-primary-900/20 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <Download size={14} />
              <span>Download</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(document);
                setActiveActionsMenu(null);
              }}
              className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">PCN Documents</h3>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 dark:bg-core-primary-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-core-primary-700 transition-colors shadow-sm"
        >
          <Upload size={18} />
          <span>Upload Document</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white dark:bg-core-surface-dark rounded-xl border border-gray-200 dark:border-core-border-dark p-5 hover:shadow-lg transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center border border-red-100 dark:border-red-700/50">
                  <FileText className="text-red-500 dark:text-red-400" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-core-primary-400 transition-colors truncate">
                    {doc.name}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-core-primary-900/30 rounded font-medium text-xs">{doc.type}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>{doc.uploadDate}</span>
                  </div>
                </div>
              </div>
              <ActionsMenu document={doc} />
            </div>
          </div>
        ))}
      </div>

      {showDeleteConfirm && (
        <DeleteConfirmModal 
          document={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(null)}
        />
      )}

      {showUploadModal && (
        <UploadModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
};

export default PCNDocuments;