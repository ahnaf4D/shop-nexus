import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CONFIG } from '../config/config.js';

cloudinary.config(CLOUDINARY_CONFIG);

// Extract public ID from Cloudinary URL
const extractPublicId = (url) => {
  const parts = url.split('/');
  const fileNameWithExtension = parts.pop();
  const publicId = fileNameWithExtension.split('.')[0];
  const versionIndex = parts.findIndex((part) => part.startsWith('v'));
  if (versionIndex !== -1) {
    parts.splice(versionIndex, 1);
  }

  const folderPath = parts.slice(6).join('/');

  return folderPath ? `${folderPath}/${publicId}` : publicId;
};

// Delete image from Cloudinary
const deleteImage = async (imageUrl) => {
  try {
    const publicId = extractPublicId(imageUrl);
    console.log('Extracted publicId:', publicId);
    if (!publicId) {
      console.error('Failed to extract public ID from image URL:', imageUrl);
      return;
    }
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
  }
};

// Upload image to Cloudinary
const uploadImage = async (imageBuffer, name) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'nexus-shop-assets', // Specify the folder name
          public_id: `${Date.now()}_${name.split(' ')[0]}`, // Optional: rename uploaded file
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(imageBuffer); // Use the image buffer from the temporary storage
    });

    return result;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

// Update user image in Cloudinary
const updateUserImage = async (imageBuffer, currentImageUrl, name) => {
  try {
    if (currentImageUrl) {
      await deleteImage(currentImageUrl);
    }
    const result = await uploadImage(imageBuffer, name);
    return result;
  } catch (error) {
    console.error('Error updating user image:', error);
    throw error;
  }
};

export { deleteImage, uploadImage, updateUserImage };
