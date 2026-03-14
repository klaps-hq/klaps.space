import React from "react";
import FilmFrame from "./film-frame";
import NotFoundActions from "./not-found-actions";

const NotFoundHero: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-12 md:gap-16">
      <FilmFrame />

      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-blood-red text-sm uppercase tracking-widest">
          Błąd 404
        </span>
        <h1 className="text-white text-3xl md:text-5xl font-bold uppercase tracking-wide">
          Zgubiony klaps
        </h1>
        <p className="text-neutral-400 text-base md:text-lg max-w-lg leading-relaxed">
          Ten klaps poszedł w próżnię. Strona, której szukasz, nie istnieje lub
          została przeniesiona.
        </p>
      </div>

      <NotFoundActions />
    </div>
  );
};

export default NotFoundHero;
