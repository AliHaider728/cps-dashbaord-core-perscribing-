import React, { useState } from 'react';
import { Hospital } from 'lucide-react';
import Breadcrumb from '../Breadcrumb.jsx';
import PCNOverview from './PCN-Tabs/Pcnoverview.jsx';
import PCNContacts from './PCN-Tabs/Pcncontacts.jsx'
import PCNPractices from './PCN-Tabs/Pcnpractices.jsx';
import PCNDocuments from './PCN-Tabs/Pcndocuments.jsx';
import PCNNotes from './PCN-Tabs/Pcnnotes.jsx';

const PCNProfile = ({ pcnData, onBack, onSelectPractice, setActivePage }) => {
  const [activeTab, setActiveTab] = useState('overview');

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
    { id: 'overview', label: 'PCN Overview' },
    { id: 'contacts', label: 'PCN Contacts' },
    { id: 'practices', label: 'Practices' },
    { id: 'documents', label: 'Documents' },
    { id: 'notes', label: 'Notes & Activity' }
  ];

  // Handler Functions
  const handleUpdatePcn = (updatedPcn) => {
    setPcn(updatedPcn);
    console.log('PCN updated:', updatedPcn);
  };

  const handleDeletePcn = (pcnId) => {
    console.log('Delete PCN:', pcnId);
    if (onBack) onBack();
  };

  const handleAddContact = (newContact) => {
    setContacts([...contacts, newContact]);
    console.log('Contact added:', newContact);
  };

  const handleUpdateContact = (updatedContact) => {
    setContacts(contacts.map(c => c.id === updatedContact.id ? updatedContact : c));
    console.log('Contact updated:', updatedContact);
  };

  const handleDeleteContact = (contactId) => {
    setContacts(contacts.filter(c => c.id !== contactId));
    console.log('Contact deleted:', contactId);
  };

  const handleUpdatePractice = (updatedPractice) => {
    setPractices(practices.map(p => p.id === updatedPractice.id ? updatedPractice : p));
    console.log('Practice updated:', updatedPractice);
  };

  const handleDeletePractice = (practiceId) => {
    setPractices(practices.filter(p => p.id !== practiceId));
    console.log('Practice removed:', practiceId);
  };

  const handleAddDocument = (newDocument) => {
    setDocuments([...documents, newDocument]);
    console.log('Document added:', newDocument);
  };

  const handleDeleteDocument = (documentId) => {
    setDocuments(documents.filter(d => d.id !== documentId));
    console.log('Document deleted:', documentId);
  };

  const handleAddNote = (newNote) => {
    setNotes([newNote, ...notes]);
    console.log('Note added:', newNote);
  };

  const handleUpdateNote = (updatedNote) => {
    setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
    console.log('Note updated:', updatedNote);
  };

  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter(n => n.id !== noteId));
    console.log('Note deleted:', noteId);
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

      {/* Header - Enhanced with Dark Mode */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-core-primary-900/20 dark:via-core-primary-800/20 dark:to-purple-900/20 border border-blue-200 dark:border-core-primary-700/30 rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-core-primary-600 dark:to-core-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Hospital className="text-white" size={40} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{pcn.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 font-semibold text-lg">{pcn.code}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm ${
              pcn.status === 'Active'
                ? 'bg-green-100 text-green-700 border border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700/50'
                : 'bg-orange-100 text-orange-700 border border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700/50'
            }`}>
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                pcn.status === 'Active' ? 'bg-green-500' : 'bg-orange-500'
              }`}></span>
              {pcn.status}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs - Enhanced with Dark Mode */}
      <div className="bg-white dark:bg-core-surface-dark border border-gray-200 dark:border-core-border-dark rounded-2xl shadow-sm overflow-hidden">
        <div className="flex gap-1 overflow-x-auto p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl transition-all whitespace-nowrap font-semibold ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-core-primary-600 dark:to-core-primary-700 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-core-primary-900/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PCNProfile;
//import React, { useState } from 'react';
// import { 
//   Hospital, MapPin, User, Phone, Mail, Building2, 
//   FileText, MessageSquare, Plus, Edit, ChevronRight, Users,
//   Calendar, CheckCircle, Edit2
// } from 'lucide-react';
// import Breadcrumb from '../Breadcrumb.jsx'

// const PCNProfile = ({ pcnData, onBack, onSelectPractice, setActivePage }) => {
//   const [activeTab, setActiveTab] = useState('overview');

//   // Mock data - replace with real data
//   const pcn = pcnData || {
//     id: 1,
//     name: 'Bradford PCN',
//     code: 'PCN001',
//     status: 'Active',
//     region: 'Yorkshire',
//     accountManager: 'John Smith',
//     activeSince: '2020-04-01',
//     totalPractices: 5,
//     totalPatients: 45000
//   };

//   const breadcrumbItems = [
//     { label: 'Clients', onClick: () => setActivePage('clients') },
//     { label: 'PCNs', onClick: () => setActivePage('pcns') },
//     { label: pcn.name }
//   ];

//   const tabs = [
//     { id: 'overview', label: 'PCN Overview', icon: Hospital },
//     { id: 'contacts', label: 'PCN Contacts', icon: Users },
//     { id: 'practices', label: 'Practices', icon: Building2 },
//     { id: 'documents', label: 'Documents', icon: FileText },
//     { id: 'notes', label: 'Notes & Activity', icon: MessageSquare }
//   ];

//   const mockContacts = [
//     {
//       id: 1,
//       name: 'Dr. Sarah Johnson',
//       role: 'PCN Manager',
//       email: 'sarah.j@bradford-pcn.nhs.uk',
//       phone: '0113 123 4567',
//       isPrimary: true,
//       preferredContact: 'Email'
//     },
//     {
//       id: 2,
//       name: 'Mark Williams',
//       role: 'Finance Contact',
//       email: 'mark.w@bradford-pcn.nhs.uk',
//       phone: '0113 123 4568',
//       isPrimary: false,
//       preferredContact: 'Phone'
//     },
//     {
//       id: 3,
//       name: 'Dr. Emma Clarke',
//       role: 'Clinical Lead',
//       email: 'emma.c@bradford-pcn.nhs.uk',
//       phone: '0113 123 4569',
//       isPrimary: false,
//       preferredContact: 'Email'
//     }
//   ];

//   const mockPractices = [
//     {
//       id: 1,
//       name: 'Oak Medical Centre',
//       code: 'PR002',
//       location: 'Bradford City Centre',
//       status: 'Active',
//       manager: 'Dr. James Wilson'
//     },
//     {
//       id: 2,
//       name: 'Willow Health Practice',
//       code: 'PR005',
//       location: 'Bradford North',
//       status: 'Active',
//       manager: 'Dr. Lisa Brown'
//     },
//     {
//       id: 3,
//       name: 'Maple Surgery',
//       code: 'PR008',
//       location: 'Bradford South',
//       status: 'Onboarding',
//       manager: 'Dr. Ahmed Khan'
//     }
//   ];

//   const mockDocuments = [
//     {
//       id: 1,
//       name: 'PCN Service Agreement 2024',
//       type: 'Contract',
//       uploadDate: '2024-01-15',
//       size: '2.4 MB'
//     },
//     {
//       id: 2,
//       name: 'Data Sharing Agreement',
//       type: 'Compliance',
//       uploadDate: '2024-01-10',
//       size: '1.8 MB'
//     }
//   ];

//   const mockNotes = [
//     {
//       id: 1,
//       type: 'Call',
//       title: 'Quarterly Review Call',
//       description: 'Discussed performance metrics and upcoming contract renewal',
//       date: '2024-01-20',
//       user: 'John Smith'
//     },
//     {
//       id: 2,
//       type: 'Meeting',
//       title: 'Site Visit - Bradford PCN',
//       description: 'Met with PCN manager and clinical lead. All practices performing well.',
//       date: '2024-01-18',
//       user: 'Sarah Lee'
//     }
//   ];

//   const renderTabContent = () => {
//     switch(activeTab) {
//       case 'overview':
//         return (
//           <div className="space-y-6">
//             {/* Summary Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
//                 <div className="flex items-center gap-3 mb-2">
//                   <Building2 className="text-blue-500" size={24} />
//                   <h3 className="font-semibold text-blue-900">Total Practices</h3>
//                 </div>
//                 <p className="text-3xl font-bold text-blue-600">{pcn.totalPractices}</p>
//               </div>
              
