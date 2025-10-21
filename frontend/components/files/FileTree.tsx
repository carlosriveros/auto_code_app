'use client';

import { useState } from 'react';
import { FileNode } from '@/lib/types';
import { ChevronRight, ChevronDown, File, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileTreeProps {
  files: FileNode[];
  selectedFile: string | null;
  onSelectFile: (path: string) => void;
}

export function FileTree({ files, selectedFile, onSelectFile }: FileTreeProps) {
  return (
    <div className="py-2">
      {files.map((node) => (
        <TreeNode
          key={node.path}
          node={node}
          level={0}
          selectedFile={selectedFile}
          onSelectFile={onSelectFile}
        />
      ))}
    </div>
  );
}

interface TreeNodeProps {
  node: FileNode;
  level: number;
  selectedFile: string | null;
  onSelectFile: (path: string) => void;
}

function TreeNode({ node, level, selectedFile, onSelectFile }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isDirectory = node.type === 'directory';
  const isSelected = selectedFile === node.path;

  const handleClick = () => {
    if (isDirectory) {
      setIsExpanded(!isExpanded);
    } else {
      onSelectFile(node.path);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          'w-full flex items-center gap-2 px-4 py-1.5 hover:bg-gray-100 transition-colors text-left',
          isSelected && 'bg-blue-50 text-blue-600'
        )}
        style={{ paddingLeft: `${level * 16 + 16}px` }}
      >
        {isDirectory ? (
          <>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 flex-shrink-0" />
            )}
            <Folder className="h-4 w-4 flex-shrink-0 text-blue-500" />
          </>
        ) : (
          <>
            <div className="w-4" />
            <File className="h-4 w-4 flex-shrink-0 text-gray-500" />
          </>
        )}
        <span className="text-sm truncate">{node.name}</span>
        {node.size !== undefined && (
          <span className="text-xs text-gray-400 ml-auto">
            {formatFileSize(node.size)}
          </span>
        )}
      </button>

      {isDirectory && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              level={level + 1}
              selectedFile={selectedFile}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
