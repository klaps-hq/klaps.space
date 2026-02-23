import { Metadata } from "next";
import AccessibilityPageContent from "./_components/accessibility-page-content";
import { SITE_URL } from "@/lib/site-config";
import SectionHeader from "@/components/common/section-header";

const AccessibilityPage = () => {
  return (
    <main className="bg-black min-h-screen px-8 md:px-16 pt-28 pb-32 md:pb-40">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-16">
        <SectionHeader prefix="Dostępność" title="Deklaracja dostępności" />
        <AccessibilityPageContent />
      </div>
    </main>
  );
};

export const metadata: Metadata = {
  title: "Dostępność",
  description:
    "Deklaracja dostępności serwisu Klaps. Informacje o zgodności ze standardami, obsługiwanych technologiach i sposobach kontaktu.",
  alternates: {
    canonical: `${SITE_URL}/dostepnosc`,
  },
};

export default AccessibilityPage;
