"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Flow } from "./Flow";
import { useRouter } from "next/navigation";
import { useChartStore } from "@/store/useChartStore";
import { LuArrowLeft as ArrowLeft, LuLayers as Layers, LuShare2 as Share2, LuDownload as Download, LuSettings as Settings, LuGithub as Github, LuZap as Zap } from "react-icons/lu";
import dynamic from "next/dynamic";

import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { chartApi } from "@/services/api";
import { LuChevronDown as ChevronDown, LuFileJson as FileJson, LuFileText as FileText, LuImage as ImageIcon } from "react-icons/lu";

const PrimaryButton = ({ className, onClick, isLoading, children }: any) => (
  <button
    className={`bg-[var(--accent)] hover:bg-blue-700 text-[var(--text)] dark:text-[var(--text)] rounded shadow-lg transition-all disabled:opacity-50 ${className}`}
    onClick={onClick}
    disabled={isLoading}
  >
    {isLoading ? <span className="animate-spin w-4 h-4 border-2 border-[var(--border)] border-t-white rounded-full"></span> : null}
    {children}
  </button>
);

export const ChartEditor = ({ id }: { id?: string }) => {
  const router = useRouter();
  const [isExporting, setIsExporting] = React.useState(false);
  const [showExportOptions, setShowExportOptions] = React.useState(false);

  const handleExportJSON = async () => {
    if (!id) return;
    setIsExporting(true);
    setShowExportOptions(false);
    try {
      const response = await chartApi.exportFlowchart(id);

      // Since response is a blob from the DOWNLOAD helper
      const blob = new Blob([response.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Try to get filename from headers if possible, otherwise default
      link.setAttribute('download', `flowchart-${id}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export flowchart JSON:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    const flowContainer = document.querySelector('.react-flow') as HTMLElement;
    if (!flowContainer) return;

    setIsExporting(true);
    setShowExportOptions(false);

    // Create a temporary style to hide UI elements during export
    const style = document.createElement('style');
    style.innerHTML = `
      .react-flow__handle, 
      .react-flow__controls, 
      .react-flow__attribution, 
      .react-flow__panel,
      .delete-handle { 
        display: none !important; 
      }
      .ring-2 { 
        box-shadow: none !important; 
      }
    `;

    try {
      document.head.appendChild(style);

      const dataUrl = await toPng(flowContainer, {
        backgroundColor: '#ffffff',
        quality: 1,
        pixelRatio: 2,
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [flowContainer.offsetWidth, flowContainer.offsetHeight]
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, flowContainer.offsetWidth, flowContainer.offsetHeight);
      pdf.save(`flowchart-${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("Failed to export PDF:", error);
    } finally {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
      setIsExporting(false);
    }
  };

  const handleExportImage = async () => {
    const flowContainer = document.querySelector('.react-flow') as HTMLElement;
    if (!flowContainer) return;

    setIsExporting(true);
    setShowExportOptions(false);

    // Create a temporary style to hide UI elements during export
    const style = document.createElement('style');
    style.innerHTML = `
      .react-flow__handle, 
      .react-flow__controls, 
      .react-flow__attribution, 
      .react-flow__panel,
      .delete-handle { 
        display: none !important; 
      }
      .ring-2 { 
        box-shadow: none !important; 
      }
    `;

    try {
      document.head.appendChild(style);

      const dataUrl = await toPng(flowContainer, {
        backgroundColor: '#ffffff',
        quality: 1,
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = `flowchart-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to export image:", error);
    } finally {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
      setIsExporting(false);
    }
  };

  const { currentChart, updateChart } = useChartStore();
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState("");

  const handleTitleClick = () => {
    if (currentChart) {
      setEditTitle(currentChart.title || "Untitled Diagram");
      setIsEditingTitle(true);
    }
  };

  const handleTitleSave = async () => {
    if (id && currentChart && editTitle.trim()) {
      try {
        await updateChart(id, { title: editTitle });
      } catch (err) {
        console.error("Failed to rename chart");
      }
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[var(--bg)] dark:bg-[#0B0F1A] text-slate-900 dark:text-[var(--text)] font-sans overflow-hidden">
      {/* Premium Header */}
      <header className="h-20 border-b border-[var(--border)] dark:border-[var(--border)] flex items-center justify-between px-8 bg-[var(--surface-hover)] dark:bg-[#0B0F1A]/80 backdrop-blur-xl z-[30] sticky top-0 shadow-sm">
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.back()}
            className="p-3 hover:bg-[var(--surface)] dark:hover:bg-[var(--surface)] dark:bg-[var(--accent-soft)] rounded transition-all border border-transparent hover:border-[var(--border)] dark:hover:border-[var(--border)] dark:border-[var(--border)] group"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--text-faint)] dark:text-[var(--text-faint)] group-hover:-translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded flex items-center justify-center shadow-lg shadow-[0_0_0_1px_var(--accent-ring)] transform -rotate-3 group-hover:rotate-0 transition-transform">
              <Layers className="text-[var(--text)] dark:text-[var(--text)] w-6 h-6" />
            </div>
            <div>
              {isEditingTitle ? (
                <input
                  autoFocus
                  className="text-xl font-black tracking-tight bg-transparent border-b-2 border-blue-500 outline-none text-[var(--text)] dark:text-[var(--text)] w-64"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
                />
              ) : (
                <h1
                  onClick={handleTitleClick}
                  className="text-xl font-black tracking-tight bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 bg-clip-text text-transparent leading-none cursor-pointer hover:opacity-80 transition-opacity"
                  title="Click to rename"
                >
                  {currentChart?.title || "Flow Chart"}
                </h1>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em]">{currentChart?.chartType || "FLOWCHART"}</span>
                <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-[var(--surface-hover)]" />
                <span className="text-[10px] text-[var(--text-muted)] dark:text-[var(--text-muted)] font-bold uppercase tracking-wider">PROJECT ASSET</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden lg:flex items-center gap-1 bg-[var(--surface)] dark:bg-[var(--accent-soft)] p-1 rounded mr-4 border border-[var(--border)] dark:border-[var(--border)]">
            <button className="px-6 py-2 text-xs font-bold rounded bg-[var(--surface)] dark:bg-[var(--surface-hover)] text-blue-600 dark:text-blue-400 shadow-sm transition-all">
              Canvas
            </button>
            <button className="px-6 py-2 text-xs font-bold rounded text-[var(--text-faint)] dark:text-[var(--text-faint)] hover:text-[var(--text)] dark:hover:text-[var(--text)] dark:text-[var(--text)] transition-all">
              Elements
            </button>
            <button className="px-6 py-2 text-xs font-bold rounded text-[var(--text-faint)] dark:text-[var(--text-faint)] hover:text-[var(--text)] dark:hover:text-[var(--text)] dark:text-[var(--text)] transition-all">
              Settings
            </button>
          </nav>

          <div className="h-8 w-px bg-[var(--surface-hover)] dark:bg-[var(--surface-hover)] mx-2" />

          <button className="hidden sm:flex items-center gap-2 px-6 py-2.5 hover:bg-[var(--surface)] dark:hover:bg-[var(--surface)] dark:bg-[var(--accent-soft)] text-[var(--text-muted)] dark:text-[var(--text-muted)] rounded text-sm font-bold transition-all border border-transparent hover:border-[var(--border)] dark:hover:border-[var(--border)] dark:border-[var(--border)]">
            <Share2 className="w-4 h-4" />
            <span>Collaboration</span>
          </button>

          <div className="relative">
            <PrimaryButton
              className="px-6 shadow-blue-500/25 h-11 flex items-center gap-2"
              onClick={() => setShowExportOptions(!showExportOptions)}
              isLoading={isExporting}
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showExportOptions ? 'rotate-180' : ''}`} />
            </PrimaryButton>

            {showExportOptions && (
              <div className="absolute right-0 mt-2 w-56 bg-[var(--surface)] dark:bg-[#1A1F2E] border border-[var(--border)] dark:border-[var(--border)] rounded shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-2 space-y-1">
                  <button
                    onClick={handleExportPDF}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[var(--text-muted)] dark:text-[var(--text)] hover:bg-blue-50 dark:hover:bg-[var(--accent)]/10 rounded transition-all group"
                  >
                    <div className="w-8 h-8 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText size={18} />
                    </div>
                    <span>Export as PDF</span>
                  </button>

                  <button
                    onClick={handleExportImage}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[var(--text-muted)] dark:text-[var(--text)] hover:bg-blue-50 dark:hover:bg-[var(--accent)]/10 rounded transition-all group"
                  >
                    <div className="w-8 h-8 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ImageIcon size={18} />
                    </div>
                    <span>Export as PNG</span>
                  </button>

                  <div className="h-px bg-[var(--surface)] dark:bg-[var(--accent-soft)] my-1 mx-2" />

                  <button
                    onClick={handleExportJSON}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[var(--text-muted)] dark:text-[var(--text)] hover:bg-blue-50 dark:hover:bg-[var(--accent)]/10 rounded transition-all group"
                  >
                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileJson size={18} />
                    </div>
                    <span>Raw Data (JSON)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 relative bg-[#F8FAFC] dark:bg-[#0B0F1A]">
          {/* Subtle Background Detail */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />
          <Flow id={id} />
        </main>
      </div>

      {/* Minimal Status Bar */}
      <footer className="h-10 border-t border-[var(--border)] dark:border-[var(--border)] bg-[var(--surface)] dark:bg-[#0B0F1A] flex items-center justify-between px-8 z-[30] shadow-inner">
        <div className="flex items-center gap-6 text-[10px] font-black text-[var(--text-muted)] dark:text-[var(--text-muted)] dark:text-[var(--text-faint)] dark:text-[var(--text-faint)] uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)] animate-pulse" />
            <span className="text-[var(--text-muted)] dark:text-[var(--text-muted)]">Live Sync Active</span>
          </div>
          <div className="h-3 w-px bg-[var(--surface-hover)] dark:bg-[var(--surface-hover)]" />
          <div className="flex items-center gap-2 hover:text-blue-500 cursor-help transition-colors">
            <Zap size={12} strokeWidth={3} />
            <span>Core v1.02</span>
          </div>
        </div>
        <div className="text-[10px] font-bold text-[var(--text-muted)] dark:text-[var(--text-muted)] dark:text-[var(--text-faint)] dark:text-[var(--text-faint)] flex items-center gap-2">
          WORKSPACE: <span className="text-[var(--text)] dark:text-[var(--text)] bg-[var(--surface)] dark:bg-[var(--accent-soft)] px-2 py-0.5 rounded uppercase tracking-tighter">DESIGN-CORE</span>
        </div>
      </footer>
    </div>
  );
};
