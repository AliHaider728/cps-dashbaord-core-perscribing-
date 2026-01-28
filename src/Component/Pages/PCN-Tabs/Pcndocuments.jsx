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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-secondary rounded-2xl shadow-2xl max-w-lg w-full border border-border">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-bold text-primary">Upload Document</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <X size={20} className="text-muted" />
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
                  ? 'border-core-primary-500 bg-core-primary-50' 
                  : 'border-border hover:border-gray-400'
              }`}
            >
              {formData.file ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-xl flex items-center justify-center">
                    <File className="text-blue-600" size={32} />
                  </div>
                  <div>
                    <p className="font-semibold text-primary">{formData.file.name}</p>
                    <p className="text-sm text-muted">
                      {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, file: null})}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-xl flex items-center justify-center">
                    <Upload className="text-muted" size={32} />
                  </div>
                  <div>
                    <p className="text-primary font-semibold mb-1">
                      Drop your file here, or{' '}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-core-primary-600 hover:text-core-primary-700"
                      >
                        browse
                      </button>
                    </p>
                    <p className="text-sm text-muted">Supports: PDF, DOC, DOCX, XLS, XLSX (Max 10MB)</p>
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
              <label className="block text-sm font-medium text-primary mb-1.5">Document Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-core-primary-500 focus:border-transparent bg-secondary text-primary"
                placeholder="e.g., Service Agreement 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Document Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-core-primary-500 focus:border-transparent bg-secondary text-primary"
              >
                <option value="Contract">Contract</option>
                <option value="Compliance">Compliance</option>
                <option value="Report">Report</option>
                <option value="Invoice">Invoice</option>
                <option value="Policy">Policy</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-border rounded-lg hover:bg-primary transition-colors font-medium text-primary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.file}
                className={`flex-1 px-4 py-2.5 rounded-lg transition-all font-medium ${
                  formData.file
                    ? 'bg-core-primary-500 text-white hover:bg-core-primary-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-secondary rounded-xl shadow-2xl max-w-md w-full p-6 border border-border">
        <h3 className="text-lg font-bold text-primary mb-2">Delete Document</h3>
        <p className="text-secondary mb-6">
          Are you sure you want to delete <strong className="text-primary">{document.name}</strong>?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-border rounded-lg hover:bg-primary transition-colors font-medium text-primary"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onDeleteDocument(document.id);
              onClose();
            }}
            className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
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
        className="p-2 hover:bg-gray-200 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
      >
        <MoreVertical size={18} className="text-muted" />
      </button>

      {activeActionsMenu === document.id && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setActiveActionsMenu(null)}
          />
          <div className="absolute right-0 top-10 w-40 bg-white border border-border rounded-lg shadow-xl py-1 z-20 overflow-hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveActionsMenu(null);
              }}
              className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium text-primary"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(document);
                setActiveActionsMenu(null);
              }}
              className="w-full px-4 py-2.5 text-left hover:bg-red-50 transition-colors flex items-center gap-2 text-sm font-medium text-red-600"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-primary">PCN Documents</h3>
          <p className="text-sm text-muted mt-0.5">Important files and documentation</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-all hover:shadow-md font-medium"
        >
          <Upload size={18} />
          <span>Upload Document</span>
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-16 bg-secondary rounded-xl border border-border border-dashed">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-red-500" size={32} />
          </div>
          <p className="text-secondary font-medium">No documents uploaded</p>
          <p className="text-muted text-sm mt-1">Upload your first document to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-secondary rounded-xl border border-border p-5 hover:shadow-lg hover:border-core-primary-200 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="text-red-600" size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-primary group-hover:text-core-primary-500 transition-colors truncate">
                      {doc.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted font-medium">{doc.type}</span>
                      <span className="text-xs text-muted">•</span>
                      <span className="text-xs text-muted">{doc.size}</span>
                      <span className="text-xs text-muted">•</span>
                      <span className="text-xs text-muted">{new Date(doc.uploadDate).toLocaleDateString('en-GB')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <Download size={18} className="text-blue-600" />
                  </button>
                  <ActionsMenu document={doc} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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