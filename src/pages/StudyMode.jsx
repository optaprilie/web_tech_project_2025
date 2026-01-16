import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NoteEditor from '../components/notes/NoteEditor';
import { NotesService } from '../services/notes';
import { useAuth } from '../context/AuthContext';
import './StudyMode.css';

export default function StudyMode() {
    const { state } = useLocation(); // existing note passed via state
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [videoUrl, setVideoUrl] = useState('');
    const [embedId, setEmbedId] = useState('');

    const handleUrlChange = (e) => {
        const url = e.target.value;
        setVideoUrl(url);
        const id = extractVideoID(url);
        if (id) setEmbedId(id);
    };

    const extractVideoID = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleSaveNote = async (noteData) => {
        try {
            if (state?.note?.id) {
                await NotesService.updateNote(state.note.id, noteData);
            } else {
                await NotesService.createNote(currentUser.uid, noteData);
            }
            alert('Note saved!');
        } catch (error) {
            console.error("Error saving note", error);
            alert("Failed to save note.");
        }
    };

    return (
        <div className="study-mode-container">
            <div className="video-pane">
                <div className="video-input-container">
                    <input
                        type="text"
                        placeholder="Paste YouTube Link here..."
                        value={videoUrl}
                        onChange={handleUrlChange}
                        className="video-url-input"
                    />
                </div>

                {embedId ? (
                    <div className="video-player-wrapper">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${embedId}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="Embedded youtube"
                        />
                    </div>
                ) : (
                    <div className="video-placeholder">
                        <p>Enter a YouTube URL to start watching.</p>
                    </div>
                )}
            </div>

            <div className="notes-pane">
                <NoteEditor
                    initialData={state?.note || {}}
                    onSave={handleSaveNote}
                    onCancel={() => navigate('/')}
                    // Hide Delete in study mode or implement if needed
                    onDelete={() => { }}
                />
            </div>
        </div>
    );
}
