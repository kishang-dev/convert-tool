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
      className="
        bg-[var(--surface)] border border-[var(--border)] rounded p-5
        text-left w-full group
        hover:border-[var(--accent)] hover:shadow-[0_0_0_1px_var(--accent-ring)]
        hover:bg-[var(--surface-hover)]
        transition-all duration-200 flex items-start gap-4
      "
    >
      <div className="
        bg-[var(--accent-soft)] border border-[var(--border)]
        p-2.5 rounded flex-shrink-0
        group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)]
        transition-all duration-200
      ">
        <Icon
          className="text-[var(--accent)] group-hover:text-white transition-colors duration-200"
          size={20}
        />
      </div>
      <div className="min-w-0">
        <div className="text-[var(--text)] font-medium text-sm leading-snug truncate">{title}</div>
        {description && (
          <div className="text-[var(--text-faint)] text-xs mt-1 leading-relaxed line-clamp-2">{description}</div>
        )}
      </div>
    </button>
  );
};

export default FeatureCard;
