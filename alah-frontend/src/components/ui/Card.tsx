import { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'base' | 'lg';
}

const cardVariants = {
  default: 'bg-white',
  bordered: 'bg-white border border-gray-200',
  elevated: 'bg-white shadow-lg border border-gray-200',
};

const paddingVariants = {
  none: '',
  sm: 'p-4',
  base: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>((
  {
    className,
    variant = 'default',
    padding = 'base',
    ...props
  },
  ref
) => {
  return (
    <div
      ref={ref}
      className={clsx(
        'rounded-lg',
        cardVariants[variant],
        paddingVariants[padding],
        className
      )}
      {...props}
    />
  );
});

Card.displayName = 'Card';

// Card子组件
export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((
  { className, ...props },
  ref
) => (
  <div
    ref={ref}
    className={clsx('flex flex-col space-y-1.5', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>((
  { className, ...props },
  ref
) => (
  <h3
    ref={ref}
    className={clsx('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>((
  { className, ...props },
  ref
) => (
  <p
    ref={ref}
    className={clsx('text-sm text-gray-500', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((
  { className, ...props },
  ref
) => (
  <div ref={ref} className={clsx('pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((
  { className, ...props },
  ref
) => (
  <div
    ref={ref}
    className={clsx('flex items-center pt-6', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';