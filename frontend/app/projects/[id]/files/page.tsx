'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { filesApi } from '@/lib/api/files';
import { FileTree } from '@/components/files/FileTree';
import { FileViewer } from '@/components/files/FileViewer';
import { Loader2 } from 'lucide-react';

export default function FilesPage() {
  const params = useParams();
  const projectId = params?.id as string;
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['files', projectId],
    queryFn: () => filesApi.getFileTree(projectId),
    enabled: !!projectId,
  });

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
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load files</p>
          <p className="text-sm text-gray-500">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  if (!data || data.files.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">📁</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            No files yet
          </h2>
          <p className="text-gray-600">
            Start chatting with Claude to generate files for your project
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col md:flex-row">
      {/* File tree sidebar */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r bg-white overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-900">Files</h2>
          <p className="text-xs text-gray-500 mt-1">
            {data.totalSizeMB} MB used
          </p>
        </div>
        <FileTree
          files={data.files}
          selectedFile={selectedFile}
          onSelectFile={setSelectedFile}
        />
      </div>

      {/* File viewer */}
      <div className="flex-1 overflow-hidden">
        {selectedFile ? (
          <FileViewer projectId={projectId} filePath={selectedFile} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Select a file to view its contents</p>
          </div>
        )}
      </div>
    </div>
  );
}
