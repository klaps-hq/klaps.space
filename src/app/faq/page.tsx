import { Metadata } from "next";
import FaqPageContent from "./_components/faq-page-content";
import { SITE_URL } from "@/lib/site-config";
import SectionHeader from "@/components/common/section-header";

const FaqPage = () => {
  return (
    <main className="bg-black min-h-screen px-8 md:px-16 pt-28 pb-32 md:pb-40">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-16">
        <SectionHeader
          prefix="FAQ"
          title="Najczęściej zadawane pytania"
        />
        <FaqPageContent />
      </div>
    </main>
  );
};

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Najczęściej zadawane pytania dotyczące serwisu Klaps. Dowiedz się więcej o seansach, repertuarze, kinach i funkcjach serwisu.",
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
};

export default FaqPage;
