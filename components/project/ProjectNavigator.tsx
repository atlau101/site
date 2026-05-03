import Link from "next/link";
import { ProjectNavigation, ProjectNavItem } from "@/lib/projects/navigation";

interface ProjectNavigatorProps {
  navigation: ProjectNavigation;
}

interface NavActionProps {
  item: ProjectNavItem;
  align: "left" | "right";
}

function NavAction({ item, align }: NavActionProps) {
  const isPrevious = item.direction === "previous";
  const alignmentClass = align === "right" ? "items-end text-right" : "items-start text-left";
  const arrow = isPrevious ? "←" : "→";

  return (
    <Link
      href={item.href}
      transitionTypes={[item.transitionType]}
      className={`group flex flex-col justify-center gap-1 border-[2px] border-foreground bg-background px-3 py-2.5 no-underline transition-transform duration-200 hover:-translate-y-[1px] hover:translate-x-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card sm:px-4 ${alignmentClass}`}
    >
      <span className="annotation text-secondary" style={{ fontSize: "0.64rem" }}>
        {item.eyebrow}
      </span>
      <span className="flex items-center gap-1.5 font-heading text-[0.88rem] font-black uppercase tracking-[0.01em] text-foreground sm:text-[0.96rem]">
        {isPrevious && <span aria-hidden="true">{arrow}</span>}
        <span>{item.label}</span>
        {!isPrevious && <span aria-hidden="true">{arrow}</span>}
      </span>
      {item.description && (
        <span className="text-[0.74rem] leading-snug text-foreground/72 sm:text-xs">
          {item.description}
        </span>
      )}
    </Link>
  );
}

export function ProjectNavigator({ navigation }: ProjectNavigatorProps) {
  const { currentLabel, previous, next } = navigation;
  const isSingleAction = Boolean(previous) !== Boolean(next);
  const singleAction = previous ?? next;
  const singleActionAlignment = previous ? "mr-auto" : "ml-auto";

  return (
    <div
      className="pointer-events-none fixed inset-x-4 z-50 sm:inset-x-6 lg:inset-x-8"
      style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <nav
        aria-label="Project navigation"
        className={`pointer-events-auto border-[2px] border-foreground bg-card p-1.5 ${
          isSingleAction
            ? `mx-0 w-auto md:max-w-lg ${singleActionAlignment}`
            : "mx-auto max-w-4xl"
        }`}
      >
        {isSingleAction && singleAction ? (
          <NavAction
            item={singleAction}
            align={singleAction.direction === "previous" ? "left" : "right"}
          />
        ) : (
          <div className="grid grid-cols-2 gap-1.5 lg:flex lg:items-stretch">
            <div className="lg:flex-1">
              <NavAction item={previous!} align="left" />
            </div>

            <div className="hidden min-w-0 flex-col justify-center border-x-[2px] border-foreground bg-primary px-3 text-center lg:flex">
              <span className="annotation text-primary-foreground/72" style={{ fontSize: "0.62rem" }}>
                Current project
              </span>
              <span className="font-heading text-[0.7rem] font-black uppercase tracking-[0.04em] text-primary-foreground">
                {currentLabel}
              </span>
            </div>

            <div className="lg:flex-1">
              <NavAction item={next!} align="right" />
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
