"use client";

import { useRouter } from "next/navigation";

interface ReturnHomeAnchorLinkProps {
  targetId: string;
  openSlug?: string;
  className?: string;
  children: React.ReactNode;
}

export function ReturnHomeAnchorLink({
  targetId,
  openSlug,
  className,
  children,
}: ReturnHomeAnchorLinkProps) {
  const router = useRouter();

  const handleClick = () => {
    sessionStorage.setItem("returnTo", targetId);
    if (openSlug) {
      sessionStorage.setItem("accordionOpenForSlug", openSlug);
    } else {
      sessionStorage.removeItem("accordionOpenForSlug");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vt = (document as any).startViewTransition;
    if (vt) {
      vt.call(document, {
        update: () => router.push("/", { scroll: false }),
        types: ["backward"],
      });
    } else {
      router.push("/", { scroll: false });
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
