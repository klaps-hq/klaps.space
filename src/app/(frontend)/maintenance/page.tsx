export default function MaintenancePage() {
  return (
    <main className="bg-black text-white min-h-screen flex flex-col">
      <header className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10">
        <div
          aria-label="Klaps"
          className="inline-flex items-center gap-2.5 text-white"
        >
          <svg
            viewBox="0 0 28 20"
            className="w-5 h-5"
            fill="currentColor"
            aria-hidden="true"
          >
            <polygon points="0,8 28,0 28,20 0,12" />
          </svg>
          <span className="text-xl font-medium lowercase tracking-tight">
            klaps
          </span>
        </div>
      </header>

      <section className="flex-1 flex items-center px-6 md:px-12 lg:px-16 py-16 md:py-24">
        <div>
          <p className="mb-6 md:mb-8 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40">
            Przerwa techniczna
          </p>
          <h1 className="text-5xl md:text-8xl lg:text-9xl xl:text-[10rem] font-medium uppercase -tracking-[0.04em] leading-[0.9] text-white">
            Zaraz
            <br />
            wracamy
          </h1>
          <p className="mt-10 md:mt-14 max-w-[48ch] text-lg md:text-2xl lg:text-3xl text-white/75 leading-[1.4] -tracking-[0.005em]">
            Pracujemy nad ulepszeniem serwisu. Strona powinna wrócić
            w&nbsp;ciągu kilku minut.
          </p>
        </div>
      </section>

      <footer className="px-6 md:px-12 lg:px-16 pb-8 md:pb-10 flex items-center justify-between gap-4 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/30">
        <span className="inline-flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="relative inline-flex size-1.5"
          >
            <span className="absolute inset-0 rounded-full bg-white/60 animate-ping" />
            <span className="relative inline-flex size-1.5 rounded-full bg-white/70" />
          </span>
          <span>Status: konserwacja</span>
        </span>
        <span>Przepraszamy za utrudnienia</span>
      </footer>
    </main>
  );
}
