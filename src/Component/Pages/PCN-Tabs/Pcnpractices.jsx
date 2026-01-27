import React, { useState } from 'react';
import { Building2, MapPin, ChevronRight, Edit2, Trash2, MoreVertical, Plus } from 'lucide-react';

const PCNPractices = ({ practices, onSelectPractice, onUpdatePractice, onDeletePractice }) => {
  const [activeActionsMenu, setActiveActionsMenu] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const DeleteConfirmModal = ({ practice, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-core-surface-dark rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-core-border-dark">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Remove Practice</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to remove <strong className="text-gray-900 dark:text-white">{practice.name}</strong> from this PCN?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-core-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-core-primary-900/20 text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onDeletePractice(practice.id);
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700"
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
        className="p-2 hover:bg-gray-100 dark:hover:bg-core-primary-900/20 rounded-lg transition-colors"
      >
        <MoreVertical size={18} className="text-gray-600 dark:text-gray-400" />
      </button>

      {activeActionsMenu === practice.id && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setActiveActionsMenu(null)}
          />
          <div className="absolute right-0 top-10 w-48 bg-white dark:bg-core-surface-dark rounded-lg shadow-lg border border-gray-200 dark:border-core-border-dark py-1 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectPractice(practice);
                setActiveActionsMenu(null);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-core-primary-900/20 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <ChevronRight size={14} />
              <span>View Details</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Edit functionality
                setActiveActionsMenu(null);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-core-primary-900/20 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <Edit2 size={14} />
              <span>Edit Practice</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(practice);
                setActiveActionsMenu(null);
              }}
              className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
            >
              <Trash2 size={14} />
              <span>Remove from PCN</span>
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Practices in this PCN</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 dark:bg-core-primary-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-core-primary-700 transition-colors">
          <Plus size={18} />
          <span>Add Practice</span>
        </button>
      </div>

      <div className="bg-white dark:bg-core-surface-dark rounded-2xl border border-gray-200 dark:border-core-border-dark overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-core-primary-900/20 dark:to-core-primary-800/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Practice</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Code</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Patients</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-core-border-dark">
              {practices.map((practice) => (
                <tr 
                  key={practice.id}
                  className="hover:bg-blue-50/50 dark:hover:bg-core-primary-900/10 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-core-primary-900/30 dark:to-indigo-900/30 rounded-xl flex items-center justify-center border border-blue-200 dark:border-core-primary-700/30">
                        <Building2 className="text-blue-600 dark:text-core-primary-400" size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-core-primary-400 transition-colors">
                          {practice.name}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{practice.manager}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-core-primary-900/30 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-core-border-dark">
                      {practice.code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-900 dark:text-white font-medium">{practice.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">{practice.patients?.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold ${
                      practice.status === 'Active'
                        ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700/50'
                        : 'bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700/50'
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        practice.status === 'Active' ? 'bg-green-500' : 'bg-orange-500'
                      }`}></span>
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