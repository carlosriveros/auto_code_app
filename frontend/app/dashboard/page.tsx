'use client';

import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '@/lib/api/projects';
import { ProjectList } from '@/components/projects/ProjectList';
import { CreateProjectButton } from '@/components/projects/CreateProjectButton';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.getAll(),
  });

  return (
    <div className="min-h-screen bg-gray-50 with-bottom-nav">
      <header className="bg-white border-b sticky top-0 z-10 safe-top">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
          <CreateProjectButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load projects</p>
            <p className="text-sm text-gray-500 mt-2">
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        ) : (
          <ProjectList projects={data?.projects || []} />
        )}
      </main>
    </div>
  );
}
