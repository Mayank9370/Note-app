import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { PlusCircle, LogOut, Trash2, Edit3 } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';
import CreateNoteModal from './CreateNoteModal';
import logo from '../../assets/top.png';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/notes');
      const notesData = response.data?.data || [];
      setNotes(notesData);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to fetch notes');
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!noteId) return;
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await api.delete(`/api/notes/${noteId}`);
      setNotes(notes.filter(note => note._id !== noteId));
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Failed to delete note');
    }
  };

  const handleNoteCreated = (newNote) => {
    if (newNote?._id) {
      setNotes([newNote, ...notes]);
    } else {
      fetchNotes();
    }
    setShowCreateModal(false);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className='flex items-center'>
              <img src={logo} alt="Logo" className="w-12 mr-2" />
              <span className="text-2xl font-bold text-gray-900">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <div className="text-black mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center border border-gray-200 rounded-2xl bg-white shadow-sm">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-lg text-black mb-6">
            <span>Email: </span> {user?.email}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Create Note</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Edit3 className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No notes yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first note to get started!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Create Your First Note</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note, index) => (
              <div
                key={note._id || `note-${index}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {note.title || 'Untitled'}
                  </h3>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Delete note"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {note.content || 'No content'}
                </p>
                <div className="text-xs text-gray-400">
                  {note.createdAt && <div>Created: {formatDate(note.createdAt)}</div>}
                  {note.updatedAt && note.updatedAt !== note.createdAt && (
                    <div>Updated: {formatDate(note.updatedAt)}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Note Modal */}
      {showCreateModal && (
        <CreateNoteModal
          onClose={() => setShowCreateModal(false)}
          onNoteCreated={handleNoteCreated}
        />
      )}
    </div>
  );
};

export default Dashboard;