import React, { useState } from 'react';
import { Building2, Users, Calendar, MapPin, User, Edit, MoreVertical, Trash2, Save, X } from 'lucide-react';

const PCNOverview = ({ pcn, practices, notes, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editedPcn, setEditedPcn] = useState(pcn);

  const handleSave = () => {
    onUpdate(editedPcn);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(pcn.id);
    setShowDeleteConfirm(false);
  };

  const DeleteConfirmModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-secondary rounded-xl shadow-2xl max-w-md w-full p-6 border border-border">
        <h3 className="text-lg font-bold text-primary mb-2">Delete PCN</h3>
        <p className="text-secondary mb-6">
          Are you sure you want to delete <strong className="text-primary">{pcn.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="flex-1 px-4 py-2.5 border border-border rounded-lg hover:bg-primary transition-colors font-medium text-primary"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const calculateYearsActive = () => {
    if (!pcn.activeSince) return 0;
    const start = new Date(pcn.activeSince);
    const now = new Date();
    return Math.floor((now - start) / (1000 * 60 * 60 * 24 * 365.25));
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/60 rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Building2 className="text-white" size={20} />
            </div>
            <h3 className="font-semibold text-blue-900">Practices</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">{practices.length}</p>
          <p className="text-sm text-blue-600/70 mt-1">
            {practices.filter(p => p.status === 'Active').length} Active, {practices.filter(p => p.status === 'Onboarding').length} Onboarding
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/60 rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Users className="text-white" size={20} />
            </div>
            <h3 className="font-semibold text-emerald-900">Patients</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-600">
            {practices.reduce((sum, p) => sum + (p.patients || 0), 0).toLocaleString()}
          </p>
          <p className="text-sm text-emerald-600/70 mt-1">Total registered</p>
        </div>
        
        <div className="bg-gradient-to-br from-violet-50 to-violet-100/50 border border-violet-200/60 rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-violet-500 rounded-lg flex items-center justify-center">
              <Calendar className="text-white" size={20} />
            </div>
            <h3 className="font-semibold text-violet-900">Active Since</h3>
          </div>
          <p className="text-3xl font-bold text-violet-600">
            {pcn.activeSince ? new Date(pcn.activeSince).getFullYear() : 'N/A'}
          </p>
          <p className="text-sm text-violet-600/70 mt-1">{calculateYearsActive()} years</p>
        </div>
      </div>

      {/* PCN Details */}
      <div className="bg-secondary rounded-xl border border-border shadow-sm">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary">PCN Information</h3>
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditedPcn(pcn);
                  setIsEditing(false);
                }}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-primary transition-colors text-sm font-medium"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors text-sm font-medium"
              >
                <Save size={16} />
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-core-primary-50 hover:text-core-primary-600 hover:border-core-primary-300 transition-all text-sm font-medium"
            >
              <Edit size={16} />
              Edit
            </button>
          )}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted font-medium mb-1.5 block">PCN Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPcn.name}
                  onChange={(e) => setEditedPcn({...editedPcn, name: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-core-primary-500 font-medium bg-secondary text-primary"
                />
              ) : (
                <p className="text-primary font-medium">{pcn.name}</p>
              )}
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-muted font-medium mb-1.5 block">PCN Code</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPcn.code}
                  onChange={(e) => setEditedPcn({...editedPcn, code: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-core-primary-500 font-medium bg-secondary text-primary"
                />
              ) : (
                <p className="text-primary font-medium">{pcn.code}</p>
              )}
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-muted font-medium mb-1.5 block">Region</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPcn.region}
                  onChange={(e) => setEditedPcn({...editedPcn, region: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-core-primary-500 font-medium bg-secondary text-primary"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-muted shrink-0" />
                  <p className="text-primary font-medium">{pcn.region}</p>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-muted font-medium mb-1.5 block">Account Manager</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPcn.accountManager}
                  onChange={(e) => setEditedPcn({...editedPcn, accountManager: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-core-primary-500 font-medium bg-secondary text-primary"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <User size={16} className="text-muted shrink-0" />
                  <p className="text-primary font-medium">{pcn.accountManager}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-secondary rounded-xl border border-border shadow-sm">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-primary">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {notes.slice(0, 5).map((note) => (
              <div key={note.id} className="flex items-start gap-4 p-4 hover:bg-primary rounded-xl transition-all">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  note.priority === 'High' ? 'bg-red-100' :
                  note.priority === 'Medium' ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    note.priority === 'High' ? 'bg-red-500' :
                    note.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-primary">{note.title}</p>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${
                      note.priority === 'High' ? 'bg-red-100 text-red-700' :
                      note.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-green-100 text-green-700'
                    }`}>
                      {note.priority}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1">{note.date} • {note.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showDeleteConfirm && <DeleteConfirmModal />}
    </div>
  );
};

export default PCNOverview;