import { ARPlayer } from '@/components/ar-player';

async function getProject(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/project/${slug}`, { cache: 'no-store' });
  if (!response.ok) return null;
  return response.json();
}

export default async function ARPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);

  if (!project) {
    return <div className="p-8">Projeto não encontrado.</div>;
  }

  return <ARPlayer imageUrl={project.imageUrl} videoUrl={project.videoUrl} projectName={project.name} />;
}
