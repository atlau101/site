import { Footer } from "@/components/sections/Footer";
import { VibeCodingHub } from "@/components/project/VibeCodingHub";
import { ProjectNavigator } from "@/components/project/ProjectNavigator";
import { getProjectNavigation } from "@/lib/projects/navigation";
import { getVibeProject, vibeProjects, type VibeProjectSlug } from "@/lib/vibe-coding";
import { notFound } from "next/navigation";

interface VibeProjectPageProps {
  params: Promise<{ project: string }>;
}

export function generateStaticParams() {
  return vibeProjects.map((project) => ({
    project: project.slug,
  }));
}

export default async function VibeProjectPage({ params }: VibeProjectPageProps) {
  const { project: slug } = await params;
  const project = getVibeProject(slug);
  const navigation = getProjectNavigation("vibe-coding");

  if (!project) {
    notFound();
  }

  return (
    <>
      <main
        id="main-content"
        className={`pt-16 sm:pt-20 ${navigation ? "pb-32 sm:pb-36" : ""}`}
      >
        <VibeCodingHub activeTab="projects" activeProjectSlug={project.slug as VibeProjectSlug} />
      </main>
      {navigation && <ProjectNavigator navigation={navigation} />}
      <Footer />
    </>
  );
}
