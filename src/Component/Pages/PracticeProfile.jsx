import React, { useState } from 'react';
import { 
  Building2, MapPin, User, Phone, Mail, Hospital,
  FileText, MessageSquare, Plus, Edit, Users, Calendar,
  CheckCircle, BarChart3
} from 'lucide-react';
import Breadcrumb from '../Breadcrumb.jsx'

const PracticeProfile = ({ practiceData, onBack, setActivePage }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with real data
  const practice = practiceData || {
    id: 1,
    name: 'Green Street Surgery',
    code: 'PR001',
    type: 'standalone', // or 'pcn-practice'
    status: 'Active',
    location: 'London',
    address: '123 Green Street, London, E1 1AB',
    pcnName: null, // 'Bradford PCN' if part of PCN
    pcnId: null,
    manager: 'Dr. Emily Brown',
    activeSince: '2018-03-15'
  };

  // Breadcrumb logic based on practice type
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

  const mockContacts = [
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
  ];

  const mockDocuments = [
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
  ];

  const mockNotes = [
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
  ];

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
                <p className="text-3xl font-bold text-purple-600">{mockDocuments.length}</p>
              </div>
            </div>
          </div>
        );

      case 'contacts':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary">Practice Level Contacts</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors">
                <Plus size={18} />
                <span>Add Contact</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {mockContacts.map((contact) => (
                <div key={contact.id} className="bg-secondary rounded-xl border border-border p-6 hover:shadow-md transition-all">
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
                    {contact.isPrimary && (
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                        Primary Contact
                      </span>
                    )}
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
                </div>
              ))}
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary">Practice Documents</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors">
                <Plus size={18} />
                <span>Upload Document</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {mockDocuments.map((doc) => (
                <div key={doc.id} className="bg-secondary rounded-xl border border-border p-4 hover:shadow-md transition-all cursor-pointer group">
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary">Communication Log</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors">
                <Plus size={18} />
                <span>Add Note</span>
              </button>
            </div>

            <div className="space-y-3">
              {mockNotes.map((note) => (
                <div key={note.id} className="bg-secondary rounded-xl border border-border p-6">
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
                  </div>
                  <p className="text-primary text-sm ml-13">{note.description}</p>
                </div>
              ))}
            </div>
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
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg hover:bg-core-primary-50 hover:text-core-primary-500 hover:border-core-primary-500 transition-all">
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
    </div>
  );
};

export default PracticeProfile;