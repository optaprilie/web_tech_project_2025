import { useState, useCallback, useMemo, useEffect } from 'react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import './NoteEditor.css';
import { Tag, Save, X, Users, Plus } from 'lucide-react';
import { ClassesService } from '../../services/classes';


export default function NoteEditor({ initialData = {}, onSave, onCancel, onDelete }) {
    const [title, setTitle] = useState(initialData.title || '');
    const [content, setContent] = useState(initialData.markdown || '');
    const [subject, setSubject] = useState(initialData.subject || 'General');
    const [tags, setTags] = useState(initialData.tags?.join(', ') || '');
    const [sharedWith, setSharedWith] = useState(initialData.sharedWith?.join(', ') || '');
    const [saving, setSaving] = useState(false);

    // New state for classes
    const [classes, setClasses] = useState([]);
    const [newClass, setNewClass] = useState('');
    const [showAddClass, setShowAddClass] = useState(false);

    const onChange = useCallback((value) => {
        setContent(value);
    }, []);

    // Fetch classes
    useEffect(() => {
        const loadClasses = async () => {
            try {
                const fetchedClasses = await ClassesService.getClasses();
                if (fetchedClasses.length > 0) {
                    setClasses(fetchedClasses);
                } else {
                    // Default classes if none exist in DB
                    setClasses([
                        { name: 'General', id: 'default_1' },
                        { name: 'Web Technologies', id: 'default_2' },
                        { name: 'Mobile Dev', id: 'default_3' }
                    ]);
                }
            } catch (error) {
                console.error("Failed to load classes", error);
            }
        };
        loadClasses();
    }, []);

    const handleAddClass = async () => {
        if (!newClass.trim()) return;
        try {
            const id = await ClassesService.createClass(newClass.trim());
            setClasses([...classes, { id, name: newClass.trim() }]);
            setSubject(newClass.trim());
            setNewClass('');
            setShowAddClass(false);
        } catch (error) {
            console.error("Failed to add class", error);
        }
    };

    const handleSave = async () => {
        if (!title.trim()) return alert('Please enter a title');

        setSaving(true);
        const noteData = {
            title,
            markdown: content,
            subject,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            sharedWith: sharedWith.split(',').map(email => email.trim()).filter(email => email),
            content: content // for search index
        };

        try {
            await onSave(noteData);
        } catch (error) {
            console.error("Failed to save", error);
        } finally {
            setSaving(false);
        }
    };

    // uploadImage function removed as Storage is disabled

    const options = useMemo(() => {
        return {
            autofocus: true,
            spellChecker: false,
            placeholder: "Start taking notes...",
            status: false,
            uploadImage: false, // Disabled as per user request (no storage)
            toolbar: [
                "bold", "italic", "heading", "|",
                "quote", "unordered-list", "ordered-list", "|",
                "link", "image", "|", // 'image' button uses uploadImage when configured
                "preview", "side-by-side", "fullscreen",
            ],
        };
    }, []);

    return (
        <div className="note-editor-container">
            <div className="note-editor-header">
                <input
                    type="text"
                    className="note-title-input"
                    placeholder="Note Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <div className="note-actions">
                    <button className="btn-secondary" onClick={onCancel} disabled={saving}>
                        <X size={18} /> Cancel
                    </button>
                    {initialData.id && (
                        <button className="btn-danger" onClick={() => onDelete(initialData.id)} disabled={saving}>
                            Delete
                        </button>
                    )}
                    <button className="btn-primary" onClick={handleSave} disabled={saving}>
                        <Save size={18} /> {saving ? 'Saving...' : 'Save Note'}
                    </button>
                </div>
            </div>

            <div className="note-meta-controls">
                <div className="form-group-inline">
                    <label>Subject:</label>
                    <div className="subject-select-container" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <select value={subject} onChange={(e) => setSubject(e.target.value)} className="meta-select">
                            {classes.map(cls => (
                                <option key={cls.id} value={cls.name}>{cls.name}</option>
                            ))}
                        </select>
                        <button
                            className="btn-icon-small"
                            title="Add new subject"
                            onClick={() => setShowAddClass(!showAddClass)}
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    {showAddClass && (
                        <div className="add-class-popover" style={{ marginLeft: '10px', display: 'flex', gap: '5px' }}>
                            <input
                                type="text"
                                value={newClass}
                                onChange={(e) => setNewClass(e.target.value)}
                                placeholder="New Subject Name"
                                className="meta-input"
                                style={{ width: '150px' }}
                            />
                            <button className="btn-primary small" onClick={handleAddClass}>Add</button>
                        </div>
                    )}
                </div>

                <div className="form-group-inline">
                    <label><Tag size={14} /></label>
                    <input
                        type="text"
                        placeholder="Tags (comma separated)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="meta-input"
                    />
                </div>

                <div className="form-group-inline">
                    <label><Users size={14} /></label>
                    <input
                        type="text"
                        placeholder="Share with emails (comma separated)"
                        value={sharedWith}
                        onChange={(e) => setSharedWith(e.target.value)}
                        className="meta-input"
                        style={{ minWidth: '250px' }}
                    />
                </div>
            </div>

            <div className="editor-wrapper">
                <SimpleMDE
                    value={content}
                    onChange={onChange}
                    options={options}
                />
            </div>
        </div>
    );
}
