import React, { useState } from 'react';
import { MessageSquare, Plus, Edit, Trash2, X, MoreVertical } from 'lucide-react';

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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-secondary rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-border">
          <div className="sticky top-0 bg-secondary border-b border-border px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-primary">
              {note ? 'Edit Note' : 'Add New Note'}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <X size={20} className="text-muted" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">Activity Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-core-primary-500 focus:border-transparent bg-secondary text-primary"
                >
                  <option value="Call">Phone Call</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Email">Email</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-core-primary-500 focus:border-transparent bg-secondary text-primary"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-core-primary-500 focus:border-transparent bg-secondary text-primary"
                placeholder="Brief summary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-core-primary-500 focus:border-transparent resize-none bg-secondary text-primary"
                placeholder="Detailed notes..."
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-border rounded-lg hover:bg-primary transition-colors font-medium text-primary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-colors font-medium"
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-secondary rounded-xl shadow-2xl max-w-md w-full p-6 border border-border">
        <h3 className="text-lg font-bold text-primary mb-2">Delete Note</h3>
        <p className="text-secondary mb-6">
          Are you sure you want to delete this note?
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
              onDeleteNote(note.id);
              onClose();
            }}
            className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
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
        className="p-2 hover:bg-gray-200 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
      >
        <MoreVertical size={18} className="text-muted" />
      </button>

      {activeActionsMenu === note.id && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setActiveActionsMenu(null)}
          />
          <div className="absolute right-0 top-10 w-40 bg-white border border-border rounded-lg shadow-xl py-1 z-20 overflow-hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingNote(note);
                setShowAddModal(true);
                setActiveActionsMenu(null);
              }}
              className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium text-primary"
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(note);
                setActiveActionsMenu(null);
              }}
              className="w-full px-4 py-2.5 text-left hover:bg-red-50 transition-colors flex items-center gap-2 text-sm font-medium text-red-600"
            >
              <Trash2 size={16} />
              <span>Delete</span>
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
          <h3 className="text-lg font-semibold text-primary">Notes & Activity Log</h3>
          <p className="text-sm text-muted mt-0.5">Track all interactions and notes</p>
        </div>
        <button 
          onClick={() => {
            setEditingNote(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-core-primary-500 text-white rounded-lg hover:bg-core-primary-600 transition-all hover:shadow-md font-medium"
        >
          <Plus size={18} />
          <span>Add Note</span>
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-16 bg-secondary rounded-xl border border-border border-dashed">
          <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="text-violet-500" size={32} />
          </div>
          <p className="text-secondary font-medium">No notes found</p>
          <p className="text-muted text-sm mt-1">Add your first note to track communications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="bg-secondary rounded-xl border border-border p-6 hover:shadow-lg hover:border-core-primary-200 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    note.type === 'Call' ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200' :
                    note.type === 'Meeting' ? 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200' :
                    'bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200'
                  }`}>
                    <MessageSquare className={
                      note.type === 'Call' ? 'text-emerald-600' :
                      note.type === 'Meeting' ? 'text-blue-600' :
                      'text-violet-600'
                    } size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-primary text-base">{note.title}</h4>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        note.priority === 'High' ? 'bg-red-100 text-red-700' :
                        note.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {note.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted mb-3">
                      <span className="font-medium">{note.type}</span>
                      <span>•</span>
                      <span>{new Date(note.date).toLocaleDateString('en-GB')}</span>
                      <span>•</span>
                      <span>{note.user}</span>
                    </div>
                    <p className="text-primary text-sm leading-relaxed">{note.description}</p>
                  </div>
                </div>
                <ActionsMenu note={note} />
              </div>
            </div>
          ))}
        </div>
      )}

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