import { NextResponse } from 'next/server';
import { findProjectBySlug } from '@/lib/projects-store';

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const project = await findProjectBySlug(params.slug);

  if (!project) {
    return NextResponse.json({ error: 'Projeto não encontrado' }, { status: 404 });
  }

  return NextResponse.json(project);
}
