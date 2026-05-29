import { getProject, projectRegistry } from "./index";

const DATA_SLUGS = [
  "bus315-data-mining",
  "uber-analytics",
  "wildfire-ml",
  "lmu-datathon",
] as const;

/** Maps a project slug to the element ID on the landing page that represents it. */
export function getLandingAnchorId(slug: string): string {
  if (slug === "malloy" || slug.startsWith("malloy-")) return "project-malloy-group";
  if ((DATA_SLUGS as readonly string[]).includes(slug)) return "project-data";
  return `project-${slug}`;
}

export interface ProjectNavItem {
  href: string;
  eyebrow: string;
  label: string;
  description?: string;
  direction: "previous" | "next";
  transitionType: "backward" | "forward";
}

export interface ProjectNavigation {
  currentLabel: string;
  previous?: ProjectNavItem;
  next?: ProjectNavItem;
}

const STANDALONE_CHAIN = [
  "bus315-data-mining",
  "uber-analytics",
  "wildfire-ml",
  "lmu-datathon",
  "sba-credit-deserts",
  "chambergpt",
  "fillmore",
  "vibe-coding",
] as const;

function buildProjectItem(
  slug: string,
  direction: "previous" | "next",
): ProjectNavItem | undefined {
  const project = getProject(slug);

  if (!project) {
    return undefined;
  }

  return {
    href: `/projects/${slug}`,
    eyebrow: direction === "previous" ? "Previous project" : "Next project",
    label: project.title,
    direction,
    transitionType: direction === "previous" ? "backward" : "forward",
  };
}

export function getProjectNavigation(slug: string): ProjectNavigation | null {
  if (slug === "malloy-noble-note") {
    return {
      currentLabel: "Noble Note",
      next: {
        href: "/projects/bus315-data-mining",
        eyebrow: "Next section",
        label: "Data Projects",
        description: "B2B Sales Pipeline Analytics",
        direction: "next",
        transitionType: "forward",
      },
    };
  }

  const currentProject = projectRegistry[slug];
  const currentIndex = STANDALONE_CHAIN.indexOf(
    slug as (typeof STANDALONE_CHAIN)[number],
  );

  if (!currentProject || currentIndex === -1) {
    return null;
  }

  const previous =
    currentIndex === 0
      ? {
          href: "/projects/malloy",
          eyebrow: "Previous section",
          label: "Malloy Group",
          description: "Return to the consulting hub",
          direction: "previous" as const,
          transitionType: "backward" as const,
        }
      : buildProjectItem(STANDALONE_CHAIN[currentIndex - 1], "previous");

  const next =
    currentIndex === STANDALONE_CHAIN.length - 1
      ? undefined
      : buildProjectItem(STANDALONE_CHAIN[currentIndex + 1], "next");

  return {
    currentLabel: currentProject.title,
    previous,
    next,
  };
}
