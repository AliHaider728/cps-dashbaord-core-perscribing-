import React, { useState } from 'react';
import { Search, Plus, Hospital, ChevronRight, MapPin, Users } from 'lucide-react';

const PCNsList = ({ onSelectPCN }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock PCN data
  const mockPCNs = [
    {
      id: 1,
      name: 'Bradford PCN',
      code: 'PCN001',
      practices: 5,
      totalPatients: 45000,
      status: 'Active',
      region: 'Yorkshire',
      accountManager: 'John Smith'
    },
    {
      id: 2,
      name: 'Leeds Medical PCN',
      code: 'PCN002',
      practices: 8,
      totalPatients: 62000,
      status: 'Onboarding',
      region: 'Yorkshire',
      accountManager: 'Sarah Johnson'
    },
    {
      id: 3,
      name: 'Manchester Central PCN',
      code: 'PCN003',
      practices: 6,
      totalPatients: 51000,
      status: 'Active',
      region: 'Greater Manchester',
      accountManager: 'Mike Davis'
    }
  ];

  const filteredPCNs = mockPCNs.filter(pcn => {
    const matchesSearch = pcn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pcn.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pcn.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">PCNs</h1>
          <p className="text-secondary mt-1">Primary Care Networks with multiple practices</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors shadow-sm">
          <Plus size={20} />
          <span className="font-medium">Add PCN</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={20} />
          <input
            type="text"
            placeholder="Search PCNs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500/20 focus:border-core-primary-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-core-primary-500 text-white'
                : 'bg-secondary text-secondary hover:bg-core-primary-50 hover:text-core-primary-500'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
              statusFilter === 'active'
                ? 'bg-core-primary-500 text-white'
                : 'bg-secondary text-secondary hover:bg-core-primary-50 hover:text-core-primary-500'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter('onboarding')}
            className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
              statusFilter === 'onboarding'
                ? 'bg-core-primary-500 text-white'
                : 'bg-secondary text-secondary hover:bg-core-primary-50 hover:text-core-primary-500'
            }`}
          >
            Onboarding
          </button>
        </div>
      </div>

      {/* PCNs Table */}
      <div className="bg-secondary rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-core-primary-50/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  PCN Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Practices
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Region
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Account Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPCNs.map((pcn) => (
                <tr
                  key={pcn.id}
                  onClick={() => onSelectPCN(pcn)}
                  className="hover:bg-core-primary-50/30 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Hospital className="text-blue-500" size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-primary group-hover:text-core-primary-500 transition-colors">
                          {pcn.name}
                        </div>
                        <div className="text-sm text-secondary">{pcn.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-muted" />
                      <span className="text-sm text-primary">{pcn.practices} practices</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-muted" />
                      <span className="text-sm text-primary">{pcn.region}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-primary">{pcn.accountManager}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      pcn.status === 'Active'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-orange-50 text-orange-600'
                    }`}>
                      {pcn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight className="text-muted group-hover:text-core-primary-500 transition-colors" size={18} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPCNs.length === 0 && (
        <div className="text-center py-12 bg-secondary rounded-xl">
          <p className="text-secondary">No PCNs found</p>
        </div>
      )}
    </div>
  );
};

export default PCNsList;