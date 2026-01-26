import React, { useState } from 'react';
import { Search, Plus, Filter, Hospital, Building2, ChevronRight, MoreVertical, Edit, Trash, RefreshCw } from 'lucide-react';

const ClientsList = ({ onSelectPCN, onSelectPractice }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, pcn, standalone
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [addType, setAddType] = useState(null); // 'pcn' or 'standalone'
  const [editingClient, setEditingClient] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'Bradford PCN',
      type: 'pcn',
      code: 'PCN001',
      practices: 5,
      patients: 12000, // Added for completeness, though fix is in details
      activeSince: '2023-01-15', // Added formatted date
      status: 'Active',
      region: 'Yorkshire',
      accountManager: 'John Doe' // Added for PCN details fix, though shown in details
    },
    {
      id: 2,
      name: 'Green Street Surgery',
      type: 'standalone',
      code: 'PR001',
      patients: 5000,
      activeSince: '2022-06-01',
      status: 'Active',
      region: 'London'
    },
    {
      id: 3,
      name: 'Leeds Medical PCN',
      type: 'pcn',
      code: 'PCN002',
      practices: 8,
      patients: 20000,
      activeSince: '2023-03-20',
      status: 'Onboarding',
      region: 'Yorkshire',
      accountManager: 'Jane Smith'
    }
  ]);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'pcn' && client.type === 'pcn') ||
                         (filterType === 'standalone' && client.type === 'standalone');
    return matchesSearch && matchesFilter;
  });

  const handleClientClick = (client) => {
    if (client.type === 'pcn') {
      onSelectPCN(client);
    } else {
      onSelectPractice(client);
    }
  };

  const handleAddClient = (newClient) => {
    const maxId = Math.max(...clients.map(c => c.id), 0);
    setClients([...clients, { ...newClient, id: maxId + 1 }]);
    setAddType(null);
    alert('Client added successfully!');
  };

  const handleEditClient = (updatedClient) => {
    setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
    setEditingClient(null);
    alert('Client updated successfully!');
  };

  const handleDeleteClient = (id) => {
    if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      setClients(clients.filter(c => c.id !== id));
      alert('Client deleted successfully!');
    }
  };

 

  const ClientForm = ({ client = {}, onSubmit, type }) => {
    const [formData, setFormData] = useState({
      name: client.name || '',
      code: client.code || '',
      practices: client.practices || (type === 'pcn' ? '' : undefined),
      patients: client.patients || '',
      activeSince: client.activeSince || '',
      status: client.status || 'Active',
      region: client.region || '',
      accountManager: client.accountManager || (type === 'pcn' ? '' : undefined)
    });

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
      if (!formData.name || !formData.code || !formData.region || !formData.activeSince || !formData.patients) {
        alert('Please fill all required fields.');
        return false;
      }
      if (type === 'pcn' && (!formData.practices || !formData.accountManager)) {
        alert('PCN requires practices count and account manager.');
        return false;
      }
      if (isNaN(formData.patients) || (type === 'pcn' && isNaN(formData.practices))) {
        alert('Patients and practices must be numbers.');
        return false;
      }
      return true;
    };

    const handleFormSubmit = (e) => {
      e.preventDefault();
      if (validate()) {
        onSubmit({ ...client, ...formData, type, practices: type === 'pcn' ? parseInt(formData.practices) : undefined, patients: parseInt(formData.patients) });
      }
    };

    return (
     <form
  onSubmit={handleFormSubmit}
  className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5"
>
  {/* Name */}
  <div>
    <label className="block text-sm font-medium text-primary mb-1">
      Name *
    </label>
    <input
      name="name"
      value={formData.name}
      onChange={handleChange}
      className="w-full px-4 py-2.5 border rounded-md"
      required
    />
  </div>

  {/* Code */}
  <div>
    <label className="block text-sm font-medium text-primary mb-1">
      Code *
    </label>
    <input
      name="code"
      value={formData.code}
      onChange={handleChange}
      className="w-full px-4 py-2.5 border rounded-md"
      required
    />
  </div>

  {/* Practices (PCN only) */}
  {type === 'pcn' && (
    <div>
      <label className="block text-sm font-medium text-primary mb-1">
        Practices *
      </label>
      <input
        name="practices"
        type="number"
        value={formData.practices}
        onChange={handleChange}
        className="w-full px-4 py-2.5 border rounded-md"
        required
      />
    </div>
  )}

  {/* Patients */}
  <div>
    <label className="block text-sm font-medium text-primary mb-1">
      Patients *
    </label>
    <input
      name="patients"
      type="number"
      value={formData.patients}
      onChange={handleChange}
      className="w-full px-4 py-2.5 border rounded-md"
      required
    />
  </div>

  {/* Active Since */}
  <div>
    <label className="block text-sm font-medium text-primary mb-1">
      Active Since *
    </label>
    <input
      name="activeSince"
      type="date"
      value={formData.activeSince}
      onChange={handleChange}
      className="w-full px-4 py-2.5 border rounded-md"
      required
    />
  </div>

  {/* Status */}
  <div>
    <label className="block text-sm font-medium text-primary mb-1">
      Status *
    </label>
    <select
      name="status"
      value={formData.status}
      onChange={handleChange}
      className="w-full px-4 py-2.5 border rounded-md"
    >
      <option>Active</option>
      <option>Onboarding</option>
    </select>
  </div>

  {/* Region */}
  <div>
    <label className="block text-sm font-medium text-primary mb-1">
      Region *
    </label>
    <input
      name="region"
      value={formData.region}
      onChange={handleChange}
      className="w-full px-4 py-2.5 border rounded-md"
      required
    />
  </div>

  {/* Account Manager (PCN only) */}
  {type === 'pcn' && (
    <div>
      <label className="block text-sm font-medium text-primary mb-1">
        Account Manager *
      </label>
      <input
        name="accountManager"
        value={formData.accountManager}
        onChange={handleChange}
        className="w-full px-4 py-2.5 border rounded-md"
        required
      />
    </div>
  )}

  {/* Buttons */}
  <div className="md:col-span-2 flex justify-start gap-3 pt-4">
    <button
      type="submit"
      className="px-6 py-2.5 bg-core-primary-500 text-white rounded-md"
    >
      Save
    </button>
    <button
      type="button"
      onClick={() => {
        setAddType(null)
        setEditingClient(null)
      }}
      className="px-6 py-2.5 border rounded-md"
    >
      Cancel
    </button>
  </div>
</form>

    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Clients</h1>
          <p className="text-secondary mt-1">Manage PCNs and standalone practices</p>
        </div>
        <button
          onClick={() => setShowAddTypeModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span className="font-medium">Add Client</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={20} />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500/20 focus:border-core-primary-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
              filterType === 'all'
                ? 'bg-core-primary-500 text-white'
                : 'bg-secondary text-secondary hover:bg-core-primary-50 hover:text-core-primary-500'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('pcn')}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
              filterType === 'pcn'
                ? 'bg-core-primary-500 text-white'
                : 'bg-secondary text-secondary hover:bg-core-primary-50 hover:text-core-primary-500'
            }`}
          >
            PCNs
          </button>
          <button
            onClick={() => setFilterType('standalone')}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
              filterType === 'standalone'
                ? 'bg-core-primary-500 text-white'
                : 'bg-secondary text-secondary hover:bg-core-primary-50 hover:text-core-primary-500'
            }`}
          >
            Standalone
          </button>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            onClick={() => handleClientClick(client)}
            className="bg-secondary border border-border rounded-xl p-6 hover:shadow-md hover:border-core-primary-500 transition-all cursor-pointer group relative"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                client.type === 'pcn' ? 'bg-blue-50' : 'bg-green-50'
              }`}>
                {client.type === 'pcn' ? (
                  <Hospital className="text-blue-500" size={24} />
                ) : (
                  <Building2 className="text-green-500" size={24} />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  client.status === 'Active'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-orange-50 text-orange-600'
                }`}>
                  {client.status}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === client.id ? null : client.id);
                  }}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <MoreVertical size={20} className="text-muted" />
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-primary mb-1 group-hover:text-core-primary-500 transition-colors">
              {client.name}
            </h3>
            <p className="text-sm text-secondary mb-3">{client.code}</p>
            
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="text-sm text-secondary">
                {client.type === 'pcn' ? (
                  <span>{client.practices} practices</span>
                ) : (
                  <span>{client.region}</span>
                )}
              </div>
              <ChevronRight className="text-muted group-hover:text-core-primary-500 transition-colors" size={18} />
            </div>

            {/* Actions Dropdown */}
            {openMenuId === client.id && (
              <div className="absolute right-4 top-12 bg-white border border-border rounded-lg shadow-lg z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingClient(client);
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
                    handleDeleteClient(client.id);
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

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary">No clients found</p>
        </div>
      )}

      {/* Add Type Modal */}
      {showAddTypeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold text-primary mb-4">Select Client Type</h2>
            <p className="text-secondary mb-6">Choose the type of client you want to add</p>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setAddType('pcn');
                  setShowAddTypeModal(false);
                }}
                className="w-full flex items-center gap-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:border-blue-500 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Hospital className="text-blue-500" size={24} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-primary group-hover:text-blue-600">PCN (Multiple Practices)</h3>
                  <p className="text-sm text-secondary">A parent organization with multiple practices</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setAddType('standalone');
                  setShowAddTypeModal(false);
                }}
                className="w-full flex items-center gap-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:border-green-500 transition-all group"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building2 className="text-green-500" size={24} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-primary group-hover:text-green-600">Standalone Practice</h3>
                  <p className="text-sm text-secondary">A single independent practice</p>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowAddTypeModal(false)}
              className="w-full mt-4 px-4 py-2 bg-secondary border border-border rounded-lg text-secondary hover:bg-core-primary-50 hover:text-core-primary-500 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(addType || editingClient) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-xl p-6 max-w-[800px] w-full shadow-xl">
            <h2 className="text-2xl font-bold text-primary mb-4">
              {editingClient ? 'Edit Client' : 'Add ' + (addType === 'pcn' ? 'PCN' : 'Standalone Practice')}
            </h2>
            <ClientForm 
              client={editingClient || {}}
              onSubmit={editingClient ? handleEditClient : handleAddClient}
              type={editingClient?.type || addType}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsList;