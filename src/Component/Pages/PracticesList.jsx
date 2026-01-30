import React, { useState } from 'react';
import { Search, Plus, Building2, ChevronRight, MapPin, Hospital, MoreVertical, Edit, Trash, X, Filter } from 'lucide-react';

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
  const [showFilters, setShowFilters] = useState(false);

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
  };

  const handleEditPractice = (updatedPractice) => {
    setPractices(practices.map(p => p.id === updatedPractice.id ? updatedPractice : p));
    setEditingPractice(null);
  };

  const handleDeletePractice = (id) => {  
    if (window.confirm('Are you sure you want to delete this practice? This action cannot be undone.')) {
      setPractices(practices.filter(p => p.id !== id));
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
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Practice Name *</label>
            <input 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Enter practice name"
              className="w-full px-4 py-2.5 bg-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500/20 focus:border-core-primary-500 transition-all text-primary" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Practice Code *</label>
            <input 
              name="code" 
              value={formData.code} 
              onChange={handleChange} 
              placeholder="e.g., PR001"
              className="w-full px-4 py-2.5 bg-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500/20 focus:border-core-primary-500 transition-all text-primary" 
              required 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Type *</label>
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleChange} 
              className="w-full px-4 py-2.5 bg-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500/20 focus:border-core-primary-500 transition-all text-primary"
            >
              <option value="standalone">Standalone</option>
              <option value="pcn-practice">PCN Practice</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Status *</label>
            <select 
              name="status" 
              value={formData.status} 
              onChange={handleChange} 
              className="w-full px-4 py-2.5 bg-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500/20 focus:border-core-primary-500 transition-all text-primary"
            >
              <option>Active</option>
              <option>Onboarding</option>
            </select>
          </div>
        </div>

        {formData.type === 'pcn-practice' && (
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">PCN Name *</label>
            <input 
              name="pcnName" 
              value={formData.pcnName} 
              onChange={handleChange} 
              placeholder="Enter PCN name"
              className="w-full px-4 py-2.5 bg-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500/20 focus:border-core-primary-500 transition-all text-primary" 
              required 
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Location *</label>
            <input 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
              placeholder="City/Town"
              className="w-full px-4 py-2.5 bg-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500/20 focus:border-core-primary-500 transition-all text-primary" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Manager *</label>
            <input 
              name="manager" 
              value={formData.manager} 
              onChange={handleChange} 
              placeholder="Manager name"
              className="w-full px-4 py-2.5 bg-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500/20 focus:border-core-primary-500 transition-all text-primary" 
              required 
            />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <button 
            type="button" 
            onClick={() => setEditingPractice(null)} 
            className="flex-1 px-4 py-2.5 bg-secondary border border-border rounded-lg text-secondary hover:bg-core-primary-50 hover:text-core-primary-500 transition-all font-medium"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="flex-1 px-4 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors font-medium shadow-sm"
          >
            {practice.id ? 'Update Practice' : 'Add Practice'}
          </button>
        </div>
      </form>
    );
  };

  // Practice Card Component for Mobile View
  const PracticeCard = ({ practice }) => (
    <div 
      onClick={() => onSelectPractice(practice)}
      className="bg-secondary rounded-xl border border-border p-4 hover:shadow-lg hover:border-core-primary-300 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
            practice.type === 'standalone' ? 'bg-green-50' : 'bg-blue-50'
          }`}>
            <Building2 className={practice.type === 'standalone' ? 'text-green-500' : 'text-blue-500'} size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-primary truncate">{practice.name}</h3>
            <p className="text-sm text-secondary">{practice.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
            practice.status === 'Active'
              ? 'bg-green-50 text-green-600'
              : 'bg-orange-50 text-orange-600'
          }`}>
            {practice.status}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === practice.id ? null : practice.id);
            }}
            className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors relative"
          >
            <MoreVertical size={18} className="text-muted" />
          </button>
        </div>
      </div>

      {openMenuId === practice.id && (
        <div className="absolute right-4 mt-1 bg-secondary border border-border rounded-lg shadow-xl z-20 min-w-[140px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingPractice(practice);
              setOpenMenuId(null);
            }}
            className="flex items-center gap-2 px-4 py-2.5 w-full text-left hover:bg-core-primary-50 text-primary transition-colors"
          >
            <Edit size={16} />
            <span className="text-sm font-medium">Edit</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeletePractice(practice.id);
              setOpenMenuId(null);
            }}
            className="flex items-center gap-2 px-4 py-2.5 w-full text-left hover:bg-red-50 text-red-600 transition-colors rounded-b-lg"
          >
            <Trash size={16} />
            <span className="text-sm font-medium">Delete</span>
          </button>
        </div>
      )}

      <div className="space-y-2 pt-2 border-t border-border">
        {practice.type === 'pcn-practice' && (
          <div className="flex items-center gap-2">
            <Hospital size={14} className="text-blue-500 flex-shrink-0" />
            <span className="text-sm text-primary truncate">{practice.pcnName}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-muted flex-shrink-0" />
          <span className="text-sm text-primary">{practice.location}</span>
        </div>
        <div className="text-sm text-secondary">
          <span className="font-medium">Manager:</span> {practice.manager}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            {standaloneOnly ? 'Standalone Practices' : 'All Practices'}
          </h1>
          <p className="text-sm text-secondary mt-1">
            {standaloneOnly 
              ? 'Independent practices not part of any PCN'
              : 'All practices including PCN members and standalone'}
          </p>
        </div>
        <button
          onClick={() => setEditingPractice({})}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors shadow-sm w-full sm:w-auto"
        >
          <Plus size={20} />
          <span className="font-medium">Add Practice</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={20} />
            <input
              type="text"
              placeholder="Search practices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-core-primary-500/20 focus:border-core-primary-500 transition-all text-primary"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden px-4 py-2.5 bg-secondary border border-border rounded-lg hover:bg-core-primary-50 hover:text-core-primary-500 transition-all"
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Filter Buttons */}
        <div className={`${showFilters ? 'flex' : 'hidden'} lg:flex flex-wrap gap-2`}>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-core-primary-500 text-white shadow-sm'
                : 'bg-secondary text-secondary hover:bg-core-primary-50 hover:text-core-primary-500 border border-border'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              statusFilter === 'active'
                ? 'bg-core-primary-500 text-white shadow-sm'
                : 'bg-secondary text-secondary hover:bg-core-primary-50 hover:text-core-primary-500 border border-border'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter('onboarding')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              statusFilter === 'onboarding'
                ? 'bg-core-primary-500 text-white shadow-sm'
                : 'bg-secondary text-secondary hover:bg-core-primary-50 hover:text-core-primary-500 border border-border'
            }`}
          >
            Onboarding
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-secondary rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-core-primary-50/50 border-b border-border">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Practice Details
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Manager
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3.5"></th>
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
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
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
                  <td className="px-6 py-4 text-right relative">
                    <div className="flex items-center justify-end gap-2">
                      <ChevronRight className="text-muted group-hover:text-core-primary-500 transition-colors" size={18} />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === practice.id ? null : practice.id);
                        }}
                        className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <MoreVertical size={18} className="text-muted" />
                      </button>
                    </div>
                    {openMenuId === practice.id && (
                      <div className="absolute right-4 top-12 bg-secondary border border-border rounded-lg shadow-xl z-20 min-w-[140px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPractice(practice);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 w-full text-left hover:bg-core-primary-50 text-primary transition-colors"
                        >
                          <Edit size={16} />
                          <span className="text-sm font-medium">Edit</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePractice(practice.id);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 w-full text-left hover:bg-red-50 text-red-600 transition-colors rounded-b-lg"
                        >
                          <Trash size={16} />
                          <span className="text-sm font-medium">Delete</span>
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

      {/* Mobile Card View */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredPractices.map((practice) => (
          <PracticeCard key={practice.id} practice={practice} />
        ))}
      </div>

      {/* Empty State */}
      {filteredPractices.length === 0 && (
        <div className="text-center py-16 bg-secondary rounded-xl border border-border">
          <div className="w-16 h-16 bg-core-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="text-core-primary-500" size={28} />
          </div>
          <p className="text-lg font-medium text-primary mb-1">No practices found</p>
          <p className="text-sm text-secondary">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {editingPractice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-xl p-5 sm:p-6 max-w-[900px] w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-primary">
                {editingPractice.id ? 'Edit Practice' : 'Add New Practice'}
              </h2>
              <button
                onClick={() => setEditingPractice(null)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X size={22} className="text-secondary" />
              </button>
            </div>
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