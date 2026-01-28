import React, { useState } from 'react';
import { Hospital, Edit } from 'lucide-react';
import Breadcrumb from '../Breadcrumb.jsx';
import PCNOverview from './PCN-Tabs/Pcnoverview.jsx';
import PCNContacts from './PCN-Tabs/Pcncontacts.jsx'
import PCNPractices from './PCN-Tabs/Pcnpractices.jsx';
import PCNDocuments from './PCN-Tabs/Pcndocuments.jsx';
import PCNNotes from './PCN-Tabs/Pcnnotes.jsx';

const PCNProfile = ({ pcnData, onBack, onSelectPractice, setActivePage }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [editingPcn, setEditingPcn] = useState(null);

  // State Management
  const [pcn, setPcn] = useState(pcnData || {
    id: 1,
    name: 'Bradford PCN',
    code: 'PCN001',
    status: 'Active',
    region: 'Yorkshire',
    accountManager: 'John Smith',
    activeSince: '2020-04-01',
    totalPractices: 5,
    totalPatients: 45000
  });

  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'PCN Manager',
      email: 'sarah.j@bradford-pcn.nhs.uk',
      phone: '0113 123 4567',
      isPrimary: true,
      preferredContact: 'Email'
    },
    {
      id: 2,
      name: 'Mark Williams',
      role: 'Finance Contact',
      email: 'mark.w@bradford-pcn.nhs.uk',
      phone: '0113 123 4568',
      isPrimary: false,
      preferredContact: 'Phone'
    },
    {
      id: 3,
      name: 'Dr. Emma Clarke',
      role: 'Clinical Lead',
      email: 'emma.c@bradford-pcn.nhs.uk',
      phone: '0113 123 4569',
      isPrimary: false,
      preferredContact: 'Email'
    }
  ]);

  const [practices, setPractices] = useState([
    {
      id: 1,
      name: 'Oak Medical Centre',
      code: 'PR002',
      location: 'Bradford City Centre',
      status: 'Active',
      manager: 'Dr. James Wilson',
      patients: 12500
    },
    {
      id: 2,
      name: 'Willow Health Practice',
      code: 'PR005',
      location: 'Bradford North',
      status: 'Active',
      manager: 'Dr. Lisa Brown',
      patients: 10200
    },
    {
      id: 3,
      name: 'Maple Surgery',
      code: 'PR008',
      location: 'Bradford South',
      status: 'Active',
      manager: 'Dr. Ahmed Khan',
      patients: 11800
    },
    {
      id: 4,
      name: 'Cedar Health Centre',
      code: 'PR012',
      location: 'Bradford West',
      status: 'Active',
      manager: 'Dr. Rachel Green',
      patients: 8200
    },
    {
      id: 5,
      name: 'Pine Grove Practice',
      code: 'PR015',
      location: 'Bradford East',
      status: 'Onboarding',
      manager: 'Dr. David Chen',
      patients: 2300
    }
  ]);

  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'PCN Service Agreement 2024',
      type: 'Contract',
      uploadDate: '2024-01-15',
      size: '2.4 MB'
    },
    {
      id: 2,
      name: 'Data Sharing Agreement',
      type: 'Compliance',
      uploadDate: '2024-01-10',
      size: '1.8 MB'
    },
    {
      id: 3,
      name: 'Quality Report Q4 2023',
      type: 'Report',
      uploadDate: '2023-12-20',
      size: '3.2 MB'
    }
  ]);

  const [notes, setNotes] = useState([
    {
      id: 1,
      type: 'Call',
      title: 'Quarterly Review Call',
      description: 'Discussed performance metrics and upcoming contract renewal',
      date: '2024-01-20',
      user: 'John Smith',
      priority: 'High'
    },
    {
      id: 2,
      type: 'Meeting',
      title: 'Site Visit - Bradford PCN',
      description: 'Met with PCN manager and clinical lead. All practices performing well.',
      date: '2024-01-18',
      user: 'Sarah Lee',
      priority: 'Medium'
    },
    {
      id: 3,
      type: 'Email',
      title: 'Contract Amendment Request',
      description: 'PCN requested changes to service delivery schedule',
      date: '2024-01-15',
      user: 'John Smith',
      priority: 'Medium'
    }
  ]);

  // Breadcrumb
  const breadcrumbItems = [
    { label: 'Clients', onClick: () => setActivePage('clients') },
    { label: 'PCNs', onClick: () => setActivePage('pcns') },
    { label: pcn.name }
  ];

  // Tabs Configuration
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'contacts', label: 'Contacts' },
    { id: 'practices', label: 'Practices' },
    { id: 'documents', label: 'Documents' },
    { id: 'notes', label: 'Notes' }
  ];

  // Handler Functions
  const handleUpdatePcn = (updatedPcn) => {
    setPcn(updatedPcn);
    setEditingPcn(null);
  };

  const handleDeletePcn = (pcnId) => {
    if (window.confirm('Are you sure you want to delete this PCN?')) {
      if (onBack) onBack();
    }
  };

  const handleAddContact = (newContact) => {
    setContacts([...contacts, newContact]);
  };

  const handleUpdateContact = (updatedContact) => {
    setContacts(contacts.map(c => c.id === updatedContact.id ? updatedContact : c));
  };

  const handleDeleteContact = (contactId) => {
    setContacts(contacts.filter(c => c.id !== contactId));
  };

  const handleUpdatePractice = (updatedPractice) => {
    setPractices(practices.map(p => p.id === updatedPractice.id ? updatedPractice : p));
  };

  const handleDeletePractice = (practiceId) => {
    setPractices(practices.filter(p => p.id !== practiceId));
  };

  const handleAddDocument = (newDocument) => {
    setDocuments([...documents, newDocument]);
  };

  const handleDeleteDocument = (documentId) => {
    setDocuments(documents.filter(d => d.id !== documentId));
  };

  const handleAddNote = (newNote) => {
    setNotes([newNote, ...notes]);
  };

  const handleUpdateNote = (updatedNote) => {
    setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
  };

  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter(n => n.id !== noteId));
  };

  // Render Tab Content
  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <PCNOverview 
            pcn={pcn}
            practices={practices}
            notes={notes}
            onUpdate={handleUpdatePcn}
            onDelete={handleDeletePcn}
          />
        );

      case 'contacts':
        return (
          <PCNContacts 
            contacts={contacts}
            onAddContact={handleAddContact}
            onUpdateContact={handleUpdateContact}
            onDeleteContact={handleDeleteContact}
          />
        );

      case 'practices':
        return (
          <PCNPractices 
            practices={practices}
            onSelectPractice={onSelectPractice}
            onUpdatePractice={handleUpdatePractice}
            onDeletePractice={handleDeletePractice}
          />
        );

      case 'documents':
        return (
          <PCNDocuments 
            documents={documents}
            onAddDocument={handleAddDocument}
            onDeleteDocument={handleDeleteDocument}
          />
        );

      case 'notes':
        return (
          <PCNNotes 
            notes={notes}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} onNavigate={setActivePage} />

      {/* Header - Clean and Professional */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md bg-gradient-to-br from-blue-400 to-blue-600">
            <Hospital className="text-white" size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-primary">{pcn.name}</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                PCN
              </span>
            </div>
            <p className="text-muted font-medium">{pcn.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm ${
            pcn.status === 'Active'
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              : 'bg-orange-100 text-orange-700 border border-orange-200'
          }`}>
            {pcn.status}
          </span>
          <button 
            onClick={() => setEditingPcn(pcn)} 
            className="flex items-center gap-2 px-5 py-2.5 bg-secondary border border-border rounded-lg hover:bg-core-primary-50 hover:text-core-primary-600 hover:border-core-primary-300 transition-all font-medium shadow-sm"
          >
            <Edit size={18} />
            <span>Edit PCN</span>
          </button>
        </div>
      </div>

      {/* Tabs - Clean Design */}
      <div className="border-b border-border bg-secondary rounded-t-xl">
        <div className="flex gap-1 overflow-x-auto px-2 pt-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-t-lg transition-all whitespace-nowrap font-medium ${
                activeTab === tab.id
                  ? 'bg-white text-core-primary-600 border-b-2 border-core-primary-500 shadow-sm'
                  : 'text-muted hover:text-primary hover:bg-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PCNProfile;