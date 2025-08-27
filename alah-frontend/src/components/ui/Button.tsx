import { forwardRef } from 'react';
import { clsx } from 'clsx';

const buttonVariants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
  outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
  ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  accent: 'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500',
  warning: 'bg-warning-500 text-white hover:bg-warning-600 focus:ring-warning-500',
  danger: 'bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-500',
};

const sizeVariants = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-sm',
  base: 'px-4 py-2 text-sm',
  lg: 'px-4 py-2 text-base',
  xl: 'px-6 py-3 text-base',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof sizeVariants;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((
  {
    className,
    variant = 'primary',
    size = 'base',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    children,
    ...props
  },
  ref
) => {
  return (
    <button
      className={clsx(
        // 基础样式
        'inline-flex items-center justify-center font-medium rounded-md',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'transition-colors duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        // 变体样式
        buttonVariants[variant],
        // 尺寸样式  
        sizeVariants[size],
        // 全宽
        fullWidth && 'w-full',
        // 加载状态
        isLoading && 'cursor-not-allowed',
        className
      )}
      disabled={disabled || isLoading}
      ref={ref}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && leftIcon && (
        <span className="mr-2">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';