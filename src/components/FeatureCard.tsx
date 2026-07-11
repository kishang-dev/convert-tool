"use client";

import React from "react";
import { IconType } from "react-icons";
import { FiChevronRight } from "react-icons/fi";

interface FeatureCardProps {
  icon: any; // Accept any icon (Lucide or React-Icons)
  title: string;
  onClick: () => void;
  gradient?: string;
  description?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  onClick,
  description,
  gradient
}) => {
  return (
    <div
      onClick={onClick}
      className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[var(--accent)]"
      style={{ 
        cursor: 'pointer', 
        background: 'var(--surface)', 
        border: '1px solid var(--border)', 
        borderRadius: 16, 
        padding: 18, 
        display: 'flex', 
        gap: 14, 
        alignItems: 'flex-start' 
      }}
    >
      <div 
        style={{ 
          flexShrink: 0, 
          width: 44, 
          height: 44, 
          borderRadius: 12, 
          display: 'grid', 
          placeItems: 'center', 
          background: 'var(--surface-hover)' 
        }}
        className="group-hover:bg-[var(--accent-soft)] transition-colors"
      >
        <Icon size={20} className="text-[var(--accent)]" />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h3 style={{ fontFamily: '"Sora", sans-serif', fontWeight: 700, fontSize: 15.5, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text)' }}>
            {title}
          </h3>
        </div>
        {description && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '5px 0 0 0', lineHeight: 1.5, fontFamily: '"Poppins", sans-serif', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {description}
          </p>
        )}
      </div>
      <FiChevronRight size={17} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 4 }} className="group-hover:text-[var(--accent)] transition-colors" />
    </div>
  );
};

export default FeatureCard;
