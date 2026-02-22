import axios from 'axios';

export async function uploadToCloudinary(file: File, folder: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary não configurado');
  }

  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', uploadPreset);
  form.append('folder', folder);

  const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data.secure_url as string;
}
