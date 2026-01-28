import React, { useState } from 'react';
import { Building2, MapPin, ChevronRight, Edit, Trash2, MoreVertical, Plus } from 'lucide-react';

const PCNPractices = ({ practices, onSelectPractice, onUpdatePractice, onDeletePractice }) => {
  const [activeActionsMenu, setActiveActionsMenu] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const DeleteConfirmModal = ({ practice, onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-secondary rounded-xl shadow-2xl max-w-md w-full p-6 border border-border">
        <h3 className="text-lg font-bold text-primary mb-2">Remove Practice</h3>
        <p className="text-secondary mb-6">
          Are you sure you want to remove <strong className="text-primary">{practice.name}</strong> from this PCN?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-border rounded-lg hover:bg-primary transition-colors font-medium text-primary"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onDeletePractice(practice.id);
              onClose();
            }}
            className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );

  const ActionsMenu = ({ practice }) => (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setActiveActionsMenu(activeActionsMenu === practice.id ? null : practice.id);
        }}
        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <MoreVertical size={18} className="text-muted" />
      </button>

      {activeActionsMenu === practice.id && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setActiveActionsMenu(null)}
          />
          <div className="absolute right-0 top-10 w-48 bg-white border border-border rounded-lg shadow-xl py-1 z-20 overflow-hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectPractice(practice);
                setActiveActionsMenu(null);
              }}
              className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium text-primary"
            >
              <ChevronRight size={16} />
              <span>View Details</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveActionsMenu(null);
              }}
              className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium text-primary"
            >
              <Edit size={16} />
              <span>Edit Practice</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(practice);
                setActiveActionsMenu(null);
              }}
              className="w-full px-4 py-2.5 text-left hover:bg-red-50 transition-colors flex items-center gap-2 text-sm font-medium text-red-600"
            >
              <Trash2 size={16} />
              <span>Remove from PCN</span>
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-primary">Practices in this PCN</h3>
          <p className="text-sm text-muted mt-0.5">Manage practices associated with this PCN</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-all hover:shadow-md font-medium">
          <Plus size={18} />
          <span>Add Practice</span>
        </button>
      </div>

      <div className="bg-secondary rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">Practice</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">Code</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">Patients</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-primary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {practices.map((practice) => (
                <tr 
                  key={practice.id}
                  className="hover:bg-primary transition-colors group cursor-pointer"
                  onClick={() => onSelectPractice(practice)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-200">
                        <Building2 className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-primary group-hover:text-core-primary-600 transition-colors">
                          {practice.name}
                        </div>
                        <div className="text-xs text-muted">{practice.manager}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-medium text-primary bg-primary px-3 py-1.5 rounded-lg border border-border">
                      {practice.code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-muted flex-shrink-0" />
                      <span className="text-sm text-primary font-medium">{practice.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-primary">{practice.patients?.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      practice.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-orange-100 text-orange-700 border border-orange-200'
                    }`}>
                      {practice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <ActionsMenu practice={practice} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteConfirm && (
        <DeleteConfirmModal 
          practice={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(null)}
        />
      )}
    </div>
  );
};

export default PCNPractices;