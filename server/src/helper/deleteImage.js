import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CONFIG } from '../config/config.js';

cloudinary.config(CLOUDINARY_CONFIG);

const extractPublicId = (url) => {
  try {
    const parts = url.split('/upload/')[1];
    const publicId = parts.slice(parts.indexOf('/') + 1);
    console.log('Extracted publicId:', publicId);
    return publicId;
  } catch (error) {
    console.error('Error extracting publicId from imageUrl:', error.message);
    return null;
  }
};
const deleteImage = async (imageUrl) => {
  try {
    const publicId = extractPublicId(imageUrl);
    console.log('Extracted publicId:', publicId);
    if (!publicId) {
      console.error('Failed to extract publicId from imageUrl:', imageUrl);
      return;
    }

    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === 'ok') {
      console.log('Image deleted successfully from Cloudinary');
    } else {
      console.error('Failed to delete user image from Cloudinary:', result);
    }
  } catch (error) {
    console.error('Error deleting user image from Cloudinary:', error);
  }
};

export { deleteImage };
