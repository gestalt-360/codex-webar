import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { randomUUID } from 'crypto';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { saveProject } from '@/lib/projects-store';
import { createProjectSchema, imageMimeTypes, MAX_VIDEO_SIZE, videoMimeTypes } from '@/lib/validators';

function slugify(name: string) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const rand = Math.random().toString(36).slice(2, 9);
  return `${base || 'ar'}-${rand}`;
}

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const name = String(data.get('name') || '');
    const image = data.get('image');
    const video = data.get('video');

    const parsed = createProjectSchema.safeParse({ name });
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    if (!(image instanceof File) || !(video instanceof File)) {
      return NextResponse.json({ error: 'Imagem e vídeo são obrigatórios' }, { status: 400 });
    }

    if (!imageMimeTypes.includes(image.type)) {
      return NextResponse.json({ error: 'Formato de imagem inválido (use JPG/PNG)' }, { status: 400 });
    }

    if (!videoMimeTypes.includes(video.type)) {
      return NextResponse.json({ error: 'Formato de vídeo inválido (use MP4)' }, { status: 400 });
    }

    if (video.size > MAX_VIDEO_SIZE) {
      return NextResponse.json({ error: 'Vídeo excede 15MB' }, { status: 400 });
    }

    const slug = slugify(name);
    const imageUrl = await uploadToCloudinary(image, 'webar/images');
    const videoUrl = await uploadToCloudinary(video, 'webar/videos');

    const project = {
      id: randomUUID(),
      name,
      slug,
      imageUrl,
      videoUrl,
      createdAt: new Date().toISOString()
    };

    await saveProject(project);

    const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/ar/${slug}`;
    const qrCodeDataUrl = await QRCode.toDataURL(publicUrl);

    return NextResponse.json({ project, publicUrl, qrCodeDataUrl });
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao criar experiência AR', details: String(error) }, { status: 500 });
  }
}
