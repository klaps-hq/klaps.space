import AboutPageContent from "./_components/about-page-content";
import SectionHeader from "@/components/common/section-header";
import Breadcrumbs from "@/components/ui/breadcrumbs";

const AboutPage = () => {
  return (
    <main className="bg-black min-h-screen px-8 md:px-16 lg:px-24 pt-28 pb-32 md:pb-40">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          <Breadcrumbs items={[{ name: "O projekcie", href: "/o-projekcie" }]} />
          <SectionHeader prefix="O projekcie" title="Klaps" />
        </div>
        <AboutPageContent />
      </div>
    </main>
  );
};

export default AboutPage;
