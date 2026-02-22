import { promises as fs } from 'fs';
import path from 'path';
import { Project } from './types';

const filePath = path.join(process.cwd(), 'data', 'projects.json');

async function ensureStore() {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, '[]', 'utf-8');
  }
}

export async function readProjects(): Promise<Project[]> {
  await ensureStore();
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as Project[];
}

export async function writeProjects(projects: Project[]) {
  await ensureStore();
  await fs.writeFile(filePath, JSON.stringify(projects, null, 2), 'utf-8');
}

export async function saveProject(project: Project) {
  const projects = await readProjects();
  projects.unshift(project);
  await writeProjects(projects);
}

export async function findProjectBySlug(slug: string) {
  const projects = await readProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}
