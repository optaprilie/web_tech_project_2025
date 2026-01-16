import { db } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    deleteDoc,
    updateDoc,
    query,
    where,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';

const NOTES_COLLECTION = 'notes';

export const NotesService = {
    // Create a new note
    async createNote(userId, noteData) {
        try {
            const docRef = await addDoc(collection(db, NOTES_COLLECTION), {
                userId,
                title: noteData.title || 'Untitled Note',
                content: noteData.content || '',
                markdown: noteData.markdown || '', // Store raw markdown
                tags: noteData.tags || [],
                subject: noteData.subject || 'General',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            return docRef.id;
        } catch (error) {
            console.error("Error creating note: ", error);
            throw error;
        }
    },

    // Get all notes for a specific user (including shared ones)
    // Get all notes for a specific user (including shared ones)
    async getUserNotes(userId, userEmail) {
        try {
            // Fetch own notes (removed orderBy to avoid index requirement)
            const ownNotesQuery = query(
                collection(db, NOTES_COLLECTION),
                where("userId", "==", userId)
            );

            // Fetch shared notes
            const sharedNotesQuery = query(
                collection(db, NOTES_COLLECTION),
                where("sharedWith", "array-contains", userEmail)
            );

            const [ownSnapshot, sharedSnapshot] = await Promise.all([
                getDocs(ownNotesQuery),
                getDocs(sharedNotesQuery)
            ]);

            const ownNotes = ownSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isOwner: true }));
            const sharedNotes = sharedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isOwner: false }));

            // Merge and sort client-side
            return [...ownNotes, ...sharedNotes].sort((a, b) => {
                const dateA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : (a.updatedAt || 0);
                const dateB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : (b.updatedAt || 0);
                return dateB - dateA;
            });
        } catch (error) {
            console.error("Error fetching notes: ", error);
            throw error;
        }
    },

    // Update a note
    async updateNote(noteId, updateData) {
        try {
            const noteRef = doc(db, NOTES_COLLECTION, noteId);
            await updateDoc(noteRef, {
                ...updateData,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error updating note: ", error);
            throw error;
        }
    },

    // Delete a note
    async deleteNote(noteId) {
        try {
            await deleteDoc(doc(db, NOTES_COLLECTION, noteId));
        } catch (error) {
            console.error("Error deleting note: ", error);
            throw error;
        }
    }
};
