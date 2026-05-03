"use client";

import Link from "next/link";

interface ReturnHomeAnchorLinkProps {
  targetId: string;
  className?: string;
  children: React.ReactNode;
}

export function ReturnHomeAnchorLink({
  targetId,
  className,
  children,
}: ReturnHomeAnchorLinkProps) {
  return (
    <Link
      href={`/?section=${targetId}`}
      transitionTypes={["backward"]}
      className={className}
    >
      {children}
    </Link>
  );
}
