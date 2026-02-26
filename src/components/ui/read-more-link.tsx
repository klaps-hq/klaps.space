import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type LinkWithArrowProps = {
  href: string;
  label: string;
  className?: string;
};

const LinkWithArrow: React.FC<LinkWithArrowProps> = ({
  href,
  label,
  className,
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-neutral-400 text-sm uppercase tracking-widest transition-[color,transform] duration-300 hover:text-blood-red hover:-translate-y-0.5 focus-visible:text-blood-red focus-visible:outline-none",
        className
      )}
    >
      {label}
      <ArrowRight
        className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-px"
        aria-hidden="true"
      />
    </Link>
  );
};

export default LinkWithArrow;
