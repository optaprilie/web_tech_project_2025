import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { NotesService } from '../services/notes';
import NoteEditor from '../components/notes/NoteEditor';
import NoteCard from '../components/notes/NoteCard';
import { Plus, LogOut, Loader, Search, BookOpen } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Initial Data Fetch
    useEffect(() => {
        async function fetchNotes() {
            if (!currentUser) return;
            try {
                const fetchedNotes = await NotesService.getUserNotes(currentUser.uid, currentUser.email);
                setNotes(fetchedNotes);
            } catch (error) {
                console.error("Failed to load notes", error);
            } finally {
                setLoading(false);
            }
        }
        fetchNotes();
    }, [currentUser, isEditing]); // Re-fetch when editing mode changes (after save)

    async function handleLogout() {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    }

    const handleCreateNote = () => {
        setCurrentNote(null);
        setIsEditing(true);
    };

    const handleEditNote = (note) => {
        setCurrentNote(note);
        setIsEditing(true);
    };

    const handleSaveNote = async (noteData) => {
        try {
            if (currentNote) {
                await NotesService.updateNote(currentNote.id, noteData);
            } else {
                await NotesService.createNote(currentUser.uid, noteData);
            }
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving note", error);
            alert("Failed to save note. Please try again.");
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (window.confirm("Are you sure you want to delete this note?")) {
            try {
                await NotesService.deleteNote(noteId);
                setCurrentNote(null);
                setIsEditing(false);
            } catch (error) {
                console.error("Failed to delete note", error);
                alert("Failed to delete note.");
            }
        }
    };

    // Filter notes based on search
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <div className="loading-screen"><Loader className="spin" /> Loading your notes...</div>;

    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="dashboard-header">
                <div className="logo-section">
                    <h1>My Notes</h1>
                    <span className="user-email">{currentUser?.email}</span>
                </div>
                <div className="header-actions">
                    <button onClick={handleLogout} className="btn-icon">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="dashboard-main">
                {isEditing ? (
                    <NoteEditor
                        initialData={currentNote || {}}
                        onSave={handleSaveNote}
                        onCancel={() => setIsEditing(false)}
                        onDelete={handleDeleteNote}
                    />
                ) : (
                    <>
                        {/* Toolbar */}
                        <div className="dashboard-toolbar">
                            <div className="search-bar">
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search notes by title, subject or tag..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button onClick={handleCreateNote} className="btn-primary create-btn">
                                <Plus size={18} /> New Note
                            </button>
                            <button onClick={() => navigate('/study')} className="btn-secondary create-btn">
                                <BookOpen size={18} /> Study Mode
                            </button>
                        </div>

                        {/* Notes Grid */}
                        {filteredNotes.length === 0 ? (
                            <div className="empty-state">
                                <p>No notes found. Create your first note!</p>
                            </div>
                        ) : (
                            <div className="notes-grid">
                                {filteredNotes.map(note => (
                                    <NoteCard key={note.id} note={note} onClick={handleEditNote} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
