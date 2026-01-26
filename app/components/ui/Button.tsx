import type { ReactNode } from 'react';

type ButtonProps = {
    children: ReactNode;
    variant?    : 'primary' | 'secondary';
    className?: string;
}

export function Button({ children, variant, className }: ButtonProps) {
    const base = 'inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium transition';

    const variants = {
        primary: 'bg-black text-white',
        secondary: 'border border-black text-black',
    };

    return (
        <button className={`${base} ${variants[variant || 'primary']} ${className}`}>
            {children}
        </button>
    );  
}
