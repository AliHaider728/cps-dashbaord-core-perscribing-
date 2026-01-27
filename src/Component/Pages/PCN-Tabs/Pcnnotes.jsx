import React, { useState } from 'react';
import { MessageSquare, Plus, Edit2, Trash2, X, Save, MoreVertical } from 'lucide-react';

const PCNNotes = ({ notes, onAddNote, onUpdateNote, onDeleteNote }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [activeActionsMenu, setActiveActionsMenu] = useState(null);

  const NoteModal = ({ note, onClose }) => {
    const [formData, setFormData] = useState(note || {
      type: 'Call',
      title: '',
      description: '',
      priority: 'Medium'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const newNote = {
        ...formData,
        id: note ? note.id : Date.now(),
        date: note ? note.date : new Date().toISOString().split('T')[0],
        user: 'Current User'
      };
      
      if (note) {
        onUpdateNote(newNote);
      } else {
        onAddNote(newNote);
      }
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-core-surface-dark rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-core-border-dark">
          <div className="sticky top-0 bg-white dark:bg-core-surface-dark border-b border-gray-200 dark:border-core-border-dark px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {note ? 'Edit Note' : 'Add New Note'}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-core-primary-900/20 rounded-lg">
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Activity Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-core-border-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-core-primary-600 focus:border-transparent bg-white dark:bg-core-bg-dark text-gray-900 dark:text-white"
                >
                  <option value="Call">Phone Call</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Email">Email</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-core-border-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-core-primary-600 focus:border-transparent bg-white dark:bg-core-bg-dark text-gray-900 dark:text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-core-border-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-core-primary-600 focus:border-transparent bg-white dark:bg-core-bg-dark text-gray-900 dark:text-white"
                placeholder="Brief summary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-core-border-dark rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-core-primary-600 focus:border-transparent resize-none bg-white dark:bg-core-bg-dark text-gray-900 dark:text-white"
                placeholder="Detailed notes..."
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-core-border-dark">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-core-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-core-primary-900/20 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-500 dark:bg-core-primary-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-core-primary-700"
              >
                {note ? 'Update' : 'Add'} Note
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const DeleteConfirmModal = ({ note, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-core-surface-dark rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-core-border-dark">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Note</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to delete this note?
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
              onDeleteNote(note.id);
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const ActionsMenu = ({ note }) => (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setActiveActionsMenu(activeActionsMenu === note.id ? null : note.id);
        }}
        className="p-2 hover:bg-gray-100 dark:hover:bg-core-primary-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
      >
        <MoreVertical size={18} className="text-gray-600 dark:text-gray-400" />
      </button>

      {activeActionsMenu === note.id && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setActiveActionsMenu(null)}
          />
          <div className="absolute right-0 top-10 w-40 bg-white dark:bg-core-surface-dark rounded-lg shadow-lg border border-gray-200 dark:border-core-border-dark py-1 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingNote(note);
                setShowAddModal(true);
                setActiveActionsMenu(null);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-core-primary-900/20 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <Edit2 size={14} />
              <span>Edit</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(note);
                setActiveActionsMenu(null);
              }}
              className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notes & Activity Log</h3>
        <button 
          onClick={() => {
            setEditingNote(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 dark:bg-core-primary-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-core-primary-700 transition-colors"
        >
          <Plus size={18} />
          <span>Add Note</span>
        </button>
      </div>

      <div className="space-y-3">
        {notes.map((note) => (
          <div key={note.id} className="bg-white dark:bg-core-surface-dark rounded-2xl border border-gray-200 dark:border-core-border-dark p-6 hover:shadow-xl transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                  note.type === 'Call' ? 'bg-green-100 border border-green-200 dark:bg-green-900/30 dark:border-green-700/50' :
                  note.type === 'Meeting' ? 'bg-blue-100 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-700/50' :
                  'bg-purple-100 border border-purple-200 dark:bg-purple-900/30 dark:border-purple-700/50'
                }`}>
                  <MessageSquare className={
                    note.type === 'Call' ? 'text-green-600 dark:text-green-400' :
                    note.type === 'Meeting' ? 'text-blue-600 dark:text-blue-400' :
                    'text-purple-600 dark:text-purple-400'
                  } size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{note.title}</h4>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      note.priority === 'High' ? 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700/50' :
                      note.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700/50' :
                      'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-700/30 dark:text-gray-400 dark:border-gray-600/50'
                    }`}>
                      {note.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span className="font-medium">{note.type}</span>
                    <span>•</span>
                    <span>{note.date}</span>
                    <span>•</span>
                    <span>{note.user}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{note.description}</p>
                </div>
              </div>
              <ActionsMenu note={note} />
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <NoteModal 
          note={editingNote}
          onClose={() => {
            setShowAddModal(false);
            setEditingNote(null);
          }}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal 
          note={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(null)}
        />
      )}
    </div>
  );
};

export default PCNNotes;