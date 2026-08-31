import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Premium base: full pill, fluid mass physics on press (skill §4B/§5B)
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium font-display transition-[color,background-color,border-color,box-shadow,transform] duration-300 ease-fluid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // Brand blue — navigation & general primary actions
        default:
          'bg-primary text-primary-foreground hover:bg-primary-container shadow-flat-plus btn-glow',
        // Orange — reserved STRICTLY for conversion CTAs (Apply Now / Submit)
        cta: 'bg-cta text-cta-foreground hover:bg-cta/90 shadow-flat-plus btn-glow',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/70',
        outline:
          'border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground',
        ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        // Frosted glass — for use on colored/gradient panels
        glass: 'bg-white/70 border border-white/40 text-foreground hover:bg-white/90 shadow-flat-plus',
        // Gradient button
        gradient: 'bg-gradient-to-r from-primary to-cta text-white hover:from-primary-container hover:to-cta-container shadow-flat-plus btn-glow',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-9 px-4',
        lg: 'h-12 px-7 text-base',
        xl: 'h-14 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
