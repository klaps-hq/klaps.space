import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaThreads,
  FaXTwitter,
} from "react-icons/fa6";
import { SOCIAL_LINKS } from "@/constants";
import { cn } from "@/lib/utils";

type SocialItem = {
  id: string;
  label: string;
  href: string;
  showLabel?: boolean;
  Icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
};

type SocialLinksProps = {
  className?: string;
  linkClassName?: string;
  focusRingOffsetClassName?: string;
  iconSize?: number;
};

const SOCIAL_ITEMS: SocialItem[] = [
  {
    id: "x",
    label: "X",
    href: SOCIAL_LINKS.x,
    showLabel: false,
    Icon: FaXTwitter,
  },
  {
    id: "threads",
    label: "Threads",
    href: SOCIAL_LINKS.threads,
    Icon: FaThreads,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: SOCIAL_LINKS.instagram,
    Icon: FaInstagram,
  },
  {
    id: "facebook",
    label: "Facebook",
    href: SOCIAL_LINKS.facebook,
    Icon: FaFacebookF,
  },
];

const SocialLinks: React.FC<SocialLinksProps> = ({
  className,
  linkClassName,
  focusRingOffsetClassName = "focus-visible:ring-offset-black",
  iconSize = 13,
}) => {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {SOCIAL_ITEMS.map(({ id, label, href, showLabel = true, Icon }) => (
        <a
          key={id}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Klaps na ${label}`}
          className={cn(
            "inline-flex h-8 items-center border border-white/15 bg-white/2 text-[10px] uppercase tracking-[0.16em] text-white/65 transition-all hover:border-blood-red/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blood-red focus-visible:ring-offset-2",
            showLabel ? "gap-2 px-3" : "px-2.5",
            focusRingOffsetClassName,
            linkClassName
          )}
        >
          <Icon size={iconSize} aria-hidden />
          {showLabel && <span>{label}</span>}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
