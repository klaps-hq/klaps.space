import { Metadata } from "next";
import PrivacyPolicyPageContent from "./_components/privacy-policy-page-content";
import { SITE_URL } from "@/lib/site-config";
import SectionHeader from "@/components/common/section-header";

const PrivacyPolicyPage = () => {
  return (
    <main className="bg-black min-h-screen px-8 md:px-16 pt-28 pb-32 md:pb-40">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-16">
        <SectionHeader
          prefix="Polityka prywatności"
          title="Ochrona danych"
        />
        <PrivacyPolicyPageContent />
      </div>
    </main>
  );
};

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Polityka prywatności serwisu Klaps. Informacje o przetwarzaniu danych, plikach cookies i prawach użytkowników.",
  alternates: {
    canonical: `${SITE_URL}/polityka-prywatnosci`,
  },
};

export default PrivacyPolicyPage;
