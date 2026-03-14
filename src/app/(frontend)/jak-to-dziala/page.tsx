import HowItWorksPageContent from "./_components/how-it-works-page-content";
import SectionHeader from "@/components/common/section-header";
import Breadcrumbs from "@/components/ui/breadcrumbs";

const HowItWorksPage = () => {
  return (
    <main className="bg-black min-h-screen px-8 py-32">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          <Breadcrumbs
            items={[{ name: "Jak to działa", href: "/jak-to-dziala" }]}
          />
          <SectionHeader prefix="W trzech krokach" title="Jak to działa" />
        </div>
        <HowItWorksPageContent />
      </div>
    </main>
  );
};

export default HowItWorksPage;
