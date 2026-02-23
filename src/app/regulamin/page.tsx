import { Metadata } from "next";
import TermsPageContent from "./_components/terms-page-content";
import { SITE_URL } from "@/lib/site-config";
import SectionHeader from "@/components/common/section-header";

const TermsPage = () => {
  return (
    <main className="bg-black min-h-screen px-8 md:px-16 pt-28 pb-32 md:pb-40">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-16">
        <SectionHeader prefix="Regulamin" title="Zasady korzystania" />
        <TermsPageContent />
      </div>
    </main>
  );
};

export const metadata: Metadata = {
  title: "Regulamin",
  description:
    "Regulamin korzystania z serwisu Klaps. Zasady, odpowiedzialność, prawa autorskie i dane kontaktowe.",
  alternates: {
    canonical: `${SITE_URL}/regulamin`,
  },
};

export default TermsPage;
