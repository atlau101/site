import { Footer } from '@/components/sections/Footer';
import { ProjectHero } from '@/components/project/ProjectHero';
import { ProjectGeneral } from '@/components/project/ProjectGeneral';
import { ProjectTakeaways } from '@/components/project/ProjectTakeaways';
import { ProjectRedos } from '@/components/project/ProjectRedos';
import { ProjectSpecifics } from '@/components/project/ProjectSpecifics';
import { getProject, getProjectSlugs } from '@/lib/projects';
import { ProjectNavigator } from '@/components/project/ProjectNavigator';
import { getProjectNavigation } from '@/lib/projects/navigation';
import { notFound } from 'next/navigation';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({
    slug,
  }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  const navigation = getProjectNavigation(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <main
        id="main-content"
        className={`pt-16 sm:pt-20 ${navigation ? "pb-32 sm:pb-36" : ""}`}
      >
        <ProjectHero project={project} />
        <ProjectGeneral project={project} />
        <ProjectTakeaways project={project} />
        <ProjectRedos project={project} />
        <ProjectSpecifics project={project} />
      </main>
      {navigation && <ProjectNavigator navigation={navigation} />}
      <Footer />
    </>
  );
}
