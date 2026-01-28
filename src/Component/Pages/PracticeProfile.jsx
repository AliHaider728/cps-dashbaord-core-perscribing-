import React, { useState } from 'react';
import { 
  Building2, MapPin, User, Phone, Mail, Hospital,
  FileText, MessageSquare, Plus, Edit, Users, Calendar,
  CheckCircle, BarChart3, MoreVertical, Trash, X, Download
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
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'notes', label: 'Notes', icon: MessageSquare },
    { id: 'performance', label: 'Performance', icon: BarChart3 }
  ];

  const handleEditPractice = (updatedPractice) => {
    setPractice(updatedPractice);
    setEditingPractice(null);
  };

  const handleAddContact = (newContact) => {
    const maxId = Math.max(...contacts.map(c => c.id), 0);
    setContacts([...contacts, { ...newContact, id: maxId + 1 }]);
    setAddingContact(false);
  };

  const handleEditContact = (updatedContact) => {
    setContacts(contacts.map(c => c.id === updatedContact.id ? updatedContact : c));
    setEditingContact(null);
  };

  const handleDeleteContact = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(contacts.filter(c => c.id !== id));
    }
  };

  const handleAddDocument = (newDocument) => {
    const maxId = Math.max(...documents.map(d => d.id), 0);
    setDocuments([...documents, { ...newDocument, id: maxId + 1, uploadDate: new Date().toISOString().split('T')[0], size: 'N/A' }]);
    setAddingDocument(false);
  };

  const handleEditDocument = (updatedDocument) => {
    setDocuments(documents.map(d => d.id === updatedDocument.id ? updatedDocument : d));
    setEditingDocument(null);
  };

  const handleDeleteDocument = (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(d => d.id !== id));
    }
  };

  const handleAddNote = (newNote) => {
    const maxId = Math.max(...notes.map(n => n.id), 0);
    setNotes([...notes, { ...newNote, id: maxId + 1, date: new Date().toISOString().split('T')[0], user: 'Current User' }]);
    setAddingNote(false);
  };

  const handleEditNote = (updatedNote) => {
    setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
    setEditingNote(null);
  };

  const handleDeleteNote = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(n => n.id !== id));
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

    return (
      <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...practice, ...formData }); }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Practice Name</label>
            <input 
              name="name" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500 transition-all" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Code</label>
            <input 
              name="code" 
              value={formData.code} 
              onChange={(e) => setFormData({ ...formData, code: e.target.value })} 
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500 transition-all" 
              required 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Type</label>
            <select 
              value={formData.type} 
              onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500 transition-all"
            >
              <option value="standalone">Standalone</option>
              <option value="pcn-practice">PCN Practice</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Status</label>
            <select 
              value={formData.status} 
              onChange={(e) => setFormData({ ...formData, status: e.target.value })} 
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500 transition-all"
            >
              <option>Active</option>
              <option>Onboarding</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Location</label>
          <input 
            value={formData.location} 
            onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
            className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500 transition-all" 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Address</label>
          <input 
            value={formData.address} 
            onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
            className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500 transition-all" 
            required 
          />
        </div>

        {formData.type === 'pcn-practice' && (
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">PCN Name</label>
            <input 
              value={formData.pcnName} 
              onChange={(e) => setFormData({ ...formData, pcnName: e.target.value })} 
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500 transition-all" 
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Manager</label>
            <input 
              value={formData.manager} 
              onChange={(e) => setFormData({ ...formData, manager: e.target.value })} 
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500 transition-all" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Active Since</label>
            <input 
              type="date" 
              value={formData.activeSince} 
              onChange={(e) => setFormData({ ...formData, activeSince: e.target.value })} 
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500 transition-all" 
              required 
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" className="flex-1 px-4 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors font-medium">
            Save Changes
          </button>
          <button type="button" onClick={() => setEditingPractice(null)} className="flex-1 px-4 py-2.5 bg-secondary border border-border rounded-lg hover:bg-primary transition-colors font-medium text-primary">
            Cancel
          </button>
        </div>
      </form>
    );
  };

  const ContactForm = ({ contact = {}, onSubmit }) => {
    const [formData, setFormData] = useState({
      name: contact.name || '',
      role: contact.role || '',
      email: contact.email || '',
      phone: contact.phone || '',
      isPrimary: contact.isPrimary || false,
      preferredContact: contact.preferredContact || 'Email'
    });

    return (
      <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...contact, ...formData }); }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Name</label>
            <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500 transition-all" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Role</label>
            <input value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500 transition-all" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Email</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500 transition-all" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Phone</label>
          <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500 transition-all" required />
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.isPrimary} onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })} className="w-4 h-4 rounded border-border text-core-primary-500 focus:ring-core-primary-500" />
            <span className="text-sm font-medium text-primary">Primary Contact</span>
          </label>
          <div className="flex-1">
            <label className="block text-sm font-medium text-primary mb-1.5">Preferred Contact</label>
            <select value={formData.preferredContact} onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500 transition-all">
              <option>Email</option>
              <option>Phone</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" className="flex-1 px-4 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors font-medium">Save Contact</button>
          <button type="button" onClick={() => { setAddingContact(false); setEditingContact(null); }} className="flex-1 px-4 py-2.5 bg-secondary border border-border rounded-lg hover:bg-primary transition-colors font-medium text-primary">Cancel</button>
        </div>
      </form>
    );
  };

  const DocumentForm = ({ document = {}, onSubmit }) => {
    const [formData, setFormData] = useState({
      name: document.name || '',
      type: document.type || 'Contract'
    });

    return (
      <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...document, ...formData }); }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Document Name</label>
          <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500 transition-all" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Type</label>
          <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500 transition-all">
            <option>Contract</option>
            <option>Compliance</option>
            <option>Report</option>
          </select>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" className="flex-1 px-4 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors font-medium">Save Document</button>
          <button type="button" onClick={() => { setAddingDocument(false); setEditingDocument(null); }} className="flex-1 px-4 py-2.5 bg-secondary border border-border rounded-lg hover:bg-primary transition-colors font-medium text-primary">Cancel</button>
        </div>
      </form>
    );
  };

  const NoteForm = ({ note = {}, onSubmit }) => {
    const [formData, setFormData] = useState({
      type: note.type || 'Call',
      title: note.title || '',
      description: note.description || ''
    });

    return (
      <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...note, ...formData }); }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Type</label>
          <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500 transition-all">
            <option>Call</option>
            <option>Email</option>
            <option>Meeting</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Title</label>
          <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500 transition-all" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Description</label>
          <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg h-28 resize-none focus:outline-none focus:ring-2 focus:ring-core-primary-500 transition-all" required />
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" className="flex-1 px-4 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors font-medium">Save Note</button>
          <button type="button" onClick={() => { setAddingNote(false); setEditingNote(null); }} className="flex-1 px-4 py-2.5 bg-secondary border border-border rounded-lg hover:bg-primary transition-colors font-medium text-primary">Cancel</button>
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
            <div className="bg-secondary rounded-xl border border-border p-8">
              <h3 className="text-lg font-semibold text-primary mb-6">Practice Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted font-medium mb-1.5 block">Practice Code</label>
                  <p className="text-primary font-medium">{practice.code}</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted font-medium mb-1.5 block">Type</label>
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                    practice.type === 'standalone' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {practice.type === 'standalone' ? 'Standalone Practice' : 'PCN Practice'}
                  </span>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted font-medium mb-1.5 block">Address</label>
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-muted mt-0.5 shrink-0" />
                    <p className="text-primary">{practice.address}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted font-medium mb-1.5 block">Practice Manager</label>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-muted shrink-0" />
                    <p className="text-primary font-medium">{practice.manager}</p>
                  </div>
                </div>
                {practice.pcnName && (
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted font-medium mb-1.5 block">Linked PCN</label>
                    <div className="flex items-center gap-2">
                      <Hospital size={16} className="text-muted shrink-0" />
                      <p className="text-primary font-medium">{practice.pcnName}</p>
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted font-medium mb-1.5 block">Active Since</label>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-muted shrink-0" />
                    <p className="text-primary">{new Date(practice.activeSince).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/60 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Users className="text-white" size={20} />
                  </div>
                  <h3 className="font-semibold text-blue-900">Staff Members</h3>
                </div>
                <p className="text-3xl font-bold text-blue-600">12</p>
                <p className="text-sm text-blue-600/70 mt-1">Active staff</p>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/60 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="text-white" size={20} />
                  </div>
                  <h3 className="font-semibold text-emerald-900">Compliance</h3>
                </div>
                <p className="text-3xl font-bold text-emerald-600">98%</p>
                <p className="text-sm text-emerald-600/70 mt-1">Overall rate</p>
              </div>
              
              <div className="bg-gradient-to-br from-violet-50 to-violet-100/50 border border-violet-200/60 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-violet-500 rounded-lg flex items-center justify-center">
                    <FileText className="text-white" size={20} />
                  </div>
                  <h3 className="font-semibold text-violet-900">Documents</h3>
                </div>
                <p className="text-3xl font-bold text-violet-600">{documents.length}</p>
                <p className="text-sm text-violet-600/70 mt-1">Total files</p>
              </div>
            </div>
          </div>
        );

      case 'contacts':
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-primary">Practice Contacts</h3>
                <p className="text-sm text-muted mt-0.5">Manage key contact persons for this practice</p>
              </div>
              <button onClick={() => setAddingContact(true)} className="flex items-center gap-2 px-4 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-all hover:shadow-md font-medium">
                <Plus size={18} />
                <span>Add Contact</span>
              </button>
            </div>

            {contacts.length === 0 ? (
              <div className="text-center py-16 bg-secondary rounded-xl border border-border border-dashed">
                <Users className="mx-auto text-muted mb-3" size={48} />
                <p className="text-secondary font-medium">No contacts found</p>
                <p className="text-muted text-sm mt-1">Add your first contact to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="bg-secondary rounded-xl border border-border p-6 hover:shadow-lg hover:border-core-primary-200 transition-all relative group">
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === contact.id ? null : contact.id);
                          }}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <MoreVertical size={18} className="text-muted" />
                        </button>
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
                    </div>

                    {openMenuId === contact.id && (
                      <div className="absolute right-4 top-16 bg-white border border-border rounded-lg shadow-xl z-20 min-w-[140px] overflow-hidden">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingContact(contact);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 w-full text-left hover:bg-gray-50 transition-colors text-sm font-medium"
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
                          className="flex items-center gap-2 px-4 py-2.5 w-full text-left hover:bg-red-50 transition-colors text-red-600 text-sm font-medium"
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
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-primary">Documents</h3>
                <p className="text-sm text-muted mt-0.5">Important files and documentation</p>
              </div>
              <button onClick={() => setAddingDocument(true)} className="flex items-center gap-2 px-4 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-all hover:shadow-md font-medium">
                <Plus size={18} />
                <span>Upload Document</span>
              </button>
            </div>

            {documents.length === 0 ? (
              <div className="text-center py-16 bg-secondary rounded-xl border border-border border-dashed">
                <FileText className="mx-auto text-muted mb-3" size={48} />
                <p className="text-secondary font-medium">No documents uploaded</p>
                <p className="text-muted text-sm mt-1">Upload your first document to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-secondary rounded-xl border border-border p-5 hover:shadow-lg hover:border-core-primary-200 transition-all group relative">
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === doc.id ? null : doc.id);
                          }}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <MoreVertical size={18} className="text-muted" />
                        </button>
                      </div>
                    </div>

                    {openMenuId === doc.id && (
                      <div className="absolute right-4 top-4 bg-white border border-border rounded-lg shadow-xl z-20 min-w-[140px] overflow-hidden">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingDocument(doc);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 w-full text-left hover:bg-gray-50 transition-colors text-sm font-medium"
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
                          className="flex items-center gap-2 px-4 py-2.5 w-full text-left hover:bg-red-50 transition-colors text-red-600 text-sm font-medium"
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
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-primary">Communication Log</h3>
                <p className="text-sm text-muted mt-0.5">Track all interactions and notes</p>
              </div>
              <button onClick={() => setAddingNote(true)} className="flex items-center gap-2 px-4 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-all hover:shadow-md font-medium">
                <Plus size={18} />
                <span>Add Note</span>
              </button>
            </div>

            {notes.length === 0 ? (
              <div className="text-center py-16 bg-secondary rounded-xl border border-border border-dashed">
                <MessageSquare className="mx-auto text-muted mb-3" size={48} />
                <p className="text-secondary font-medium">No notes found</p>
                <p className="text-muted text-sm mt-1">Add your first note to track communications</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="bg-secondary rounded-xl border border-border p-6 hover:shadow-lg hover:border-core-primary-200 transition-all relative group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                          note.type === 'Call' ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200' : 
                          note.type === 'Email' ? 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200' : 
                          'bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200'
                        }`}>
                          <MessageSquare className={
                            note.type === 'Call' ? 'text-emerald-600' : 
                            note.type === 'Email' ? 'text-blue-600' : 
                            'text-violet-600'
                          } size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-primary text-base">{note.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              note.type === 'Call' ? 'bg-emerald-100 text-emerald-700' : 
                              note.type === 'Email' ? 'bg-blue-100 text-blue-700' : 
                              'bg-violet-100 text-violet-700'
                            }`}>
                              {note.type}
                            </span>
                            <span className="text-xs text-muted">•</span>
                            <span className="text-xs text-muted">{new Date(note.date).toLocaleDateString('en-GB')}</span>
                            <span className="text-xs text-muted">•</span>
                            <span className="text-xs text-muted">{note.user}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === note.id ? null : note.id);
                        }}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical size={18} className="text-muted" />
                      </button>
                    </div>
                    <p className="text-primary text-sm leading-relaxed pl-15">{note.description}</p>

                    {openMenuId === note.id && (
                      <div className="absolute right-4 top-4 bg-white border border-border rounded-lg shadow-xl z-20 min-w-[140px] overflow-hidden">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingNote(note);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 w-full text-left hover:bg-gray-50 transition-colors text-sm font-medium"
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
                          className="flex items-center gap-2 px-4 py-2.5 w-full text-left hover:bg-red-50 transition-colors text-red-600 text-sm font-medium"
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
            <div className="bg-secondary rounded-xl border border-border p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-core-primary-50 to-core-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-core-primary-200">
                <BarChart3 className="text-core-primary-500" size={40} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Performance Metrics</h3>
              <p className="text-secondary max-w-md mx-auto">Track practice KPIs, usage metrics, and performance data in this section.</p>
              <p className="text-muted text-sm mt-3 font-medium">Coming soon in a later phase</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} onNavigate={setActivePage} />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md ${
            practice.type === 'standalone' 
              ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' 
              : 'bg-gradient-to-br from-blue-400 to-blue-600'
          }`}>
            <Building2 className="text-white" size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-primary">{practice.name}</h1>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                practice.type === 'standalone' 
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                  : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}>
                {practice.type === 'standalone' ? 'Standalone' : 'PCN Practice'}
              </span>
            </div>
            <p className="text-muted font-medium">{practice.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm ${
            practice.status === 'Active'
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              : 'bg-orange-100 text-orange-700 border border-orange-200'
          }`}>
            {practice.status}
          </span>
          <button onClick={() => setEditingPractice(practice)} className="flex items-center gap-2 px-5 py-2.5 bg-secondary border border-border rounded-lg hover:bg-core-primary-50 hover:text-core-primary-600 hover:border-core-primary-300 transition-all font-medium shadow-sm">
            <Edit size={18} />
            <span>Edit Practice</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-secondary rounded-t-xl">
        <div className="flex gap-1 overflow-x-auto px-2 pt-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-t-lg transition-all whitespace-nowrap font-medium ${
                  activeTab === tab.id
                    ? 'bg-white text-core-primary-600 border-b-2 border-core-primary-500 shadow-sm'
                    : 'text-muted hover:text-primary hover:bg-primary'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>

      {/* Modals */}
      {editingPractice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">Edit Practice</h2>
              <button onClick={() => setEditingPractice(null)} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <PracticeForm practice={editingPractice} onSubmit={handleEditPractice} />
          </div>
        </div>
      )}

      {(addingContact || editingContact) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">{editingContact ? 'Edit Contact' : 'Add Contact'}</h2>
              <button onClick={() => { setAddingContact(false); setEditingContact(null); }} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <ContactForm contact={editingContact || {}} onSubmit={editingContact ? handleEditContact : handleAddContact} />
          </div>
        </div>
      )}

      {(addingDocument || editingDocument) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">{editingDocument ? 'Edit Document' : 'Add Document'}</h2>
              <button onClick={() => { setAddingDocument(false); setEditingDocument(null); }} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <DocumentForm document={editingDocument || {}} onSubmit={editingDocument ? handleEditDocument : handleAddDocument} />
          </div>
        </div>
      )}

      {(addingNote || editingNote) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">{editingNote ? 'Edit Note' : 'Add Note'}</h2>
              <button onClick={() => { setAddingNote(false); setEditingNote(null); }} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <NoteForm note={editingNote || {}} onSubmit={editingNote ? handleEditNote : handleAddNote} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeProfile;