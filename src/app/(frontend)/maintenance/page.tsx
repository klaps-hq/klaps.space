import { Wrench } from "lucide-react";

export default function MaintenancePage() {
  return (
    <main className="bg-black flex items-center justify-center min-h-screen px-8">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="size-20 rounded-full border border-white/10 flex items-center justify-center">
          <Wrench className="size-8 text-blood-red" strokeWidth={1.5} />
        </div>

        <span className="text-blood-red text-sm uppercase tracking-widest">
          Przerwa techniczna
        </span>

        <h1 className="text-white text-4xl md:text-6xl font-bold uppercase">
          Zaraz wracamy
        </h1>

        <p className="text-neutral-400 text-base md:text-lg max-w-md leading-relaxed">
          Pracujemy nad ulepszeniem serwisu. Strona powinna
          wrócić w&nbsp;ciągu kilku minut.
        </p>

        <div className="w-12 h-px bg-neutral-800 mt-4" />

        <p className="text-xs text-white/30 uppercase tracking-[0.2em]">
          Przepraszamy za utrudnienia
        </p>
      </div>
    </main>
  );
}
