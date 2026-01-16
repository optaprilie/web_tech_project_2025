import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const StorageService = {
    async uploadFile(file, folder = 'attachments') {
        try {
            // Create a unique filename: timestamp_filename
            const filename = `${Date.now()}_${file.name}`;
            const storageRef = ref(storage, `${folder}/${filename}`);

            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            return {
                url: downloadURL,
                filename: file.name,
                path: snapshot.ref.fullPath
            };
        } catch (error) {
            console.error("Error uploading file: ", error);
            throw error;
        }
    }
};
