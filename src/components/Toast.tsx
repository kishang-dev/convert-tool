"use client";

import React from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  return (
    <div
      className={`fixed top-20 right-4 px-4 py-3 rounded-xl bg-[#161616] border shadow-2xl flex items-center gap-3 z-50 animate-slideInRight ${
        type === "success" ? "border-l-4 border-l-white border-[#2a2a2a]" : "border-l-4 border-l-red-500 border-[#2a2a2a]"
      }`}
    >
      {type === "success" ? (
        <CheckCircle size={18} className="text-white flex-shrink-0" />
      ) : (
        <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
      )}
      <span className="text-white text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-1 hover:bg-white/10 rounded p-0.5 transition-colors"
      >
        <X size={15} className="text-[#666]" />
      </button>
    </div>
  );
};

export default Toast;
