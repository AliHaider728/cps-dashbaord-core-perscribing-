import React, { useState } from 'react';
import { Building2, Users, Calendar, MapPin, User, Edit2, MoreVertical, Trash2, Save, X } from 'lucide-react';

const PCNOverview = ({ pcn, practices, notes, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editedPcn, setEditedPcn] = useState(pcn);

  const handleSave = () => {
    onUpdate(editedPcn);
    setIsEditing(false);
    setShowActionsMenu(false);
  };

  const handleDelete = () => {
    onDelete(pcn.id);
    setShowDeleteConfirm(false);
  };

  // Actions Menu Component
  const ActionsMenu = () => (
    <div className="relative">
      <button
        onClick={() => setShowActionsMenu(!showActionsMenu)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-core-primary-900/20 rounded-lg transition-colors"
      >
        <MoreVertical size={20} className="text-gray-600 dark:text-gray-400" />
      </button>

      {showActionsMenu && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowActionsMenu(false)}
          />
          <div className="absolute right-0 top-10 w-48 bg-white dark:bg-core-surface-dark rounded-lg shadow-lg border border-gray-200 dark:border-core-border-dark py-2 z-20">
            <button
              onClick={() => {
                setIsEditing(true);
                setShowActionsMenu(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-core-primary-900/20 flex items-center gap-3 text-gray-700 dark:text-gray-300"
            >
              <Edit2 size={16} />
              <span>Edit PCN</span>
            </button>
            <button
              onClick={() => {
                setShowDeleteConfirm(true);
                setShowActionsMenu(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 text-red-600 dark:text-red-400"
            >
              <Trash2 size={16} />
              <span>Delete PCN</span>
            </button>
          </div>
        </>
      )}
    </div>
  );

  // Delete Confirmation Modal
  const DeleteConfirmModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-core-surface-dark rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-core-border-dark">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete PCN</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete <strong className="text-gray-900 dark:text-white">{pcn.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-core-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-core-primary-900/20 transition-colors text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  // Calculate years active
  const calculateYearsActive = () => {
    if (!pcn.activeSince) return 0;
    const start = new Date(pcn.activeSince);
    const now = new Date();
    const years = Math.floor((now - start) / (1000 * 60 * 60 * 24 * 365.25));
    return years;
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">PCN Overview</h2>
        {!isEditing && <ActionsMenu />}
      </div>

      {/* Summary Cards - Enhanced UI with Dark Mode */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-core-primary-600 dark:to-core-primary-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Building2 className="text-white" size={24} />
            </div>
            <span className="text-blue-100 dark:text-blue-200 text-sm font-medium">Practices</span>
          </div>
          <p className="text-4xl font-bold text-white mb-2">{practices.length}</p>
          <p className="text-blue-100 dark:text-blue-200 text-sm">
            {practices.filter(p => p.status === 'Active').length} Active, {practices.filter(p => p.status === 'Onboarding').length} Onboarding
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Users className="text-white" size={24} />
            </div>
            <span className="text-green-100 dark:text-green-200 text-sm font-medium">Patients</span>
          </div>
          <p className="text-4xl font-bold text-white mb-2">
            {practices.reduce((sum, p) => sum + (p.patients || 0), 0).toLocaleString()}
          </p>
          <p className="text-green-100 dark:text-green-200 text-sm">Total registered patients</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Calendar className="text-white" size={24} />
            </div>
            <span className="text-purple-100 dark:text-purple-200 text-sm font-medium">Active Since</span>
          </div>
          <p className="text-4xl font-bold text-white mb-2">
            {pcn.activeSince ? new Date(pcn.activeSince).getFullYear() : 'N/A'}
          </p>
          <p className="text-purple-100 dark:text-purple-200 text-sm">
            {calculateYearsActive()} years in operation
          </p>
        </div>
      </div>

      {/* PCN Details - Enhanced with Dark Mode */}
      <div className="bg-white dark:bg-core-surface-dark rounded-2xl border border-gray-200 dark:border-core-border-dark shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-core-primary-900/20 dark:to-core-primary-800/20 px-6 py-4 border-b border-gray-200 dark:border-core-border-dark flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">PCN Information</h3>
          {isEditing && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditedPcn(pcn);
                  setIsEditing(false);
                }}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-core-border-dark rounded-lg hover:bg-white dark:hover:bg-core-primary-900/20 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 dark:bg-core-primary-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-core-primary-700 transition-colors text-sm font-medium shadow-sm"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">PCN Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPcn.name}
                  onChange={(e) => setEditedPcn({...editedPcn, name: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-core-border-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-core-primary-600 focus:border-transparent font-medium bg-white dark:bg-core-bg-dark text-gray-900 dark:text-white"
                />
              ) : (
                <p className="text-gray-900 dark:text-white font-semibold text-lg">{pcn.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">PCN Code</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPcn.code}
                  onChange={(e) => setEditedPcn({...editedPcn, code: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-core-border-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-core-primary-600 focus:border-transparent font-medium bg-white dark:bg-core-bg-dark text-gray-900 dark:text-white"
                />
              ) : (
                <p className="text-gray-900 dark:text-white font-semibold text-lg">{pcn.code}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Region</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPcn.region}
                  onChange={(e) => setEditedPcn({...editedPcn, region: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-core-border-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-core-primary-600 focus:border-transparent font-medium bg-white dark:bg-core-bg-dark text-gray-900 dark:text-white"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-gray-400 dark:text-gray-500" />
                  <p className="text-gray-900 dark:text-white font-semibold text-lg">{pcn.region}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Account Manager</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPcn.accountManager}
                  onChange={(e) => setEditedPcn({...editedPcn, accountManager: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-core-border-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-core-primary-600 focus:border-transparent font-medium bg-white dark:bg-core-bg-dark text-gray-900 dark:text-white"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <User size={18} className="text-gray-400 dark:text-gray-500" />
                  <p className="text-gray-900 dark:text-white font-semibold text-lg">{pcn.accountManager}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</label>
              {isEditing ? (
                <select
                  value={editedPcn.status}
                  onChange={(e) => setEditedPcn({...editedPcn, status: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-core-border-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-core-primary-600 focus:border-transparent font-medium bg-white dark:bg-core-bg-dark text-gray-900 dark:text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              ) : (
                <div>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold ${
                    pcn.status === 'Active' 
                      ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700/50' 
                      : 'bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700/50'
                  }`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      pcn.status === 'Active' ? 'bg-green-500' : 'bg-orange-500'
                    }`}></span>
                    {pcn.status}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity - Enhanced with Dark Mode */}
      <div className="bg-white dark:bg-core-surface-dark rounded-2xl border border-gray-200 dark:border-core-border-dark shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-core-primary-900/20 dark:to-core-primary-800/20 px-6 py-4 border-b border-gray-200 dark:border-core-border-dark">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {notes.slice(0, 5).map((note, index) => (
              <div key={note.id} className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-core-primary-900/10 rounded-xl transition-all group cursor-pointer">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  note.priority === 'High' ? 'bg-red-100 dark:bg-red-900/30' :
                  note.priority === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-green-100 dark:bg-green-900/30'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    note.priority === 'High' ? 'bg-red-500' :
                    note.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-core-primary-400 transition-colors">{note.title}</p>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${
                      note.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      note.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {note.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{note.date} • {note.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && <DeleteConfirmModal />}
    </div>
  );
};

export default PCNOverview;