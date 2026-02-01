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
    const baseStyles = 'rounded-xl transition-smooth';

    const variants = {
        default: 'glass',
        elevated: 'glass-strong shadow-xl',
        outlined: 'border-2 border-purple-500/30 bg-transparent',
    };

    const hoverStyles = hover ? 'hover-lift hover-glow cursor-pointer' : '';

    return (
        <div
            className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
            onClick={onClick}
            style={style}
        >
            {children}
        </div>
    );
}
