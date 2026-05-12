import { Footer } from "@/components/sections/Footer";
import { VibeCodingHub } from "@/components/project/VibeCodingHub";
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

  return (
    <>
      <main id="main-content" className="pt-16 sm:pt-20">
        <VibeCodingHub activeTab={activeTab} />
      </main>
      <Footer />
    </>
  );
}
