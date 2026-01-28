import React, { useState } from 'react';
import { Plus, Mail, Phone, CheckCircle, Edit, Trash2, X, MoreVertical } from 'lucide-react';

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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-secondary rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-border">
          <div className="sticky top-0 bg-secondary border-b border-border px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-primary">
              {contact ? 'Edit Contact' : 'Add New Contact'}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <X size={20} className="text-muted" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-core-primary-500 focus:border-transparent bg-secondary text-primary"
                  placeholder="Dr. John Smith"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">Role/Position</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-core-primary-500 focus:border-transparent bg-secondary text-primary"
                  placeholder="PCN Manager"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-core-primary-500 focus:border-transparent bg-secondary text-primary"
                placeholder="john.smith@pcn.nhs.uk"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Phone Number</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-core-primary-500 focus:border-transparent bg-secondary text-primary"
                placeholder="0113 123 4567"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPrimary}
                  onChange={(e) => setFormData({...formData, isPrimary: e.target.checked})}
                  className="w-4 h-4 text-core-primary-500 border-border rounded focus:ring-core-primary-500"
                />
                <span className="text-sm font-medium text-primary">Primary Contact</span>
              </label>

              <div className="flex-1">
                <label className="block text-sm font-medium text-primary mb-1.5">Preferred Contact</label>
                <select
                  value={formData.preferredContact}
                  onChange={(e) => setFormData({...formData, preferredContact: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-core-primary-500 focus:border-transparent bg-secondary text-primary"
                >
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                </select>
              </div>
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
                className="flex-1 px-4 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors font-medium"
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-secondary rounded-xl shadow-2xl max-w-md w-full p-6 border border-border">
        <h3 className="text-lg font-bold text-primary mb-2">Delete Contact</h3>
        <p className="text-secondary mb-6">
          Are you sure you want to delete <strong className="text-primary">{contact.name}</strong>?
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
              onDeleteContact(contact.id);
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

  const ActionsMenu = ({ contact }) => (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setActiveActionsMenu(activeActionsMenu === contact.id ? null : contact.id);
        }}
        className="p-2 hover:bg-gray-200 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
      >
        <MoreVertical size={18} className="text-muted" />
      </button>

      {activeActionsMenu === contact.id && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setActiveActionsMenu(null)}
          />
          <div className="absolute right-0 top-10 w-40 bg-white border border-border rounded-lg shadow-xl py-1 z-20 overflow-hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingContact(contact);
                setShowAddModal(true);
                setActiveActionsMenu(null);
              }}
              className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium text-primary"
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(contact);
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
          <h3 className="text-lg font-semibold text-primary">PCN Contacts</h3>
          <p className="text-sm text-muted mt-0.5">Manage key contact persons for this PCN</p>
        </div>
        <button 
          onClick={() => {
            setEditingContact(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-all hover:shadow-md font-medium"
        >
          <Plus size={18} />
          <span>Add Contact</span>
        </button>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-16 bg-secondary rounded-xl border border-border border-dashed">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="text-blue-500" size={32} />
          </div>
          <p className="text-secondary font-medium">No contacts found</p>
          <p className="text-muted text-sm mt-1">Add your first contact to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-secondary rounded-xl border border-border p-6 hover:shadow-lg hover:border-core-primary-200 transition-all group">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-core-primary-500 to-core-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary text-lg">{contact.name}</h4>
                    <p className="text-sm text-muted mt-0.5">{contact.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {contact.isPrimary && (
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                      Primary
                    </span>
                  )}
                  <ActionsMenu contact={contact} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <Mail size={14} className="text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted font-medium">Email</p>
                    <p className="text-sm text-primary truncate">{contact.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                    <Phone size={14} className="text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted font-medium">Phone</p>
                    <p className="text-sm text-primary">{contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:col-span-2">
                  <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle size={14} className="text-violet-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted font-medium">Preferred Contact</p>
                    <p className="text-sm text-primary">{contact.preferredContact}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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