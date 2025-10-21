'use client';

import { useQuery } from '@tanstack/react-query';
import { filesApi } from '@/lib/api/files';
import { Loader2, Download } from 'lucide-react';

interface FileViewerProps {
  projectId: string;
  filePath: string;
}

export function FileViewer({ projectId, filePath }: FileViewerProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['file', projectId, filePath],
    queryFn: () => filesApi.readFile(projectId, filePath),
    enabled: !!projectId && !!filePath,
  });

  const handleDownload = () => {
    if (!data) return;

    const blob = new Blob([data.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filePath.split('/').pop() || 'file.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-600">Failed to load file</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium text-gray-900 truncate">{filePath}</h3>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <pre className="p-4 text-sm font-mono leading-relaxed">
          <code>{data.content}</code>
        </pre>
      </div>
    </div>
  );
}
