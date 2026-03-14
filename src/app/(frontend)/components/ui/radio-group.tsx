"use client";

import * as React from "react";
import { CircleIcon } from "lucide-react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

const radioGroupItemVariants = cva(
  "inline-flex items-center justify-center cursor-pointer transition-colors duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] focus-visible:ring-[3px]",
        tag: "rounded-none bg-white/5 text-white/80 uppercase tracking-wider border border-white/20 hover:bg-white/10 hover:text-white hover:border-white/40 data-[state=checked]:bg-blood-red/15 data-[state=checked]:text-blood-red data-[state=checked]:border-blood-red/50 data-[state=checked]:cursor-default",
      },
      size: {
        default: "",
        sm: "h-8 gap-1.5 px-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type RadioGroupItemProps = React.ComponentProps<
  typeof RadioGroupPrimitive.Item
> &
  VariantProps<typeof radioGroupItemVariants>;

function RadioGroupItem({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: RadioGroupItemProps) {
  if (variant === "tag") {
    return (
      <RadioGroupPrimitive.Item
        data-slot="radio-group-item"
        className={cn(radioGroupItemVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </RadioGroupPrimitive.Item>
    );
  }

  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(radioGroupItemVariants({ variant, size, className }))}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem, radioGroupItemVariants };
