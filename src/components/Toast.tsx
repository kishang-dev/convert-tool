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
      className={`fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      } text-white z-50 animate-slideIn`}
    >
      {type === "success" ? (
        <CheckCircle size={20} />
      ) : (
        <AlertCircle size={20} />
      )}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded p-1">
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;
