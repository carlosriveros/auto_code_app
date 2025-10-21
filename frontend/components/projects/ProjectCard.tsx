import Link from 'next/link';
import { Project } from '@/lib/types';
import { formatRelativeTime } from '@/lib/utils';
import { Folder, Clock } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Folder className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {project.name}
            </h3>
          </div>
        </div>
      </div>

      {project.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
      )}

      <div className="flex items-center text-xs text-gray-500 gap-1">
        <Clock className="h-3 w-3" />
        <span>{formatRelativeTime(project.updated_at)}</span>
      </div>

      {project.deploy_url && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="inline-flex items-center text-xs text-green-600 font-medium">
            🚀 Deployed
          </span>
        </div>
      )}
    </Link>
  );
}
