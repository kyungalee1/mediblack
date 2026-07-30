import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-base font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-navy text-white shadow-sm hover:bg-navy-light",
        secondary:
          "bg-slate-100 text-navy hover:bg-slate-200",
        outline:
          "border-2 border-slate-200 bg-white text-navy hover:border-navy/30 hover:bg-slate-50",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-navy",
        gold: "bg-gold text-navy shadow-sm hover:bg-gold-light",
      },
      size: {
        default: "h-14 px-6",
        sm: "h-11 rounded-xl px-4 text-sm",
        lg: "h-16 px-8 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = "Button";
