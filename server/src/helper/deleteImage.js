import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CONFIG } from '../config/config.js';
cloudinary.config(CLOUDINARY_CONFIG);
const extractPublicFormUrl = (url) => {
  const parts = url.split('/');
  const publicIdWithExt = parts[parts.length - 1];
  const publicId = publicIdWithExt.split('.')[0];
  return publicId;
};
const deleteImage = async (imageUrl) => {
  try {
    const publicId = extractPublicFormUrl(imageUrl);
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === 'ok') {
      console.log('image deleted successfully from cloudinary');
    } else {
      console.error('Failed to delete user image from cloudinary');
    }
  } catch (error) {
    console.error('Error deleting user image from cloudinary : ', error);
  }
};
export { deleteImage };
