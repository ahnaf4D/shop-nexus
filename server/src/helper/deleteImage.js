import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CONFIG } from '../config/config.js';

cloudinary.config(CLOUDINARY_CONFIG);

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

export { deleteImage, extractPublicId };
