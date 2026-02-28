import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit items-center px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em]",
  {
    variants: {
      variant: {
        default: "bg-blood-red text-white",
        outline: "border-2 border-blood-red text-blood-red bg-transparent",
        label:
          "border-l-4 border-l-blood-red bg-transparent text-white pl-4 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  suffix?: string;
}

const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  children,
  "aria-label": ariaLabel,
  suffix,
  ...props
}) => {
  const resolvedAriaLabel =
    ariaLabel ?? (typeof children === "string" ? children : undefined);

  return (
    <span
      className={cn(
        badgeVariants({ variant, className }),
        "flex flex-col gap-1 items-start"
      )}
      aria-label={resolvedAriaLabel}
      {...props}
    >
      <span className="text-[14px] uppercase font-semibold tracking-[0.3em]">
        {children}
      </span>
      {suffix && (
        <span className="text-[12px] uppercase tracking-[0.3em] text-[#B3B3B3]">
          {suffix}
        </span>
      )}
    </span>
  );
};

export { Badge, badgeVariants };
