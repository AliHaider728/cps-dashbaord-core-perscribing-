import React, { useState } from 'react';
import { Search, Plus, Building2, ChevronRight, MapPin, Hospital, MoreVertical, Edit, Trash, RefreshCw } from 'lucide-react';

const PracticesList = ({ onSelectPractice, standaloneOnly = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [practices, setPractices] = useState([
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
  ]);
  const [editingPractice, setEditingPractice] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const filteredPractices = practices.filter(practice => {
    const matchesSearch = practice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         practice.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || practice.status.toLowerCase() === statusFilter;
    const matchesType = !standaloneOnly || practice.type === 'standalone';
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddPractice = (newPractice) => {
    const maxId = Math.max(...practices.map(p => p.id), 0);
    setPractices([...practices, { ...newPractice, id: maxId + 1 }]);
    setEditingPractice(null);
    alert('Practice added successfully!');
  };

  const handleEditPractice = (updatedPractice) => {
    setPractices(practices.map(p => p.id === updatedPractice.id ? updatedPractice : p));
    setEditingPractice(null);
    alert('Practice updated successfully!');
  };

  const handleDeletePractice = (id) => {  
    if (window.confirm('Are you sure you want to delete this practice? This action cannot be undone.')) {
      setPractices(practices.filter(p => p.id !== id));
      alert('Practice deleted successfully!');
    }
  };

  

  const PracticeForm = ({ practice = {}, onSubmit }) => {
    const [formData, setFormData] = useState({
      name: practice.name || '',
      code: practice.code || '',
      type: practice.type || 'standalone',
      status: practice.status || 'Active',
      location: practice.location || '',
      pcnName: practice.pcnName || '',
      manager: practice.manager || ''
    });

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
      if (!formData.name || !formData.code || !formData.location || !formData.manager) {
        alert('Please fill all required fields.');
        return false;
      }
      if (formData.type === 'pcn-practice' && !formData.pcnName) {
        alert('PCN Practice requires PCN Name.');
        return false;
      }
      return true;
    };

    const handleFormSubmit = (e) => {
      e.preventDefault();
      if (validate()) {
        onSubmit({ ...practice, ...formData });
      }
    };

    return (
      <form onSubmit={handleFormSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Name *</label>
          <input 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500/20 focus:border-core-primary-500 transition-all" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Code *</label>
          <input 
            name="code" 
            value={formData.code} 
            onChange={handleChange} 
            className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500/20 focus:border-core-primary-500 transition-all" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Type *</label>
          <select 
            name="type" 
            value={formData.type} 
            onChange={handleChange} 
            className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500/20 focus:border-core-primary-500 transition-all"
          >
            <option value="standalone">Standalone</option>
            <option value="pcn-practice">PCN Practice</option>
          </select>
        </div>
        {formData.type === 'pcn-practice' && (
          <div>
            <label className="block text-sm font-medium text-primary mb-1">PCN Name *</label>
            <input 
              name="pcnName" 
              value={formData.pcnName} 
              onChange={handleChange} 
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500/20 focus:border-core-primary-500 transition-all" 
              required 
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Location *</label>
          <input 
            name="location" 
            value={formData.location} 
            onChange={handleChange} 
            className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500/20 focus:border-core-primary-500 transition-all" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Manager *</label>
          <input 
            name="manager" 
            value={formData.manager} 
            onChange={handleChange} 
            className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500/20 focus:border-core-primary-500 transition-all" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Status *</label>
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange} 
            className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500/20 focus:border-core-primary-500 transition-all"
          >
            <option>Active</option>
            <option>Onboarding</option>
          </select>
        </div>
        <div className="flex gap-2 pt-2">
          <button type="submit" className="flex-1 px-4 py-2 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors">
            Save
          </button>
          <button 
            type="button" 
            onClick={() => setEditingPractice(null)} 
            className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg text-secondary hover:bg-core-primary-50 hover:text-core-primary-500 transition-all"
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
          <h1 className="text-3xl font-bold text-primary">
            {standaloneOnly ? 'Standalone Practices' : 'All Practices'}
          </h1>
          <p className="text-secondary mt-1">
            {standaloneOnly 
              ? 'Independent practices not part of any PCN'
              : 'All practices including PCN members and standalone'}
          </p>
        </div>
        <button
          onClick={() => setEditingPractice({})}
          className="flex items-center gap-2 px-4 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors shadow-sm"
        >
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
                  className="hover:bg-core-primary-50/30 transition-colors cursor-pointer group relative"
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
                    <div className="flex items-center justify-end gap-2">
                      <ChevronRight className="text-muted group-hover:text-core-primary-500 transition-colors" size={18} />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === practice.id ? null : practice.id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <MoreVertical size={18} className="text-muted" />
                      </button>
                    </div>
                    {openMenuId === practice.id && (
                      <div className="absolute right-4 top-12 bg-white border border-border rounded-lg shadow-lg z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPractice(practice);
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
                            handleDeletePractice(practice.id);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 text-red-600"
                        >
                          <Trash size={16} />
                          Delete
                        </button>
                        
                      </div>
                    )}
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

      {/* Add/Edit Modal */}
      {editingPractice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-xl p-6 max-w-[800px] w-full shadow-xl">
            <h2 className="text-2xl font-bold text-primary mb-4">
              {editingPractice.id ? 'Edit Practice' : 'Add Practice'}
            </h2>
            <PracticeForm 
              practice={editingPractice}
              onSubmit={editingPractice.id ? handleEditPractice : handleAddPractice}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticesList;