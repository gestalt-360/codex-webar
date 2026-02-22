import { CreateProjectForm } from '@/components/create-project-form';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-10">
      <CreateProjectForm />
    </main>
  );
}
