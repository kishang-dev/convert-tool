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
        default:  'bg-[var(--surface)] border border-[var(--border)] rounded',
        elevated: 'bg-[var(--surface)] border border-[var(--border-strong)] rounded shadow-[var(--shadow-md)]',
        outlined: 'bg-transparent border border-[var(--border-strong)] rounded',
    };

    const hoverStyles = hover
        ? 'cursor-pointer hover:border-[var(--accent)] hover:shadow-[0_0_0_1px_var(--accent-ring)] transition-smooth hover:-translate-y-0.5'
        : '';

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
