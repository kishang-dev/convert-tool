"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  onClick: () => void;
  gradient?: string;
  description?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  onClick,
  description
}) => {
  return (
    <button
      onClick={onClick}
      className="bg-[#111111] border border-[#222222] rounded-xl p-5 text-left w-full group hover:border-[#333333] hover:bg-[#161616] transition-all duration-200 flex items-start gap-4"
    >
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-2.5 rounded-lg flex-shrink-0 group-hover:border-[#3a3a3a] transition-colors">
        <Icon className="text-white" size={20} />
      </div>
      <div className="min-w-0">
        <div className="text-white font-medium text-sm leading-snug truncate">{title}</div>
        {description && (
          <div className="text-[#666666] text-xs mt-1 leading-relaxed line-clamp-2">{description}</div>
        )}
      </div>
    </button>
  );
};

export default FeatureCard;
