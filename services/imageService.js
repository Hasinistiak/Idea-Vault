import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../lib/supabase';
import { supabaseUrl } from '../constants';

// Get the user's image URL from Supabase or use a fallback
export const getUserImageSrc = (imagePath) => {
    if (imagePath) {
        return getSupabaseFileurl(imagePath);
    } else {
        return require('../assets/images/userImage.png');
    }
};

export const getSupabaseFileurl = (filePath) => {
    if (filePath) {
        return `${supabaseUrl}/storage/buckets/User%20Images/${filePath}`;
    }
    return null;
};

// Function to upload a file to Supabase
export const uploadFile = async (fileUri) => {
    try {
        if (!fileUri) {
            throw new Error('File URI is invalid or null.');
        }

        // Log the file URI to check if it's correct
        console.log('File URI:', fileUri);

        // Check if the file exists before attempting to read it
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        console.log('File info:', fileInfo); // Log file info to inspect
        if (!fileInfo.exists) {
            throw new Error('File does not exist at the specified URI.');
        }

        // Read the file as Base64
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        // Decode the Base64 string to binary data
        const fileBuffer = decode(fileBase64);

        // Upload the file to Supabase storage
        const { data, error } = await supabase.storage
            .from('User Images') // Make sure the bucket name is correct
            .upload(fileName, fileBuffer, {
                cacheControl: '3600',
                upsert: false,
                contentType: 'image/*', // Set content type as image
            });

        if (error) {
            console.error('File upload error:', error);
            return { success: false, msg: error.message || 'Could not upload media' };
        }

        console.log('Upload successful:', data);
        return { success: true, data: data.path };
    } catch (error) {
        console.error('File upload error:', error.message || error);
        return { success: false, msg: error.message || 'Could not upload media' };
    }
};


// Generate a file name with a timestamp (no folder structure)
export const getFileName = () => {
    return `${new Date().getTime()}.png`; // .png is used as the file extension
};
