
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Storage for tasker profile images
const taskerStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tasker_profiles',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

// Storage for service images
const serviceStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'service_images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }],
  },
});

// Upload middlewares
const uploadTaskerProfile = multer({ storage: taskerStorage });
const uploadServiceImage = multer({ storage: serviceStorage });

export { uploadTaskerProfile, uploadServiceImage };
export default uploadTaskerProfile;
