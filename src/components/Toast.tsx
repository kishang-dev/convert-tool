"use client";

import React from "react";
import { LuCircleCheck as CheckCircle, LuCircleAlert as AlertCircle, LuX as X } from "react-icons/lu";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  return (
    <div
      className={`fixed top-20 right-4 px-4 py-3 rounded bg-[var(--surface)] dark:bg-[var(--bg-elevated)] border shadow-2xl flex items-center gap-3 z-50 animate-slideInRight ${
        type === "success" ? "border-l-4 border-l-white border-[var(--border-strong)] dark:border-[var(--border-strong)]" : "border-l-4 border-l-red-500 border-[var(--border-strong)] dark:border-[var(--border-strong)]"
      }`}
    >
      {type === "success" ? (
        <CheckCircle size={18} className="text-[var(--text)] dark:text-[var(--text)] flex-shrink-0" />
      ) : (
        <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
      )}
      <span className="text-[var(--text)] dark:text-[var(--text)] text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-1 hover:bg-[var(--surface-hover)] rounded p-0.5 transition-colors"
      >
        <X size={15} className="text-[var(--text-muted)]" />
      </button>
    </div>
  );
};

export default Toast;
