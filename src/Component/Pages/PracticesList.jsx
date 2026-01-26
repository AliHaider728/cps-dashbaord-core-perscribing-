import React, { useState } from 'react';
import { Search, Plus, Building2, ChevronRight, MapPin, Hospital } from 'lucide-react';

const PracticesList = ({ onSelectPractice, standaloneOnly = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock practices data
  const mockPractices = [
    {
      id: 1,
      name: 'Green Street Surgery',
      code: 'PR001',
      type: 'standalone',
      status: 'Active',
      location: 'London',
      pcnName: null,
      manager: 'Dr. Emily Brown'
    },
    {
      id: 2,
      name: 'Oak Medical Centre',
      code: 'PR002',
      type: 'pcn-practice',
      status: 'Active',
      location: 'Bradford',
      pcnName: 'Bradford PCN',
      manager: 'Dr. James Wilson'
    },
    {
      id: 3,
      name: 'Riverside Practice',
      code: 'PR003',
      type: 'standalone',
      status: 'Onboarding',
      location: 'Manchester',
      pcnName: null,
      manager: 'Dr. Sarah Ahmed'
    },
    {
      id: 4,
      name: 'Central Health Hub',
      code: 'PR004',
      type: 'pcn-practice',
      status: 'Active',
      location: 'Leeds',
      pcnName: 'Leeds Medical PCN',
      manager: 'Dr. Robert Taylor'
    }
  ];

  const filteredPractices = mockPractices.filter(practice => {
    const matchesSearch = practice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         practice.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || practice.status.toLowerCase() === statusFilter;
    const matchesType = !standaloneOnly || practice.type === 'standalone';
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {standaloneOnly ? 'Standalone Practices' : 'All Practices'}
          </h1>
          <p className="text-secondary mt-1">
            {standaloneOnly 
              ? 'Independent practices not part of any PCN'
              : 'All practices including PCN members and standalone'}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors shadow-sm">
          <Plus size={20} />
          <span className="font-medium">Add Practice</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={20} />
          <input
            type="text"
            placeholder="Search practices..."
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

      {/* Practices Table */}
      <div className="bg-secondary rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-core-primary-50/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Practice Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPractices.map((practice) => (
                <tr
                  key={practice.id}
                  onClick={() => onSelectPractice(practice)}
                  className="hover:bg-core-primary-50/30 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        practice.type === 'standalone' ? 'bg-green-50' : 'bg-blue-50'
                      }`}>
                        <Building2 className={practice.type === 'standalone' ? 'text-green-500' : 'text-blue-500'} size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-primary group-hover:text-core-primary-500 transition-colors">
                          {practice.name}
                        </div>
                        <div className="text-sm text-secondary">{practice.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {practice.type === 'standalone' ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
                        Standalone
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Hospital size={14} className="text-blue-500" />
                        <span className="text-sm text-primary">{practice.pcnName}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-muted" />
                      <span className="text-sm text-primary">{practice.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-primary">{practice.manager}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      practice.status === 'Active'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-orange-50 text-orange-600'
                    }`}>
                      {practice.status}
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

      {filteredPractices.length === 0 && (
        <div className="text-center py-12 bg-secondary rounded-xl">
          <p className="text-secondary">No practices found</p>
        </div>
      )}
    </div>
  );
};

export default PracticesList;