"use client";

import React from "react";
import { FileText, X, Download } from "lucide-react";
import { FileData } from "@/lib/api";
import Card from "./Card";

interface FileListProps {
  files: FileData[];
  onRemove: (id: string) => void;
  onDownload?: (file: FileData) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onRemove, onDownload }) => {
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  if (files.length === 0) return null;

  return (
    <Card variant="elevated" className="p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Uploaded Files ({files.length})
      </h3>
      <div className="space-y-3">
        {files.map((file) => (
          <div
            key={file._id}
            className="flex items-center justify-between p-4 glass rounded-lg hover:bg-white/10 transition-smooth"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-lg">
                <FileText className="text-gray-900 dark:text-white flex-shrink-0" size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate text-gray-900 dark:text-white">{file.originalName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatSize(file.size)} •{" "}
                  {new Date(file.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onDownload && (
                <button
                  onClick={() => onDownload(file)}
                  className="text-blue-400 hover:bg-blue-500/20 p-2 rounded-lg transition-smooth"
                  title="Download"
                >
                  <Download size={20} />
                </button>
              )}
              <button
                onClick={() => onRemove(file._id)}
                className="text-red-400 hover:bg-red-500/20 p-2 rounded-lg transition-smooth"
                title="Remove"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FileList;

