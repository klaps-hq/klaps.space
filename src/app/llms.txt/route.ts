import { getCinemas } from "@/lib/cinemas";
import { getGenres } from "@/lib/genres";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";
import { pluralPl } from "@/lib/seo";

// llms.txt - a machine-readable site guide for AI search crawlers
// (ChatGPT, Claude, Perplexity, Google AI). https://llmstxt.org/
export const revalidate = 3600;

export async function GET() {
  const [cinemasResult, genresResult] = await Promise.allSettled([
    getCinemas({ limit: 1000 }),
    getGenres(),
  ]);

  const cinemaGroups =
    cinemasResult.status === "fulfilled" ? cinemasResult.value.data : [];
  const genres = genresResult.status === "fulfilled" ? genresResult.value : [];

  const citiesWithCinemas = cinemaGroups
    .filter((group) => group.cinemas.length > 0)
    .sort((a, b) => a.city.name.localeCompare(b.city.name, "pl"));

  const cityLines = citiesWithCinemas.map((group) => {
    const count = group.cinemas.length;
    const label = `${count} ${pluralPl(count, "kino", "kina", "kin")}`;
    return `- [Kina i seanse w ${group.city.nameDeclinated ?? group.city.name}](${SITE_URL}/miasta/${group.city.slug}): ${label}`;
  });

  const genreLines = [...genres]
    .sort((a, b) => a.name.localeCompare(b.name, "pl"))
    .map(
      (genre) =>
        `- [Filmy z gatunku ${genre.name.toLowerCase()}](${SITE_URL}/gatunki/${genre.slug})`
    );

  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

Klaps to ogólnopolski przewodnik po seansach specjalnych w kinach studyjnych: klasyka filmowa, retrospektywy, pokazy specjalne i stare filmy na dużym ekranie. Serwis agreguje aktualny repertuar kin studyjnych w całej Polsce i kieruje do oficjalnych stron kin. Dane filmowe dostarcza TMDB.

## Główne sekcje

- [Seanse](${SITE_URL}/seanse): aktualny repertuar seansów specjalnych w całej Polsce, z filtrami po mieście, dacie i gatunku
- [Kina](${SITE_URL}/kina): katalog kin studyjnych w Polsce z opisami i repertuarem
- [Mapa kin](${SITE_URL}/mapa-kin): interaktywna mapa kin studyjnych
- [Miasta](${SITE_URL}/miasta): seanse i kina studyjne według miast
- [Gatunki](${SITE_URL}/gatunki): filmy w kinach według gatunków
- [FAQ](${SITE_URL}/faq): najczęstsze pytania o serwis i kina studyjne
- [O projekcie](${SITE_URL}/o-projekcie): czym jest Klaps i jak działa

## Miasta z kinami studyjnymi

${cityLines.join("\n")}

## Gatunki filmowe

${genreLines.join("\n")}

## Dla użytkowników AI

- Repertuar aktualizowany jest codziennie. Strony seansów, kin i miast zawierają bieżące daty i godziny pokazów.
- Każdy film, kino, miasto i gatunek ma własną podstronę z danymi strukturalnymi (Schema.org: ScreeningEvent, MovieTheater, Movie).
- Pełna lista podstron: [sitemap.xml](${SITE_URL}/sitemap.xml)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