//               <div className="bg-green-50 border border-green-200 rounded-xl p-6">
//                 <div className="flex items-center gap-3 mb-2">
//                   <Users className="text-green-500" size={24} />
//                   <h3 className="font-semibold text-green-900">Total Patients</h3>
//                 </div>
//                 <p className="text-3xl font-bold text-green-600">{pcn.totalPatients?.toLocaleString()}</p>
//               </div>
              
//               <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
//                 <div className="flex items-center gap-3 mb-2">
//                   <Calendar className="text-purple-500" size={24} />
//                   <h3 className="font-semibold text-purple-900">Active Since</h3>
//                 </div>
//                 <p className="text-3xl font-bold text-purple-600">{new Date(pcn.activeSince).getFullYear()}</p>
//               </div>
//             </div>

//             {/* PCN Details */}
//             <div className="bg-secondary rounded-xl border border-border p-6">
//               <h3 className="text-lg font-semibold text-primary mb-4">PCN Details</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="text-sm text-secondary font-medium">PCN Code</label>
//                   <p className="text-primary mt-1">{pcn.code}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm text-secondary font-medium">Region</label>
//                   <div className="flex items-center gap-2 mt-1">
//                     <MapPin size={16} className="text-muted" />
//                     <p className="text-primary">{pcn.region}</p>
//                   </div>
//                 </div>
//                 <div>
//                   <label className="text-sm text-secondary font-medium">Account Manager</label>
//                   <div className="flex items-center gap-2 mt-1">
//                     <User size={16} className="text-muted" />
//                     <p className="text-primary">{pcn.accountManager}</p>
//                   </div>
//                 </div>
//                 <div>
//                   <label className="text-sm text-secondary font-medium">Status</label>
//                   <div className="mt-1">
//                     <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                       pcn.status === 'Active' 
//                         ? 'bg-green-50 text-green-600' 
//                         : 'bg-orange-50 text-orange-600'
//                     }`}>
//                       {pcn.status}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       case 'contacts':
//         return (
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-semibold text-primary">PCN Level Contacts</h3>
//               <button className="flex items-center gap-2 px-4 py-2 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors">
//                 <Plus size={18} />
//                 <span>Add Contact</span>
//               </button>
//             </div>

//             <div className="grid grid-cols-1 gap-4">
//               {mockContacts.map((contact) => (
//                 <div key={contact.id} className="bg-secondary rounded-xl border border-border p-6 hover:shadow-md transition-all">
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-12 h-12 bg-gradient-to-br from-core-primary-500 to-core-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
//                         {contact.name.split(' ').map(n => n[0]).join('')}
//                       </div>
//                       <div>
//                         <h4 className="font-semibold text-primary">{contact.name}</h4>
//                         <p className="text-sm text-secondary">{contact.role}</p>
//                       </div>
//                     </div>
//                     {contact.isPrimary && (
//                       <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
//                         Primary Contact
//                       </span>
//                     )}
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="flex items-center gap-2">
//                       <Mail size={16} className="text-muted" />
//                       <span className="text-sm text-primary">{contact.email}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Phone size={16} className="text-muted" />
//                       <span className="text-sm text-primary">{contact.phone}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <CheckCircle size={16} className="text-muted" />
//                       <span className="text-sm text-primary">Prefers: {contact.preferredContact}</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         );

//       case 'practices':
//         return (
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-semibold text-primary">Practices in this PCN</h3>
//               <button className="flex items-center gap-2 px-4 py-2 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors">
//                 <Plus size={18} />
//                 <span>Add Practice</span>
//               </button>
//             </div>

//             <div className="bg-secondary rounded-xl border border-border overflow-hidden">
//               <table className="w-full">
//                 <thead className="bg-core-primary-50/50 border-b border-border">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase">Practice</th>
//                     <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase">Code</th>
//                     <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase">Location</th>
//                     <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase">Status</th>
//                     <th className="px-6 py-3 text-right text-xs font-semibold text-secondary uppercase">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-border">
//                   {mockPractices.map((practice) => (
//                     <tr 
//                       key={practice.id}
//                       className="hover:bg-core-primary-50/30 transition-colors group"
//                     >
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
//                             <Building2 className="text-blue-500" size={20} />
//                           </div>
//                           <div>
//                             <div className="font-semibold text-primary group-hover:text-core-primary-500 transition-colors">
//                               {practice.name}
//                             </div>
//                             <div className="text-sm text-secondary">{practice.manager}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-primary">{practice.code}</td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-2">
//                           <MapPin size={16} className="text-muted" />
//                           <span className="text-sm text-primary">{practice.location}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
//                           practice.status === 'Active'
//                             ? 'bg-green-50 text-green-600'
//                             : 'bg-orange-50 text-orange-600'
//                         }`}>
//                           {practice.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center justify-end gap-2">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               onSelectPractice(practice);
//                             }}
//                             className="p-2 text-secondary hover:text-core-primary-500 hover:bg-core-primary-50 rounded-lg transition-all"
//                             title="View Practice"
//                           >
//                             <ChevronRight size={18} />
//                           </button>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               // Edit practice logic
//                             }}
//                             className="p-2 text-secondary hover:text-core-primary-500 hover:bg-core-primary-50 rounded-lg transition-all"
//                             title="Edit Practice"
//                           >
//                             <Edit2 size={18} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         );

