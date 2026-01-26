"use client";

import React from "react";
import { FileText, X, Download } from "lucide-react";
import { FileData } from "@/lib/api";

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
    <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">
        Uploaded Files ({files.length})
      </h3>
      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file._id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <FileText className="text-red-500 flex-shrink-0" size={20} />
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{file.originalName}</p>
                <p className="text-sm text-gray-500">
                  {formatSize(file.size)} •{" "}
                  {new Date(file.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onDownload && (
                <button
                  onClick={() => onDownload(file)}
                  className="text-blue-500 hover:bg-blue-50 p-2 rounded transition-colors"
                  title="Download"
                >
                  <Download size={20} />
                </button>
              )}
              <button
                onClick={() => onRemove(file._id)}
                className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                title="Remove"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
