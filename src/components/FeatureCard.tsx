"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  onClick: () => void;
  gradient?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  onClick,
  gradient = "from-purple-600 to-blue-600",
}) => {
  return (
    <button
      onClick={onClick}
      className="glass rounded-xl p-6 transition-smooth hover-lift hover-glow flex items-center gap-4 w-full text-left group"
    >
      <div className={`bg-gradient-to-br ${gradient} p-3 rounded-lg shadow-lg group-hover:scale-110 transition-smooth`}>
        <Icon className="text-white" size={28} />
      </div>
      <span className="text-white font-semibold text-lg group-hover:text-purple-300 transition-smooth">{title}</span>
    </button>
  );
};

export default FeatureCard;

