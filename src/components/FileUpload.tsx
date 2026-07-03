import React, { useCallback, useState } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useSvgStore } from "../store/useSvgStore";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const FileUpload: React.FC = () => {
  const { setFile, originalPreview, uploading, convertImage, reset } =
    useSvgStore();
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      if (files && files[0]) {
        setFile(files[0]);
      }
    },
    [setFile]
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {!originalPreview ? (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={cn(
            "relative group cursor-pointer border-2 border-dashed rounded p-12 transition-all duration-300 flex flex-col items-center justify-center space-y-4",
            isDragging
              ? "border-blue-500 bg-blue-50/50 scale-[1.02]"
              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          )}
        >
          <input
            type="file"
            onChange={onFileChange}
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold text-slate-800">
              Click or drag image here
            </p>
            <p className="text-slate-500 mt-1">PNG, JPG, WEBP up to 10MB</p>
          </div>
        </div>
      ) : (
        <div className="relative rounded overflow-hidden border border-slate-200 bg-[var(--surface)] group shadow-xl transition-all duration-500 animate-in fade-in zoom-in slide-in-from-bottom-4">
          <div className="aspect-video w-full bg-slate-50 flex items-center justify-center p-4">
            <img
              src={originalPreview}
              alt="Original preview"
              className="max-w-full max-h-full object-contain rounded shadow-sm"
            />
          </div>

          <div className="p-6 bg-[var(--surface)] border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-slate-600">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900 truncate max-w-[200px]">
                  {useSvgStore.getState().file?.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(
                    (useSvgStore.getState().file?.size || 0) /
                    1024 /
                    1024
                  ).toFixed(2)}{" "}
                  MB
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={reset}
                className="p-2.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                disabled={uploading}
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={convertImage}
                disabled={uploading}
                className={cn(
                  "px-6 py-2.5 rounded font-semibold transition-all duration-300",
                  uploading
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-[var(--accent)] text-[var(--text)] dark:text-[var(--text)] hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95"
                )}
              >
                {uploading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                    <span>Converting...</span>
                  </div>
                ) : (
                  "Convert to SVG"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
