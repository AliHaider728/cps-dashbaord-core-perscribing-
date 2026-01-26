import React, { useState } from 'react';
import { Search, Plus, Filter, Hospital, Building2, ChevronRight } from 'lucide-react';

const ClientsList = ({ onSelectPCN, onSelectPractice }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, pcn, standalone
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data - replace with real data
  const mockClients = [
    {
      id: 1,
      name: 'Bradford PCN',
      type: 'pcn',
      code: 'PCN001',
      practices: 5,
      status: 'Active',
      region: 'Yorkshire'
    },
    {
      id: 2,
      name: 'Green Street Surgery',
      type: 'standalone',
      code: 'PR001',
      status: 'Active',
      region: 'London'
    },
    {
      id: 3,
      name: 'Leeds Medical PCN',
      type: 'pcn',
      code: 'PCN002',
      practices: 8,
      status: 'Onboarding',
      region: 'Yorkshire'
    }
  ];

  const filteredClients = mockClients.filter(client => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Clients</h1>
          <p className="text-secondary mt-1">Manage PCNs and standalone practices</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
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
            className="bg-secondary border border-border rounded-xl p-6 hover:shadow-md hover:border-core-primary-500 transition-all cursor-pointer group"
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
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                client.status === 'Active'
                  ? 'bg-green-50 text-green-600'
                  : 'bg-orange-50 text-orange-600'
              }`}>
                {client.status}
              </span>
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
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary">No clients found</p>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold text-primary mb-4">Select Client Type</h2>
            <p className="text-secondary mb-6">Choose the type of client you want to add</p>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  // Add PCN creation logic
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
                  setShowAddModal(false);
                  // Add standalone practice logic
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
              onClick={() => setShowAddModal(false)}
              className="w-full mt-4 px-4 py-2 bg-secondary border border-border rounded-lg text-secondary hover:bg-core-primary-50 hover:text-core-primary-500 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsList;