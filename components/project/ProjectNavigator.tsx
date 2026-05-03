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
  const alignmentClass = align === "right" ? "text-right items-end" : "text-left items-start";
  const arrow = isPrevious ? "←" : "→";

  return (
    <Link
      href={item.href}
      transitionTypes={[item.transitionType]}
      className={`group flex flex-col justify-center gap-1 rounded-sm border border-border/70 bg-background px-4 py-3.5 no-underline transition-colors duration-200 hover:bg-paper-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-5 ${alignmentClass}`}
    >
      <span className="annotation">{item.eyebrow}</span>
      <span className="flex items-center gap-2 font-heading text-base leading-tight text-primary sm:text-lg">
        {isPrevious && <span aria-hidden="true">{arrow}</span>}
        <span>{item.label}</span>
        {!isPrevious && <span aria-hidden="true">{arrow}</span>}
      </span>
      {item.description && (
        <span className="text-sm leading-snug text-foreground/68">
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
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <nav
        aria-label="Project navigation"
        className={`pointer-events-auto border border-border bg-paper-low/95 p-2.5 ${
          isSingleAction
            ? `mx-0 w-auto md:max-w-xl ${singleActionAlignment}`
            : "mx-auto max-w-6xl"
        }`}
      >
        {isSingleAction && singleAction ? (
          <NavAction
            item={singleAction}
            align={singleAction.direction === "previous" ? "left" : "right"}
          />
        ) : (
          <div className="grid grid-cols-2 gap-2.5 lg:flex lg:items-stretch">
            <div className="lg:flex-1">
              <NavAction item={previous!} align="left" />
            </div>

            <div className="hidden lg:flex min-w-0 flex-col justify-center px-3 text-center">
              <span className="annotation">Current project</span>
              <span className="font-heading text-sm leading-tight text-foreground">
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
