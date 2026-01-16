import { db } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';

const CLASSES_COLLECTION = 'classes';

export const ClassesService = {
    // Create a new class/subject
    async createClass(name) {
        try {
            const docRef = await addDoc(collection(db, CLASSES_COLLECTION), {
                name,
                createdAt: serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error creating class: ", error);
            throw error;
        }
    },

    // Get all classes
    async getClasses() {
        try {
            const q = query(collection(db, CLASSES_COLLECTION), orderBy("name"));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching classes: ", error);
            throw error;
        }
    },

    // Delete a class
    async deleteClass(classId) {
        try {
            await deleteDoc(doc(db, CLASSES_COLLECTION, classId));
        } catch (error) {
            console.error("Error deleting class: ", error);
            throw error;
        }
    }
};
