import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    let baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      default: 'border-2 border-blue-500 bg-transparent text-blue-500 font-bold shadow-sm hover:bg-blue-500/10 hover:text-blue-600',
      destructive: 'border-2 border-rose-500 bg-transparent text-rose-500 font-bold shadow-sm hover:bg-rose-500/10 hover:text-rose-600',
      outline: 'border-2 border-blue-500 bg-transparent text-blue-500 font-bold shadow-sm hover:bg-blue-500/10 hover:text-blue-600',
      ghost: 'hover:bg-blue-500/10 hover:text-blue-600 text-blue-500 font-bold',
    };

    const sizes = {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-10 rounded-md px-8',
      icon: 'h-9 w-9',
    };

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <button ref={ref} className={combinedClassName} {...props} />
    );
  }
);
Button.displayName = 'Button';
