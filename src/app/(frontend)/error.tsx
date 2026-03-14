"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const ErrorPage: React.FC<ErrorPageProps> = ({ reset }) => {
  const handleReset = () => {
    reset();
  };

  return (
    <main className="bg-black min-h-screen px-8 py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-10">
        <AlertTriangle className="size-16 md:size-20 text-blood-red" strokeWidth={1.5} />

        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-blood-red text-sm uppercase tracking-widest">
            Błąd serwera
          </span>
          <h1 className="text-white text-3xl md:text-5xl font-bold uppercase tracking-wide">
            Coś poszło nie tak
          </h1>
          <p className="text-neutral-400 text-base md:text-lg max-w-lg leading-relaxed">
            Wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę lub wróć do
            strony głównej.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3">
          <Button variant="primary" size="lg" onClick={handleReset}>
            Spróbuj ponownie
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/">Strona główna</Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;
