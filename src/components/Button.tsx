import React from 'react';
import { LuLoader as Loader2 } from "react-icons/lu";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'accent';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    children: React.ReactNode;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    children,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'font-medium rounded transition-smooth inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed select-none';

    const variants = {
        // Indigo/violet accent — the brand colour
        accent:    'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-sm',
        // Neutral primary (dark/light auto)
        primary:   'bg-[var(--text)] text-[var(--bg)] hover:opacity-85 shadow-sm',
        secondary: 'bg-transparent border border-[var(--border-strong)] text-[var(--text)] hover:bg-[var(--surface-hover)]',
        ghost:     'bg-transparent text-[var(--text-faint)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-7 py-3 text-base',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
            {children}
        </button>
    );
}
