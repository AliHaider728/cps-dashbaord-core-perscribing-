import React, { useState } from 'react';
import { 
  Building2, MapPin, User, Phone, Mail, Hospital,
  FileText, MessageSquare, Plus, Edit, Users, Calendar,
  CheckCircle, BarChart3, MoreVertical, Trash, RefreshCw
} from 'lucide-react';
import Breadcrumb from '../Breadcrumb.jsx'

const PracticeProfile = ({ practiceData, onBack, setActivePage }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [practice, setPractice] = useState(practiceData || {
    id: 1,
    name: 'Green Street Surgery',
    code: 'PR001',
    type: 'standalone',
    status: 'Active',
    location: 'London',
    address: '123 Green Street, London, E1 1AB',
    pcnName: null,
    pcnId: null,
    manager: 'Dr. Emily Brown',
    activeSince: '2018-03-15'
  });
  const [editingPractice, setEditingPractice] = useState(null);
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'Dr. Emily Brown',
      role: 'Practice Manager',
      email: 'emily.brown@greenstreet.nhs.uk',
      phone: '020 7123 4567',
      isPrimary: true,
      preferredContact: 'Email'
    },
    {
      id: 2,
      name: 'Lisa Thompson',
      role: 'Admin Staff',
      email: 'lisa.t@greenstreet.nhs.uk',
      phone: '020 7123 4568',
      isPrimary: false,
      preferredContact: 'Phone'
    },
    {
      id: 3,
      name: 'Dr. Robert Singh',
      role: 'Clinical Contact',
      email: 'robert.singh@greenstreet.nhs.uk',
      phone: '020 7123 4569',
      isPrimary: false,
      preferredContact: 'Email'
    }
  ]);
  const [editingContact, setEditingContact] = useState(null);
  const [addingContact, setAddingContact] = useState(false);
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Practice Service Agreement 2024',
      type: 'Contract',
      uploadDate: '2024-01-15',
      size: '1.8 MB'
    },
    {
      id: 2,
      name: 'CQC Inspection Report',
      type: 'Compliance',
      uploadDate: '2023-12-10',
      size: '3.2 MB'
    }
  ]);
  const [editingDocument, setEditingDocument] = useState(null);
  const [addingDocument, setAddingDocument] = useState(false);
  const [notes, setNotes] = useState([
    {
      id: 1,
      type: 'Call',
      title: 'Monthly Check-in Call',
      description: 'Discussed staffing levels and upcoming training needs. Practice running smoothly.',
      date: '2024-01-22',
      user: 'Sarah Lee'
    },
    {
      id: 2,
      type: 'Email',
      title: 'Contract Renewal Discussion',
      description: 'Sent contract renewal documents. Practice manager confirmed receipt and will review.',
      date: '2024-01-19',
      user: 'John Smith'
    }
  ]);
  const [editingNote, setEditingNote] = useState(null);
  const [addingNote, setAddingNote] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const breadcrumbItems = practice.type === 'pcn-practice' && practice.pcnName
    ? [
        { label: 'Clients', onClick: () => setActivePage('clients') },
        { label: practice.pcnName, onClick: () => setActivePage('pcn-profile') },
        { label: 'Practices', onClick: () => setActivePage('pcn-profile') },
        { label: practice.name }
      ]
    : [
        { label: 'Clients', onClick: () => setActivePage('clients') },
        { label: 'Practices', onClick: () => setActivePage('practices') },
        { label: practice.name }
      ];

  const tabs = [
    { id: 'overview', label: 'Practice Overview', icon: Building2 },
    { id: 'contacts', label: 'Practice Contacts', icon: Users },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'notes', label: 'Notes & Communication', icon: MessageSquare },
    { id: 'performance', label: 'Performance', icon: BarChart3 }
  ];

  const handleEditPractice = (updatedPractice) => {
    setPractice(updatedPractice);
    setEditingPractice(null);
    alert('Practice updated successfully!');
  };

  const handleAddContact = (newContact) => {
    const maxId = Math.max(...contacts.map(c => c.id), 0);
    setContacts([...contacts, { ...newContact, id: maxId + 1 }]);
    setAddingContact(false);
    alert('Contact added successfully!');
  };

  const handleEditContact = (updatedContact) => {
    setContacts(contacts.map(c => c.id === updatedContact.id ? updatedContact : c));
    setEditingContact(null);
    alert('Contact updated successfully!');
  };

  const handleDeleteContact = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(contacts.filter(c => c.id !== id));
      alert('Contact deleted successfully!');
    }
  };

  const handleAddDocument = (newDocument) => {
    const maxId = Math.max(...documents.map(d => d.id), 0);
    setDocuments([...documents, { ...newDocument, id: maxId + 1, uploadDate: new Date().toISOString().split('T')[0], size: 'N/A' }]);
    setAddingDocument(false);
    alert('Document added successfully!');
  };

  const handleEditDocument = (updatedDocument) => {
    setDocuments(documents.map(d => d.id === updatedDocument.id ? updatedDocument : d));
    setEditingDocument(null);
    alert('Document updated successfully!');
  };

  const handleDeleteDocument = (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(d => d.id !== id));
      alert('Document deleted successfully!');
    }
  };

  const handleAddNote = (newNote) => {
    const maxId = Math.max(...notes.map(n => n.id), 0);
    setNotes([...notes, { ...newNote, id: maxId + 1, date: new Date().toISOString().split('T')[0], user: 'Current User' }]);
    setAddingNote(false);
    alert('Note added successfully!');
  };

  const handleEditNote = (updatedNote) => {
    setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
    setEditingNote(null);
    alert('Note updated successfully!');
  };

  const handleDeleteNote = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(n => n.id !== id));
      alert('Note deleted successfully!');
    }
  };

  const PracticeForm = ({ practice = {}, onSubmit }) => {
    const [formData, setFormData] = useState({
      name: practice.name || '',
      code: practice.code || '',
      type: practice.type || 'standalone',
      status: practice.status || 'Active',
      location: practice.location || '',
      address: practice.address || '',
      pcnName: practice.pcnName || '',
      manager: practice.manager || '',
      activeSince: practice.activeSince || ''
    });

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e) => {
      e.preventDefault();
      onSubmit({ ...practice, ...formData });
    };

    return (
      <form onSubmit={handleFormSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Name *</label>
          <input name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Code *</label>
          <input name="code" value={formData.code} onChange={handleChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Type *</label>
          <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg">
            <option value="standalone">Standalone</option>
            <option value="pcn-practice">PCN Practice</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Status *</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg">
            <option>Active</option>
            <option>Onboarding</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Location *</label>
          <input name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Address *</label>
          <input name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg" required />
        </div>
        {formData.type === 'pcn-practice' && (
          <div>
            <label className="block text-sm font-medium text-primary mb-1">PCN Name</label>
            <input name="pcnName" value={formData.pcnName} onChange={handleChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg" />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Manager *</label>
          <input name="manager" value={formData.manager} onChange={handleChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Active Since *</label>
          <input name="activeSince" type="date" value={formData.activeSince} onChange={handleChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg" required />
        </div>
        <div className="flex gap-2 pt-2">
          <button type="submit" className="flex-1 px-4 py-2 bg-core-primary-500 text-white rounded-lg">Save</button>
          <button type="button" onClick={() => setEditingPractice(null)} className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg">Cancel</button>
        </div>
      </form>
    );
  };

  const ContactForm = ({ contact = {}, onSubmit }) => {
    // Same as in PCNProfile
    const [formData, setFormData] = useState({
      name: contact.name || '',
      role: contact.role || '',
      email: contact.email || '',
      phone: contact.phone || '',
      isPrimary: contact.isPrimary || false,
      preferredContact: contact.preferredContact || 'Email'
    });

    const handleChange = (e) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setFormData({ ...formData, [e.target.name]: value });
    };

    const handleFormSubmit = (e) => {
      e.preventDefault();
      onSubmit({ ...contact, ...formData });
    };

    return (
      <form onSubmit={handleFormSubmit} className="space-y-3">
        {/* Fields same as above */}
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Name *</label>
          <input name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Role *</label>
          <input name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Email *</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Phone *</label>
          <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg" required />
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input name="isPrimary" type="checkbox" checked={formData.isPrimary} onChange={handleChange} className="rounded" />
            Primary Contact
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Preferred Contact *</label>
          <select name="preferredContact" value={formData.preferredContact} onChange={handleChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg">
            <option>Email</option>
            <option>Phone</option>
          </select>
        </div>
        <div className="flex gap-2 pt-2">
          <button type="submit" className="flex-1 px-4 py-2 bg-core-primary-500 text-white rounded-lg">Save</button>
          <button type="button" onClick={() => { setAddingContact(false); setEditingContact(null); }} className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg">Cancel</button>
        </div>
      </form>
    );
  };

  const DocumentForm = ({ document = {}, onSubmit }) => {
    // Same as in PCNProfile
    const [formData, setFormData] = useState({
      name: document.name || '',
      type: document.type || 'Contract'
    });

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e) => {
      e.preventDefault();
      onSubmit({ ...document, ...formData });
    };

    return (
      <form onSubmit={handleFormSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Name *</label>
          <input name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Type *</label>
          <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg">
            <option>Contract</option>
            <option>Compliance</option>
          </select>
        </div>
        <div className="flex gap-2 pt-2">
          <button type="submit" className="flex-1 px-4 py-2 bg-core-primary-500 text-white rounded-lg">Save</button>
          <button type="button" onClick={() => { setAddingDocument(false); setEditingDocument(null); }} className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg">Cancel</button>
        </div>
      </form>
    );
  };

  const NoteForm = ({ note = {}, onSubmit }) => {
    // Same as in PCNProfile
    const [formData, setFormData] = useState({
      type: note.type || 'Call',
      title: note.title || '',
      description: note.description || ''
    });

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e) => {
      e.preventDefault();
      onSubmit({ ...note, ...formData });
    };

    return (
      <form onSubmit={handleFormSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Type *</label>
          <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg">
            <option>Call</option>
            <option>Email</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Title *</label>
          <input name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Description *</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 bg-secondary border border-border rounded-lg h-24" required />
        </div>
        <div className="flex gap-2 pt-2">
          <button type="submit" className="flex-1 px-4 py-2 bg-core-primary-500 text-white rounded-lg">Save</button>
          <button type="button" onClick={() => { setAddingNote(false); setEditingNote(null); }} className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg">Cancel</button>
        </div>
      </form>
    );
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Practice Details */}
            <div className="bg-secondary rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Practice Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-secondary font-medium">Practice Code</label>
                  <p className="text-primary mt-1">{practice.code}</p>
                </div>
                <div>
                  <label className="text-sm text-secondary font-medium">Type</label>
                  <div className="mt-1">
                    {practice.type === 'standalone' ? (
                      <span className="px-3 py-1 bg-green-50 text-green-600 text-sm font-medium rounded-full">
                        Standalone Practice
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full">
                        PCN Practice
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-secondary font-medium">Address</label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin size={16} className="text-muted" />
                    <p className="text-primary">{practice.address}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-secondary font-medium">Practice Manager</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User size={16} className="text-muted" />
                    <p className="text-primary">{practice.manager}</p>
                  </div>
                </div>
                {practice.pcnName && (
                  <div>
                    <label className="text-sm text-secondary font-medium">Linked PCN</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Hospital size={16} className="text-muted" />
                      <p className="text-primary">{practice.pcnName}</p>
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm text-secondary font-medium">Active Since</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar size={16} className="text-muted" />
                    <p className="text-primary">{new Date(practice.activeSince).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-secondary font-medium">Status</label>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      practice.status === 'Active' 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-orange-50 text-orange-600'
                    }`}>
                      {practice.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="text-blue-500" size={24} />
                  <h3 className="font-semibold text-blue-900">Staff Members</h3>
                </div>
                <p className="text-3xl font-bold text-blue-600">12</p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="text-green-500" size={24} />
                  <h3 className="font-semibold text-green-900">Compliance Rate</h3>
                </div>
                <p className="text-3xl font-bold text-green-600">98%</p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="text-purple-500" size={24} />
                  <h3 className="font-semibold text-purple-900">Documents</h3>
                </div>
                <p className="text-3xl font-bold text-purple-600">{documents.length}</p>
              </div>
            </div>
          </div>
        );

      case 'contacts':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary">Practice Level Contacts</h3>
              <button onClick={() => setAddingContact(true)} className="flex items-center gap-2 px-4 py-2 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors">
                <Plus size={18} />
                <span>Add Contact</span>
              </button>
            </div>

            {contacts.length === 0 ? (
              <div className="text-center py-12 bg-secondary rounded-xl">
                <p className="text-secondary">No contacts found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="bg-secondary rounded-xl border border-border p-6 hover:shadow-md transition-all relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-core-primary-500 to-core-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary">{contact.name}</h4>
                          <p className="text-sm text-secondary">{contact.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {contact.isPrimary && (
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                            Primary Contact
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === contact.id ? null : contact.id);
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <MoreVertical size={20} className="text-muted" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-muted" />
                        <span className="text-sm text-primary">{contact.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-muted" />
                        <span className="text-sm text-primary">{contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-muted" />
                        <span className="text-sm text-primary">Prefers: {contact.preferredContact}</span>
                      </div>
                    </div>

                    {/* Actions Dropdown */}
                    {openMenuId === contact.id && (
                      <div className="absolute right-4 top-12 bg-white border border-border rounded-lg shadow-lg z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingContact(contact);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteContact(contact.id);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 text-red-600"
                        >
                          <Trash size={16} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary">Practice Documents</h3>
              <button onClick={() => setAddingDocument(true)} className="flex items-center gap-2 px-4 py-2 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors">
                <Plus size={18} />
                <span>Upload Document</span>
              </button>
            </div>

            {documents.length === 0 ? (
              <div className="text-center py-12 bg-secondary rounded-xl">
                <p className="text-secondary">No documents found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-secondary rounded-xl border border-border p-4 hover:shadow-md transition-all cursor-pointer group relative" onClick={() => setEditingDocument(doc)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                          <FileText className="text-red-500" size={20} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary group-hover:text-core-primary-500 transition-colors">
                            {doc.name}
                          </h4>
                          <p className="text-sm text-secondary">{doc.type} • {doc.size} • {doc.uploadDate}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === doc.id ? null : doc.id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <MoreVertical size={20} className="text-muted" />
                      </button>
                    </div>

                    {/* Actions Dropdown */}
                    {openMenuId === doc.id && (
                      <div className="absolute right-4 top-4 bg-white border border-border rounded-lg shadow-lg z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingDocument(doc);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDocument(doc.id);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 text-red-600"
                        >
                          <Trash size={16} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'notes':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary">Communication Log</h3>
              <button onClick={() => setAddingNote(true)} className="flex items-center gap-2 px-4 py-2 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors">
                <Plus size={18} />
                <span>Add Note</span>
              </button>
            </div>

            {notes.length === 0 ? (
              <div className="text-center py-12 bg-secondary rounded-xl">
                <p className="text-secondary">No notes found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="bg-secondary rounded-xl border border-border p-6 relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          note.type === 'Call' ? 'bg-green-50' : note.type === 'Email' ? 'bg-blue-50' : 'bg-purple-50'
                        }`}>
                          <MessageSquare className={
                            note.type === 'Call' ? 'text-green-500' : 
                            note.type === 'Email' ? 'text-blue-500' : 
                            'text-purple-500'
                          } size={20} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary">{note.title}</h4>
                          <p className="text-sm text-secondary">{note.type} • {note.date} • {note.user}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === note.id ? null : note.id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <MoreVertical size={20} className="text-muted" />
                      </button>
                    </div>
                    <p className="text-primary text-sm ml-13">{note.description}</p>

                    {/* Actions Dropdown */}
                    {openMenuId === note.id && (
                      <div className="absolute right-4 top-4 bg-white border border-border rounded-lg shadow-lg z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingNote(note);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note.id);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 text-red-600"
                        >
                          <Trash size={16} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-6">
            <div className="bg-secondary rounded-xl border border-border p-8 text-center">
              <div className="w-20 h-20 bg-core-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="text-core-primary-500" size={40} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Performance Metrics</h3>
              <p className="text-secondary">This section will include practice KPIs, usage metrics, and performance data.</p>
              <p className="text-secondary text-sm mt-2">Coming in a later phase</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} onNavigate={setActivePage} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
              practice.type === 'standalone' ? 'bg-green-50' : 'bg-blue-50'
            }`}>
              <Building2 className={practice.type === 'standalone' ? 'text-green-500' : 'text-blue-500'} size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-primary">{practice.name}</h1>
                {practice.type === 'standalone' ? (
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">
                    Standalone
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                    PCN Practice
                  </span>
                )}
              </div>
              <p className="text-secondary">{practice.code}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
            practice.status === 'Active'
              ? 'bg-green-50 text-green-600'
              : 'bg-orange-50 text-orange-600'
          }`}>
            {practice.status}
          </span>
          <button onClick={() => setEditingPractice(practice)} className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg hover:bg-core-primary-50 hover:text-core-primary-500 hover:border-core-primary-500 transition-all">
            <Edit size={18} />
            <span>Edit Practice</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-core-primary-500 text-core-primary-500'
                    : 'border-transparent text-secondary hover:text-core-primary-500'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {renderTabContent()}
      </div>

      {/* Modals */}
      {editingPractice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-xl p-6 max-w-lg w-full">
            <h2 className="text-2xl font-bold text-primary mb-4">Edit Practice</h2>
            <PracticeForm practice={editingPractice} onSubmit={handleEditPractice} />
          </div>
        </div>
      )}

      {(addingContact || editingContact) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-xl p-6 max-w-lg w-full">
            <h2 className="text-2xl font-bold text-primary mb-4">{editingContact ? 'Edit Contact' : 'Add Contact'}</h2>
            <ContactForm contact={editingContact || {}} onSubmit={editingContact ? handleEditContact : handleAddContact} />
          </div>
        </div>
      )}

      {(addingDocument || editingDocument) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-xl p-6 max-w-lg w-full">
            <h2 className="text-2xl font-bold text-primary mb-4">{editingDocument ? 'Edit Document' : 'Add Document'}</h2>
            <DocumentForm document={editingDocument || {}} onSubmit={editingDocument ? handleEditDocument : handleAddDocument} />
          </div>
        </div>
      )}

      {(addingNote || editingNote) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-xl p-6 max-w-lg w-full">
            <h2 className="text-2xl font-bold text-primary mb-4">{editingNote ? 'Edit Note' : 'Add Note'}</h2>
            <NoteForm note={editingNote || {}} onSubmit={editingNote ? handleEditNote : handleAddNote} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeProfile;