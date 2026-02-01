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
      className={`fixed top-24 right-4 px-6 py-4 rounded-xl glass-strong shadow-xl flex items-center gap-3 z-50 animate-slideInRight ${type === "success" ? "border-l-4 border-green-500" : "border-l-4 border-red-500"
        }`}
    >
      {type === "success" ? (
        <CheckCircle size={20} className="text-green-400" />
      ) : (
        <AlertCircle size={20} className="text-red-400" />
      )}
      <span className="text-white font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded-lg p-1 transition-smooth">
        <X size={18} className="text-gray-300" />
      </button>
    </div>
  );
};

export default Toast;

