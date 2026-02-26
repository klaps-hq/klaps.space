import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-[color,background-color,border-color,transform,box-shadow] duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:transform-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 !outline-none",
  {
    variants: {
      variant: {
        default:
          "rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        primary:
          "rounded-none bg-blood-red text-white font-semibold uppercase tracking-[0.2em] shadow-[0_0_0_0_rgba(220,19,1,0)] hover:bg-blood-red/90 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_rgba(220,19,1,0.75)]",
        secondary:
          "rounded-none border-2 border-blood-red bg-transparent text-white font-semibold uppercase tracking-[0.2em] hover:bg-blood-red hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-10px_rgba(220,19,1,0.6)]",
        destructive:
          "rounded-md bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "rounded-md border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        ghost:
          "rounded-md hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        tag: "rounded-none bg-white/5 text-white/80 uppercase tracking-wider border border-white/20 hover:bg-white/10 hover:text-white hover:border-white/40",
        "tag-active":
          "rounded-none bg-blood-red/15 text-blood-red uppercase tracking-wider border border-blood-red/50",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
        xl: "px-8 py-4 text-lg has-[>svg]:px-6",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
