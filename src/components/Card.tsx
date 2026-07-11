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
        default:  'bg-[var(--surface)] border border-[var(--border)] rounded-2xl',
        elevated: 'bg-[var(--surface)] border border-[var(--border-strong)] rounded-2xl shadow-[var(--shadow-md)]',
        outlined: 'bg-transparent border border-[var(--border-strong)] rounded-2xl',
    };

    const hoverStyles = hover
        ? 'cursor-pointer hover:border-[var(--accent)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
        : '';

    return (
        <div
            className={`${variants[variant]} ${hoverStyles} ${className} p-5`}
            onClick={onClick}
            style={style}
        >
            {children}
        </div>
    );
}
