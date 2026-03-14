import PrivacyPolicyPageContent from "./_components/privacy-policy-page-content";
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

export default PrivacyPolicyPage;
