import { Calendar, Tag } from 'lucide-react';
import './NoteCard.css';

export default function NoteCard({ note, onClick }) {
    const date = note.updatedAt?.toDate().toLocaleDateString() || 'Just now';

    return (
        <div className="note-card" onClick={() => onClick(note)}>
            <div className="note-card-header">
                <span className="note-subject">{note.subject}</span>
                <span className="note-date">
                    <Calendar size={12} /> {date}
                </span>
            </div>

            <h3 className="note-title">{note.title}</h3>

            <p className="note-preview">
                {note.markdown
                    ? note.markdown.substring(0, 100) + (note.markdown.length > 100 ? '...' : '')
                    : 'No additional text'}
            </p>

            <div className="note-tags">
                {note.tags && note.tags.map((tag, index) => (
                    <span key={index} className="note-tag">
                        <Tag size={10} /> {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}
