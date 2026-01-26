"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-4 w-full text-left group"
    >
      <div className="bg-red-100 p-3 rounded-lg group-hover:bg-red-200 transition-colors">
        <Icon className="text-red-500" size={28} />
      </div>
      <span className="text-gray-800 font-medium text-lg">{title}</span>
    </button>
  );
};

export default FeatureCard;
