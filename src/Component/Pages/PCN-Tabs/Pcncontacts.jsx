import React, { useState } from 'react';
import { Plus, Mail, Phone, CheckCircle, Edit2, Trash2, X, Save, MoreVertical } from 'lucide-react';

const PCNContacts = ({ contacts, onAddContact, onUpdateContact, onDeleteContact }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [activeActionsMenu, setActiveActionsMenu] = useState(null);

  const ContactModal = ({ contact, onClose }) => {
    const [formData, setFormData] = useState(contact || {
      name: '',
      role: '',
      email: '',
      phone: '',
      isPrimary: false,
      preferredContact: 'Email'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (contact) {
        onUpdateContact({ ...formData, id: contact.id });
      } else {
        onAddContact({ ...formData, id: Date.now() });
      }
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-core-surface-dark rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-core-border-dark">
          <div className="sticky top-0 bg-white dark:bg-core-surface-dark border-b border-gray-200 dark:border-core-border-dark px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {contact ? 'Edit Contact' : 'Add New Contact'}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-core-primary-900/20 rounded-lg">
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-core-border-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-core-primary-600 focus:border-transparent bg-white dark:bg-core-bg-dark text-gray-900 dark:text-white"
                placeholder="Dr. John Smith"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role/Position *</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-core-border-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-core-primary-600 focus:border-transparent bg-white dark:bg-core-bg-dark text-gray-900 dark:text-white"
                placeholder="PCN Manager"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-core-border-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-core-primary-600 focus:border-transparent bg-white dark:bg-core-bg-dark text-gray-900 dark:text-white"
                placeholder="john.smith@pcn.nhs.uk"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-core-border-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-core-primary-600 focus:border-transparent bg-white dark:bg-core-bg-dark text-gray-900 dark:text-white"
                placeholder="0113 123 4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Contact</label>
              <select
                value={formData.preferredContact}
                onChange={(e) => setFormData({...formData, preferredContact: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-core-border-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-core-primary-600 focus:border-transparent bg-white dark:bg-core-bg-dark text-gray-900 dark:text-white"
              >
                <option value="Email">Email</option>
                <option value="Phone">Phone</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPrimary}
                  onChange={(e) => setFormData({...formData, isPrimary: e.target.checked})}
                  className="w-4 h-4 text-blue-500 dark:text-core-primary-600 border-gray-300 dark:border-core-border-dark rounded"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Primary Contact</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-core-border-dark">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-core-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-core-primary-900/20 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-500 dark:bg-core-primary-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-core-primary-700"
              >
                {contact ? 'Update' : 'Add'} Contact
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const DeleteConfirmModal = ({ contact, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-core-surface-dark rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-core-border-dark">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Contact</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete <strong className="text-gray-900 dark:text-white">{contact.name}</strong>?
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
              onDeleteContact(contact.id);
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

  const ActionsMenu = ({ contact }) => (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setActiveActionsMenu(activeActionsMenu === contact.id ? null : contact.id);
        }}
        className="p-2 hover:bg-gray-100 dark:hover:bg-core-primary-900/20 rounded-lg transition-colors"
      >
        <MoreVertical size={18} className="text-gray-600 dark:text-gray-400" />
      </button>

      {activeActionsMenu === contact.id && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setActiveActionsMenu(null)}
          />
          <div className="absolute right-0 top-10 w-40 bg-white dark:bg-core-surface-dark rounded-lg shadow-lg border border-gray-200 dark:border-core-border-dark py-1 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingContact(contact);
                setShowAddModal(true);
                setActiveActionsMenu(null);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-core-primary-900/20 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <Edit2 size={14} />
              <span>Edit</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(contact);
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">PCN Contacts</h3>
        <button 
          onClick={() => {
            setEditingContact(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 dark:bg-core-primary-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-core-primary-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add Contact</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {contacts.map((contact) => (
          <div key={contact.id} className="bg-white dark:bg-core-surface-dark rounded-2xl border border-gray-200 dark:border-core-border-dark p-6 hover:shadow-xl transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-core-primary-600 dark:to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {contact.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">{contact.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{contact.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {contact.isPrimary && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full border border-blue-200 dark:border-blue-700/50">
                    PRIMARY
                  </span>
                )}
                <ActionsMenu contact={contact} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-core-primary-900/10 rounded-lg">
                <div className="w-9 h-9 bg-white dark:bg-core-surface-dark rounded-lg flex items-center justify-center border border-gray-200 dark:border-core-border-dark">
                  <Mail size={16} className="text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Email</p>
                  <p className="text-sm text-gray-900 dark:text-white font-medium truncate">{contact.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-core-primary-900/10 rounded-lg">
                <div className="w-9 h-9 bg-white dark:bg-core-surface-dark rounded-lg flex items-center justify-center border border-gray-200 dark:border-core-border-dark">
                  <Phone size={16} className="text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Phone</p>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">{contact.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-core-primary-900/10 rounded-lg md:col-span-2">
                <div className="w-9 h-9 bg-white dark:bg-core-surface-dark rounded-lg flex items-center justify-center border border-gray-200 dark:border-core-border-dark">
                  <CheckCircle size={16} className="text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Preferred Contact Method</p>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">{contact.preferredContact}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <ContactModal 
          contact={editingContact}
          onClose={() => {
            setShowAddModal(false);
            setEditingContact(null);
          }}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal 
          contact={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(null)}
        />
      )}
    </div>
  );
};

export default PCNContacts;