import FaqPageContent from "./_components/faq-page-content";
import SectionHeader from "@/components/common/section-header";
import Breadcrumbs from "@/components/ui/breadcrumbs";

const FaqPage = () => {
  return (
    <main className="bg-black min-h-screen px-8 md:px-16 pt-28 pb-32 md:pb-40">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          <Breadcrumbs items={[{ name: "FAQ", href: "/faq" }]} />
          <SectionHeader prefix="FAQ" title="Najczęściej zadawane pytania" />
        </div>

        <FaqPageContent />
      </div>
    </main>
  );
};

export default FaqPage;
