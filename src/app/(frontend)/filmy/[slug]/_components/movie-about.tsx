import React from "react";
import Link from "next/link";
import { IMovie, IMoviePerson } from "@/interfaces/IMovies";
import { cn, formatDatePL, formatDuration, formatNames } from "@/lib/utils";
import { pluralPl } from "@/lib/seo";

interface CreditItem {
  label: string;
  value: React.ReactNode;
}

// Directors carry a slug, so render each as a link to its page; other people
// (scriptwriters, cast) stay plain text. Falls back to a plain name when a
// director has no slug yet.
const renderPeopleLinks = (
  people?: IMoviePerson[] | null
): React.ReactNode => {
  if (!people || people.length === 0) return null;
  return people.map((person, index) => (
    <React.Fragment key={person.id ?? person.name}>
      {index > 0 && ", "}
      {person.slug ? (
        <Link
          href={`/rezyserzy/${person.slug}`}
          className="border-b border-white/25 hover:border-white pb-0.5 transition-colors"
        >
          {person.name}
        </Link>
      ) : (
        person.name
      )}
    </React.Fragment>
  ));
};

interface AboutCellProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

// Single cell of the bordered data grid. The wrapper provides the top and
// left hairlines, each cell closes itself with the right and bottom ones.
const AboutCell: React.FC<AboutCellProps> = ({ label, children, className }) => (
  <div
    className={cn(
      "border-r border-b border-white/10 px-5 md:px-6 py-5 md:py-6 flex flex-col gap-2",
      className
    )}
  >
    <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">
      {label}
    </span>
    {children}
  </div>
);

interface MovieAboutProps {
  movie: IMovie;
}

const MovieAbout: React.FC<MovieAboutProps> = ({ movie }) => {
  const directorNodes = renderPeopleLinks(movie.directors);
  const scriptwriters = formatNames(movie.scriptwriters ?? movie.screenwriters);
  const actors = formatNames(movie.actors);
  const countries = formatNames(movie.countries ?? movie.countryOfOrigin);
  const premierePL = formatDatePL(movie.polishPremiereDate);

  const credits: CreditItem[] = [
    ...(directorNodes ? [{ label: "Reżyseria", value: directorNodes }] : []),
    ...(scriptwriters ? [{ label: "Scenariusz", value: scriptwriters }] : []),
  ];

  const meta: CreditItem[] = [
    { label: "Rok produkcji", value: movie.productionYear?.toString() ?? "" },
    {
      label: "Czas trwania",
      value: movie.duration ? formatDuration(movie.duration) : "",
    },
    { label: "Produkcja", value: countries ?? "" },
    { label: "Język", value: movie.language?.toUpperCase() ?? "" },
    { label: "Premiera w Polsce", value: premierePL ?? "" },
  ].filter((i) => i.value.trim() !== "");

  if (credits.length === 0 && !actors && meta.length === 0) return null;

  const userRating = movie.ratings?.users;
  const hasRating = !!userRating && userRating.votes > 0;

  return (
    <div className="flex flex-col gap-10 md:gap-12">
      <div className="border-t border-l border-white/10">
        {(credits.length > 0 || hasRating) && (
          <div className="flex flex-col sm:flex-row">
            {credits.map((item) => (
              <AboutCell key={item.label} label={item.label} className="flex-1">
                <span className="text-xl md:text-2xl text-white -tracking-[0.01em] leading-snug">
                  {item.value}
                </span>
              </AboutCell>
            ))}
            {hasRating && (
              <AboutCell label="Ocena widzów" className="flex-1">
                <span className="text-xl md:text-2xl text-white -tracking-[0.01em] leading-snug">
                  {userRating.score.toLocaleString("pl-PL", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                  <span className="text-white/50"> / 10</span>
                  <span className="ml-3 text-xs md:text-sm text-white/50 tracking-normal">
                    {userRating.votes.toLocaleString("pl-PL")}{" "}
                    {pluralPl(userRating.votes, "głos", "głosy", "głosów")}
                  </span>
                </span>
              </AboutCell>
            )}
          </div>
        )}

        {actors && (
          <AboutCell label="Obsada">
            <span className="text-lg md:text-xl text-white/85 leading-relaxed max-w-[75ch]">
              {actors}
            </span>
          </AboutCell>
        )}

        {meta.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:flex-wrap">
            {meta.map((item) => (
              <AboutCell
                key={item.label}
                label={item.label}
                className="sm:flex-1 sm:basis-1/3 lg:basis-0"
              >
                <span className="text-base md:text-lg text-white/85 -tracking-[0.01em]">
                  {item.value}
                </span>
              </AboutCell>
            ))}
          </div>
        )}
      </div>

      {movie.genres.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {movie.genres.map((genre) => (
            <Link
              key={genre.id}
              href={`/gatunki/${genre.slug}`}
              className="inline-flex items-center px-4 h-9 text-[11px] uppercase tracking-wider border text-white/75 border-white/20 hover:text-white hover:border-white/60 transition-colors whitespace-nowrap"
            >
              {genre.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieAbout;
