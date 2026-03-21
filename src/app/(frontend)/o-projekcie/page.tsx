import AboutPageContent from "./_components/about-page-content";

const AboutPage = () => {
  return (
    <main className="bg-black min-h-screen px-8 lg:px-12 xl:px-16 pt-28 md:pt-36 pb-16 md:pb-24">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-16">
        <AboutPageContent />
      </div>
    </main>
  );
};

export default AboutPage;
