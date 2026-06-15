import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex h-10 items-center justify-center gap-2 rounded-sm px-4 text-sm font-medium transition-all duration-150 ease-financial focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary-700 text-slate-50 hover:bg-primary-800 focus-visible:outline-primary-700",
        secondary:
          "border border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100 focus-visible:outline-primary-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 dark:hover:bg-slate-950",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-primary-700",
        amber: "bg-amber-600 text-slate-50 hover:bg-amber-600 focus-visible:outline-amber-600",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 px-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
  },
);

Button.displayName = "Button";
