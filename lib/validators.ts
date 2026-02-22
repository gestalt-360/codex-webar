import { z } from 'zod';

export const MAX_VIDEO_SIZE = 15 * 1024 * 1024;

export const createProjectSchema = z.object({
  name: z.string().min(2, 'Nome precisa ter pelo menos 2 caracteres').max(80)
});

export const imageMimeTypes = ['image/jpeg', 'image/png'];
export const videoMimeTypes = ['video/mp4'];
