import React from "react";
import { LuDownload as Download, LuRefreshCw as RefreshCw, LuLayers as Layers } from "react-icons/lu";
import { useSvgStore } from "../store/useSvgStore";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SvgPreview: React.FC = () => {
  const { svgUrl, originalPreview, result, reset } = useSvgStore();

  if (!svgUrl) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(svgUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", result?.filename || "converted.svg");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Original Image Card */}
        <div className="bg-[var(--surface)] rounded border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-semibold text-slate-900 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>Original Image</span>
            </h3>
          </div>
          <div className="aspect-square w-full bg-slate-50 flex items-center justify-center p-8">
            <img
              src={originalPreview!}
              alt="Original"
              className="max-w-full max-h-full object-contain rounded"
            />
          </div>
        </div>

        {/* SVG Result Card */}
        <div className="bg-[var(--surface)] rounded border border-blue-100 overflow-hidden shadow-xl shadow-blue-50">
          <div className="px-6 py-4 border-b border-blue-50 flex items-center justify-between bg-blue-50/30">
            <h3 className="font-semibold text-blue-900 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>Vector Version</span>
            </h3>
            {result?.paths && (
              <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center space-x-1">
                <Layers className="w-3 h-3" />
                <span>{result.paths.length} Layers</span>
              </span>
            )}
          </div>
          <div className="aspect-square w-full bg-[#f8fafc] flex items-center justify-center p-8 relative group">
            {/* Checkerboard background for transparency */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#000 1px, transparent 0)",
                backgroundSize: "16px 16px",
              }}
            />
            <img
              src={svgUrl}
              alt="SVG Preview"
              className="max-w-full max-h-full object-contain relative z-10"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={reset}
          className="w-full sm:w-auto px-8 py-4 rounded font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Convert Another</span>
        </button>

        <button
          onClick={handleDownload}
          className="w-full sm:w-auto px-10 py-4 bg-[var(--accent)] text-[var(--text)] dark:text-[var(--text)] rounded font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center space-x-3"
        >
          <Download className="w-6 h-6" />
          <span>Download SVG</span>
        </button>
      </div>
    </div>
  );
};
