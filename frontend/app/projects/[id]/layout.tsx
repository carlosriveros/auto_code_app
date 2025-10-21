'use client';

import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '@/lib/api/projects';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, FolderOpen, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const projectId = params?.id as string;

  const { data } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.getById(projectId),
    enabled: !!projectId,
  });

  const project = data?.project;

  const tabs = [
    { href: `/projects/${projectId}`, label: 'Chat', icon: MessageSquare },
    {
      href: `/projects/${projectId}/files`,
      label: 'Files',
      icon: FolderOpen,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="touch-target p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {project?.name || 'Loading...'}
            </h1>
          </div>
        </div>

        <nav className="flex border-t overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
