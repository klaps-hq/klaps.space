import React from "react";
import { ICinemaGroup } from "@/interfaces/ICinema";
import { IGenre, IMovieSummary } from "@/interfaces/IMovies";
import SitemapLinkGroup from "./sitemap-link-group";

type SitemapLink = {
  href: string;
  label: string;
};

type SitemapGroup = {
  heading: string;
  links: SitemapLink[];
};

const STATIC_GROUPS: SitemapGroup[] = [
  {
    heading: "Nawigacja",
    links: [
      { href: "/", label: "Strona główna" },
      { href: "/seanse", label: "Seanse" },
      { href: "/filmy", label: "Filmy" },
      { href: "/kina", label: "Kina" },
      { href: "/miasta", label: "Miasta" },
      { href: "/gatunki", label: "Gatunki" },
    ],
  },
  {
    heading: "Informacje",
    links: [
      { href: "/o-projekcie", label: "O projekcie" },
      { href: "/jak-to-dziala", label: "Jak to działa" },
      { href: "/kontakt", label: "Kontakt" },
      { href: "/faq", label: "FAQ" },
      { href: "/regulamin", label: "Regulamin" },
      { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
      { href: "/mapa-witryny", label: "Mapa witryny" },
      { href: "/dostepnosc", label: "Dostępność" },
    ],
  },
];

interface SitemapContentProps {
  cinemaGroups: ICinemaGroup[];
  movies: readonly IMovieSummary[];
  genres: IGenre[];
}

const SitemapContent: React.FC<SitemapContentProps> = ({
  cinemaGroups,
  movies,
  genres,
}) => {
  const sortedGroups = [...cinemaGroups].sort((a, b) =>
    a.city.name.localeCompare(b.city.name, "pl")
  );

  const citiesGroup: SitemapGroup = {
    heading: "Miasta",
    links: sortedGroups.map((group) => ({
      href: `/miasta/${group.city.slug}`,
      label: group.city.name,
    })),
  };

  const cinemasGroup: SitemapGroup = {
    heading: "Kina",
    links: sortedGroups.flatMap((group) =>
      group.cinemas.map((cinema) => ({
        href: `/kina/${cinema.slug}`,
        label: cinema.name,
      }))
    ),
  };

  const moviesGroup: SitemapGroup = {
    heading: "Filmy",
    links: [...movies].map((movie) => ({
      href: `/filmy/${movie.slug}`,
      label: movie.title,
    })),
  };

  const genresGroup: SitemapGroup = {
    heading: "Gatunki",
    links: [...genres]
      .sort((a, b) => a.name.localeCompare(b.name, "pl"))
      .map((genre) => ({
        href: `/gatunki/${genre.slug}`,
        label: genre.name,
      })),
  };

  const allGroups = [
    ...STATIC_GROUPS,
    genresGroup,
    citiesGroup,
    cinemasGroup,
    moviesGroup,
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-14 md:gap-x-20">
      {allGroups.map((group) => (
        <SitemapLinkGroup
          key={group.heading}
          heading={group.heading}
          links={group.links}
        />
      ))}
    </div>
  );
};

export default SitemapContent;
