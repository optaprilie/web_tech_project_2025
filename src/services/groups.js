import { db } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    query,
    where,
    serverTimestamp
} from 'firebase/firestore';

const GROUPS_COLLECTION = 'groups';

export const StudyGroupService = {
    // Create a new group
    async createGroup(name, creatorEmail) {
        try {
            const docRef = await addDoc(collection(db, GROUPS_COLLECTION), {
                name,
                members: [creatorEmail],
                createdBy: creatorEmail,
                createdAt: serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error creating group: ", error);
            throw error;
        }
    },

    // Get groups user is a member of
    async getUserGroups(userEmail) {
        try {
            const q = query(
                collection(db, GROUPS_COLLECTION),
                where("members", "array-contains", userEmail)
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching groups: ", error);
            throw error;
        }
    },

    // Add member to group
    async addMember(groupId, newMemberEmail) {
        try {
            const groupRef = doc(db, GROUPS_COLLECTION, groupId);
            await updateDoc(groupRef, {
                members: arrayUnion(newMemberEmail)
            });
        } catch (error) {
            console.error("Error adding member: ", error);
            throw error;
        }
    },

    // Remove member from group
    async removeMember(groupId, memberEmail) {
        try {
            const groupRef = doc(db, GROUPS_COLLECTION, groupId);
            await updateDoc(groupRef, {
                members: arrayRemove(memberEmail)
            });
        } catch (error) {
            console.error("Error removing member: ", error);
            throw error;
        }
    }
};
