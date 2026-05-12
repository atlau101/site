import { Footer } from "@/components/sections/Footer";
import { VibeCodingHub } from "@/components/project/VibeCodingHub";
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

  if (!project) {
    notFound();
  }

  return (
    <>
      <main id="main-content" className="pt-16 sm:pt-20">
        <VibeCodingHub activeTab="projects" activeProjectSlug={project.slug as VibeProjectSlug} />
      </main>
      <Footer />
    </>
  );
}