//       case 'documents':
//         return (
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-semibold text-primary">PCN Documents</h3>
//               <button className="flex items-center gap-2 px-4 py-2 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors">
//                 <Plus size={18} />
//                 <span>Upload Document</span>
//               </button>
//             </div>

//             <div className="grid grid-cols-1 gap-3">
//               {mockDocuments.map((doc) => (
//                 <div key={doc.id} className="bg-secondary rounded-xl border border-border p-4 hover:shadow-md transition-all cursor-pointer group">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
//                         <FileText className="text-red-500" size={20} />
//                       </div>
//                       <div>
//                         <h4 className="font-semibold text-primary group-hover:text-core-primary-500 transition-colors">
//                           {doc.name}
//                         </h4>
//                         <p className="text-sm text-secondary">{doc.type} • {doc.size} • {doc.uploadDate}</p>
//                       </div>
//                     </div>
//                     <ChevronRight className="text-muted group-hover:text-core-primary-500 transition-colors" size={18} />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         );

//       case 'notes':
//         return (
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-semibold text-primary">Notes & Activity Log</h3>
//               <button className="flex items-center gap-2 px-4 py-2 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors">
//                 <Plus size={18} />
//                 <span>Add Note</span>
//               </button>
//             </div>

//             <div className="space-y-3">
//               {mockNotes.map((note) => (
//                 <div key={note.id} className="bg-secondary rounded-xl border border-border p-6">
//                   <div className="flex items-start justify-between mb-3">
//                     <div className="flex items-center gap-3">
//                       <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
//                         note.type === 'Call' ? 'bg-green-50' : 'bg-blue-50'
//                       }`}>
//                         <MessageSquare className={note.type === 'Call' ? 'text-green-500' : 'text-blue-500'} size={20} />
//                       </div>
//                       <div>
//                         <h4 className="font-semibold text-primary">{note.title}</h4>
//                         <p className="text-sm text-secondary">{note.type} • {note.date} • {note.user}</p>
//                       </div>
//                     </div>
//                   </div>
//                   <p className="text-primary text-sm ml-13">{note.description}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Breadcrumb */}
//       <Breadcrumb items={breadcrumbItems} onNavigate={setActivePage} />

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <div className="flex items-center gap-3 mb-2">
//             <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
//               <Hospital className="text-blue-500" size={28} />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-primary">{pcn.name}</h1>
//               <p className="text-secondary">{pcn.code}</p>
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center gap-3">
//           <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
//             pcn.status === 'Active'
//               ? 'bg-green-50 text-green-600'
//               : 'bg-orange-50 text-orange-600'
//           }`}>
//             {pcn.status}
//           </span>
//           <button className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg hover:bg-core-primary-50 hover:text-core-primary-500 hover:border-core-primary-500 transition-all">
//             <Edit size={18} />
//             <span>Edit PCN</span>
//           </button>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="border-b border-border">
//         <div className="flex gap-6 overflow-x-auto">
//           {tabs.map((tab) => {
//             const Icon = tab.icon;
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
//                   activeTab === tab.id
//                     ? 'border-core-primary-500 text-core-primary-500'
//                     : 'border-transparent text-secondary hover:text-core-primary-500'
//                 }`}
//               >
//                 <Icon size={18} />
//                 <span className="font-medium">{tab.label}</span>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Tab Content */}
//       <div>
//         {renderTabContent()}
//       </div>
//     </div>
//   );
// };

// export default PCNProfile;