import React from 'react';

interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'elevated' | 'outlined';
    className?: string;
    hover?: boolean;
    onClick?: () => void;
    style?: React.CSSProperties;
}

export default function Card({
    children,
    variant = 'default',
    className = '',
    hover = false,
    onClick,
    style,
}: CardProps) {
    const variants = {
        default:  'bg-[#111111] border border-[#222222] rounded-xl',
        elevated: 'bg-[#161616] border border-[#2a2a2a] rounded-xl shadow-lg',
        outlined: 'bg-transparent border border-[#2a2a2a] rounded-xl',
    };

    const hoverStyles = hover ? 'cursor-pointer hover:border-[#333] transition-smooth hover:-translate-y-0.5' : '';

    return (
        <div
            className={`${variants[variant]} ${hoverStyles} ${className}`}
            onClick={onClick}
            style={style}
        >
            {children}
        </div>
    );
}
