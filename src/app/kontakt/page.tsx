import { Metadata } from "next";
import ContactPageContent from "./_components/contact-page-content";
import { SITE_URL } from "@/lib/site-config";
import SectionHeader from "@/components/common/section-header";
import Breadcrumbs from "@/components/ui/breadcrumbs";

const ContactPage = () => {
  return (
    <main className="bg-black min-h-screen px-8 md:px-16 pt-28 pb-32 md:pb-40">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-16">
        <div className="flex flex-col gap-6">
          <Breadcrumbs items={[{ name: "Kontakt", href: "/kontakt" }]} />
          <SectionHeader prefix="Kontakt" title="Napisz do nas" />
        </div>
        <ContactPageContent />
      </div>
    </main>
  );
};

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Skontaktuj się z zespołem Klaps. Współpraca z kinami studyjnymi, zgłoszenia błędów, propozycje nowych kin i funkcji serwisu.",
  alternates: {
    canonical: `${SITE_URL}/kontakt`,
  },
  openGraph: {
    title: "Kontakt - Klaps",
    description:
      "Skontaktuj się z zespołem Klaps. Współpraca z kinami studyjnymi, zgłoszenia i propozycje.",
  },
};

export default ContactPage;
