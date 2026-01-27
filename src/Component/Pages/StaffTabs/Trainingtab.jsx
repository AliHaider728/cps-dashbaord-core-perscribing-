import React, { useState } from 'react';
import { GraduationCap, Plus, Edit2, Trash2, Download, Search, Eye, CheckCircle, Clock, X, Save, Award, TrendingUp } from 'lucide-react';
import * as XLSX from 'xlsx';

const TrainingTab = ({ staffData }) => {
  const [trainings, setTrainings] = useState([
    {
      id: 1,
      title: 'Data Security Awareness',
      category: 'Mandatory',
      type: 'Online Course',
      provider: 'NHS Digital',
      startDate: '2025-05-10',
      completionDate: '2025-05-12',
      expiryDate: '2026-05-12',
      duration: '2 hours',
      status: 'Completed',
      progress: 100,
      score: 95,
      certificate: 'CERT-DS-2025-001',
      notes: 'Excellent understanding of data protection principles',
      assignedBy: 'Saba Kazmi'
    },
    {
      id: 2,
      title: 'Sepsis in Primary Care - Overview',
      category: 'Clinical',
      type: 'Workshop',
      provider: 'Primary Care Training',
      startDate: '2025-11-17',
      completionDate: '2025-11-17',
      expiryDate: '2027-11-17',
      duration: '4 hours',
      status: 'Completed',
      progress: 100,
      score: 92,
      certificate: 'CERT-SPC-2025-002',
      notes: 'Practical session with case studies',
      assignedBy: 'Noor Ul Hameed'
    },
    {
      id: 3,
      title: 'Infection Prevention and Control - Level 1',
      category: 'Mandatory',
      type: 'Online Course',
      provider: 'NHS England',
      startDate: '2025-05-15',
      completionDate: '2025-05-16',
      expiryDate: '2026-05-16',
      duration: '1.5 hours',
      status: 'Completed',
      progress: 100,
      score: 88,
      certificate: 'CERT-IPC-2025-003',
      notes: 'Understanding of infection control protocols',
      assignedBy: 'Noor Ul Hameed'
    },
    {
      id: 4,
      title: 'Deprivation of Liberty Safeguards (DoLS)',
      category: 'Safeguarding',
      type: 'E-Learning',
      provider: 'Social Care Institute',
      startDate: '2025-05-19',
      completionDate: '2025-05-20',
      expiryDate: '2027-05-20',
      duration: '3 hours',
      status: 'Completed',
      progress: 100,
      score: 90,
      certificate: 'CERT-DOLS-2025-004',
      notes: 'Comprehensive understanding of safeguarding principles',
      assignedBy: 'Noor Ul Hameed'
    },
    {
      id: 5,
      title: 'Advanced Prescribing Skills',
      category: 'Clinical',
      type: 'Online Course',
      provider: 'Royal Pharmaceutical Society',
      startDate: '2026-01-10',
      completionDate: null,
      expiryDate: null,
      duration: '8 hours',
      status: 'In Progress',
      progress: 65,
      score: null,
      certificate: null,
      notes: 'Expected completion by end of January',
      assignedBy: 'Arslan Shahroz'
    },
    {
      id: 6,
      title: 'Mental Health First Aid',
      category: 'Professional Development',
      type: 'Workshop',
      provider: 'Mental Health England',
      startDate: '2026-02-01',
      completionDate: null,
      expiryDate: null,
      duration: '6 hours',
      status: 'Scheduled',
      progress: 0,
      score: null,
      certificate: null,
      notes: 'Two-day workshop scheduled',
      assignedBy: 'Stephen Elliott'
    },
    {
      id: 7,
      title: 'Fire Safety Training',
      category: 'Mandatory',
      type: 'Classroom',
      provider: 'Local Fire Service',
      startDate: '2025-03-15',
      completionDate: '2025-03-15',
      expiryDate: '2026-03-15',
      duration: '2 hours',
      status: 'Expired',
      progress: 100,
      score: 85,
      certificate: 'CERT-FS-2025-005',
      notes: 'Renewal required',
      assignedBy: 'Saba Kazmi'
    },
    {
      id: 8,
      title: 'Clinical Governance',
      category: 'Professional Development',
      type: 'E-Learning',
      provider: 'BMJ Learning',
      startDate: '2025-08-20',
      completionDate: '2025-08-22',
      expiryDate: '2027-08-22',
      duration: '5 hours',
      status: 'Completed',
      progress: 100,
      score: 93,
      certificate: 'CERT-CG-2025-006',
      notes: 'Excellent grasp of governance principles',
      assignedBy: 'Arslan Shahroz'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingTraining, setEditingTraining] = useState(null);
  const [viewingTraining, setViewingTraining] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Mandatory',
    type: 'Online Course',
    provider: '',
    startDate: '',
    duration: '',
    notes: ''
  });

  const categories = ['All', 'Mandatory', 'Clinical', 'Safeguarding', 'Professional Development', 'Technical', 'Soft Skills'];
  const types = ['Online Course', 'Workshop', 'E-Learning', 'Classroom', 'Webinar', 'Conference'];
  const statuses = ['All', 'Completed', 'In Progress', 'Scheduled', 'Expired', 'Not Started'];

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Expired':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Not Started':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Get category badge color
  const getCategoryColor = (category) => {
    const colors = {
      'Mandatory': 'bg-red-100 text-red-700',
      'Clinical': 'bg-blue-100 text-blue-700',
      'Safeguarding': 'bg-purple-100 text-purple-700',
      'Professional Development': 'bg-green-100 text-green-700',
      'Technical': 'bg-orange-100 text-orange-700',
      'Soft Skills': 'bg-pink-100 text-pink-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  // Filter trainings
  const filteredTrainings = trainings.filter(training => {
    const matchesSearch = 
      training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'All' || training.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || training.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Add new training
  const handleAdd = () => {
    if (!formData.title.trim() || !formData.provider.trim() || !formData.startDate) {
      alert('Please fill in all required fields');
      return;
    }

    const newTraining = {
      id: Math.max(...trainings.map(t => t.id), 0) + 1,
      title: formData.title,
      category: formData.category,
      type: formData.type,
      provider: formData.provider,
      startDate: formData.startDate,
      completionDate: null,
      expiryDate: null,
      duration: formData.duration,
      status: 'Scheduled',
      progress: 0,
      score: null,
      certificate: null,
      notes: formData.notes,
      assignedBy: 'Current User'
    };

    setTrainings([newTraining, ...trainings]);
    resetForm();
  };

  // Update training
  const handleUpdate = () => {
    if (!formData.title.trim() || !formData.provider.trim() || !formData.startDate) {
      alert('Please fill in all required fields');
      return;
    }

    setTrainings(trainings.map(training =>
      training.id === editingTraining.id
        ? {
            ...training,
            title: formData.title,
            category: formData.category,
            type: formData.type,
            provider: formData.provider,
            startDate: formData.startDate,
            duration: formData.duration,
            notes: formData.notes
          }
        : training
    ));
    resetForm();
  };

  // Delete training
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this training record?')) {
      setTrainings(trainings.filter(training => training.id !== id));
    }
  };

  // Edit training
  const handleEdit = (training) => {
    setEditingTraining(training);
    setFormData({
      title: training.title,
      category: training.category,
      type: training.type,
      provider: training.provider,
      startDate: training.startDate,
      duration: training.duration,
      notes: training.notes
    });
    setShowModal(true);
  };

  // View training
  const handleView = (training) => {
    setViewingTraining(training);
    setShowViewModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      category: 'Mandatory',
      type: 'Online Course',
      provider: '',
      startDate: '',
      duration: '',
      notes: ''
    });
    setEditingTraining(null);
    setShowModal(false);
  };

  // Export to Excel
  const handleExport = () => {
    const exportData = trainings.map(training => ({
      'Training Title': training.title,
      'Category': training.category,
      'Type': training.type,
      'Provider': training.provider,
      'Start Date': training.startDate,
      'Completion Date': training.completionDate || 'N/A',
      'Expiry Date': training.expiryDate || 'N/A',
      'Duration': training.duration,
      'Status': training.status,
      'Progress': `${training.progress}%`,
      'Score': training.score ? `${training.score}%` : 'N/A',
      'Certificate': training.certificate || 'N/A',
      'Assigned By': training.assignedBy,
      'Notes': training.notes
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Training Records');
    
    ws['!cols'] = [
      { wch: 35 }, { wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 12 },
      { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 15 }, { wch: 10 },
      { wch: 10 }, { wch: 20 }, { wch: 20 }, { wch: 40 }
    ];

    XLSX.writeFile(wb, `${staffData?.name || 'Staff'}_Training_Records.xlsx`);
  };

  // Calculate statistics
  const stats = {
    total: trainings.length,
    completed: trainings.filter(t => t.status === 'Completed').length,
    inProgress: trainings.filter(t => t.status === 'In Progress').length,
    scheduled: trainings.filter(t => t.status === 'Scheduled').length,
    expired: trainings.filter(t => t.status === 'Expired').length,
    avgScore: trainings.filter(t => t.score).length > 0
      ? Math.round(trainings.filter(t => t.score).reduce((sum, t) => sum + t.score, 0) / trainings.filter(t => t.score).length)
      : 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary">Training & Development</h2>
          <p className="text-secondary text-sm mt-1">Track staff training courses and certifications</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-sm"
          >
            <Download size={16} />
            <span className="font-medium">Export</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors duration-200 shadow-sm"
          >
            <Plus size={16} />
            <span className="font-medium">Add Training</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        <div className="bg-primary rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-core-primary-500">{stats.total}</div>
          <div className="text-sm text-secondary mt-1">Total</div>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-green-700 mt-1">Completed</div>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          <div className="text-sm text-blue-700 mt-1">In Progress</div>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-yellow-600">{stats.scheduled}</div>
          <div className="text-sm text-yellow-700 mt-1">Scheduled</div>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4 hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
          <div className="text-sm text-red-700 mt-1">Expired</div>
        </div>
        <div className="bg-purple-50 rounded-xl border border-purple-200 p-4 hover:shadow-md transition-shadow">
          <div className="text-2xl font-bold text-purple-600">{stats.avgScore}%</div>
          <div className="text-sm text-purple-700 mt-1">Avg Score</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            type="text"
            placeholder="Search by title, provider, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-primary border border-border rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-core-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 bg-primary border border-border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-primary border border-border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
        >
          {statuses.map(status => (
            <option key={status} value={status}>{status === 'All' ? 'All Statuses' : status}</option>
          ))}
        </select>
      </div>

      {/* Training Cards */}
      {filteredTrainings.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTrainings.map((training) => (
            <div
              key={training.id}
              className="bg-primary rounded-xl border border-border p-5 hover:shadow-md transition-all duration-200 group"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="p-3 rounded-lg bg-core-primary-50 text-core-primary-500">
                  <GraduationCap size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-primary text-base mb-2 group-hover:text-core-primary-500 transition-colors">
                    {training.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(training.category)}`}>
                      {training.category}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {training.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Training Details */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary">Provider:</span>
                  <span className="font-medium text-primary">{training.provider}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary">Duration:</span>
                  <span className="text-primary">{training.duration}</span>
                </div>
                {training.score && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary">Score:</span>
                    <span className="font-semibold text-primary">{training.score}%</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-secondary text-sm">Status:</span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(training.status)}`}>
                    {training.status}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              {training.progress > 0 && training.progress < 100 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-secondary">Progress</span>
                    <span className="font-medium text-primary">{training.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-core-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${training.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Certificate Badge */}
              {training.certificate && (
                <div className="flex items-center gap-2 mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                  <Award size={16} className="text-green-600" />
                  <span className="text-xs text-green-700 font-medium">{training.certificate}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="text-xs text-muted">
                  Start: {training.startDate}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleView(training)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleEdit(training)}
                    className="p-2 text-core-primary-500 hover:bg-core-primary-50 rounded-lg transition-all duration-200"
                    title="Edit Training"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(training.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Delete Training"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-primary rounded-xl border border-border p-12 text-center">
          <div className="w-20 h-20 bg-core-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="text-core-primary-500" size={40} />
          </div>
          <h3 className="text-xl font-semibold text-primary mb-2">No Training Records Found</h3>
          <p className="text-secondary mb-6">
            {searchTerm || filterCategory !== 'All' || filterStatus !== 'All'
              ? 'No training records match your current filters'
              : 'No training records found for this staff member'}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors duration-200"
          >
            Add First Training
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-secondary rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-secondary border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-primary">
                {editingTraining ? 'Edit Training' : 'Add New Training'}
              </h3>
              <button onClick={resetForm} className="p-2 hover:bg-primary rounded-lg transition-colors">
                <X size={20} className="text-secondary" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Training Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Data Security Awareness"
                  className="w-full px-3 py-2.5 bg-primary border border-border rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-core-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-primary border border-border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
                  >
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2.5 bg-primary border border-border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
                  >
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Provider <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  placeholder="e.g., NHS Digital"
                  className="w-full px-3 py-2.5 bg-primary border border-border rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-core-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2.5 bg-primary border border-border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-core-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 2 hours"
                    className="w-full px-3 py-2.5 bg-primary border border-border rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-core-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Additional information..."
                  className="w-full px-3 py-2.5 bg-primary border border-border rounded-lg text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-core-primary-500 resize-none"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-secondary border-t border-border px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={resetForm}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary border border-border rounded-lg text-secondary hover:bg-core-primary-50 hover:text-core-primary-500 hover:border-core-primary-500 transition-all duration-200"
              >
                <X size={18} />
                <span className="font-medium">Cancel</span>
              </button>
              <button
                onClick={editingTraining ? handleUpdate : handleAdd}
                className="flex items-center gap-2 px-6 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors duration-200 shadow-sm"
              >
                <Save size={18} />
                <span className="font-medium">{editingTraining ? 'Update' : 'Add'} Training</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewModal && viewingTraining && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-secondary rounded-xl shadow-xl max-w-2xl w-full">
            <div className="bg-core-primary-50 border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-primary">Training Details</h3>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-primary rounded-lg transition-colors">
                <X size={20} className="text-secondary" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-border">
                <div className="p-4 rounded-lg bg-core-primary-100 text-core-primary-600">
                  <GraduationCap size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-primary mb-1">{viewingTraining.title}</h3>
                  <p className="text-sm text-muted">{viewingTraining.provider}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(viewingTraining.status)}`}>
                  {viewingTraining.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted mb-1">Category</div>
                  <div className="font-medium text-primary">{viewingTraining.category}</div>
                </div>
                <div>
                  <div className="text-xs text-muted mb-1">Type</div>
                  <div className="font-medium text-primary">{viewingTraining.type}</div>
                </div>
                <div>
                  <div className="text-xs text-muted mb-1">Duration</div>
                  <div className="font-medium text-primary">{viewingTraining.duration}</div>
                </div>
                <div>
                  <div className="text-xs text-muted mb-1">Start Date</div>
                  <div className="font-medium text-primary">{viewingTraining.startDate}</div>
                </div>
                {viewingTraining.completionDate && (
                  <>
                    <div>
                      <div className="text-xs text-muted mb-1">Completion Date</div>
                      <div className="font-medium text-primary">{viewingTraining.completionDate}</div>
                    </div>
                    {viewingTraining.expiryDate && (
                      <div>
                        <div className="text-xs text-muted mb-1">Expiry Date</div>
                        <div className="font-medium text-primary">{viewingTraining.expiryDate}</div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {viewingTraining.progress > 0 && (
                <div className="bg-core-primary-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-primary">Progress</span>
                    <span className="text-2xl font-bold text-core-primary-600">{viewingTraining.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-core-primary-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${viewingTraining.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {viewingTraining.score && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                  <span className="text-green-700 font-medium">Assessment Score:</span>
                  <span className="text-3xl font-bold text-green-600">{viewingTraining.score}%</span>
                </div>
              )}

              {viewingTraining.certificate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                  <Award size={24} className="text-blue-600" />
                  <div>
                    <div className="text-xs text-blue-600 mb-1">Certificate Number</div>
                    <div className="font-medium text-blue-800">{viewingTraining.certificate}</div>
                  </div>
                </div>
              )}

              {viewingTraining.notes && (
                <div>
                  <div className="text-xs text-muted mb-2">Notes</div>
                  <div className="text-primary bg-primary border border-border rounded-lg p-3">
                    {viewingTraining.notes}
                  </div>
                </div>
              )}

              <div className="text-xs text-muted pt-2 border-t border-border">
                Assigned by {viewingTraining.assignedBy}
              </div>
            </div>

            <div className="border-t border-border px-6 py-4 flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingTab;                                                     