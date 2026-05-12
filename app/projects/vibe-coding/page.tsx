import { Footer } from "@/components/sections/Footer";
import { VibeCodingHub } from "@/components/project/VibeCodingHub";
import { ProjectNavigator } from "@/components/project/ProjectNavigator";
import { getProjectNavigation } from "@/lib/projects/navigation";
import { isVibeTabId, type VibeTabId } from "@/lib/vibe-coding";

interface VibeCodingPageProps {
  searchParams?: Promise<{ tab?: string | string[] }>;
}

function resolveTab(value: string | string[] | undefined): VibeTabId {
  const tab = Array.isArray(value) ? value[0] : value;
  return tab && isVibeTabId(tab) ? tab : "story";
}

export default async function VibeCodingPage({ searchParams }: VibeCodingPageProps) {
  const params = searchParams ? await searchParams : {};
  const activeTab = resolveTab(params.tab);
  const navigation = getProjectNavigation("vibe-coding");

  return (
    <>
      <main
        id="main-content"
        className={`pt-16 sm:pt-20 ${navigation ? "pb-32 sm:pb-36" : ""}`}
      >
        <VibeCodingHub activeTab={activeTab} />
      </main>
      {navigation && <ProjectNavigator navigation={navigation} />}
      <Footer />
    </>
  );
}
