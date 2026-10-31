import { getCinemas } from "@/lib/cinemas";
import { getGenres } from "@/lib/genres";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";
import { inPlace, pluralPl } from "@/lib/seo";
import { isChainCinema } from "@/lib/cinema-chains";
import { getPublishedPosts } from "@/lib/posts";
import { archiveMonths, monthName, monthPath } from "@/lib/month-stats";

// llms.txt - a machine-readable site guide for AI search crawlers
// (ChatGPT, Claude, Perplexity, Google AI). https://llmstxt.org/
export const revalidate = 3600;

export async function GET() {
  const [cinemasResult, genresResult, postsResult] = await Promise.allSettled([
    getCinemas({ limit: 1000 }),
    getGenres(),
    getPublishedPosts(),
  ]);

  const cinemaGroups =
    cinemasResult.status === "fulfilled" ? cinemasResult.value.data : [];
  const genres = genresResult.status === "fulfilled" ? genresResult.value : [];

  // Year-round independent venues only: the section is "kina studyjne", and
  // counting multiplexes and open-air spots overstated small cities.
  const citiesWithCinemas = cinemaGroups
    .map((group) => ({
      ...group,
      cinemas: group.cinemas.filter(
        (cinema) => !isChainCinema(cinema.name) && !cinema.isOpenAir
      ),
    }))
    .filter((group) => group.cinemas.length > 0)
    .sort((a, b) => a.city.name.localeCompare(b.city.name, "pl"));

  const cityLines = citiesWithCinemas.map((group) => {
    const count = group.cinemas.length;
    const label = `${count} ${pluralPl(count, "kino", "kina", "kin")}`;
    return `- [Kina i seanse ${inPlace(group.city.nameDeclinated ?? group.city.name)}](${SITE_URL}/miasta/${group.city.slug}): ${label}`;
  });

  const genreLines = [...genres]
    .sort((a, b) => a.name.localeCompare(b.name, "pl"))
    .map(
      (genre) =>
        `- [Filmy z gatunku ${genre.name.toLowerCase()}](${SITE_URL}/gatunki/${genre.slug})`
    );

  const posts = postsResult.status === "fulfilled" ? postsResult.value : [];
  const postLines = posts.flatMap((post) =>
    post.slug
      ? [`- [${post.title}](${SITE_URL}/blog/${post.slug})${post.excerpt ? `: ${post.excerpt}` : ""}`]
      : []
  );
  const monthLines = archiveMonths().map(
    (month) => `- [Klaps w liczbach: ${monthName(month)}](${SITE_URL}${monthPath(month)})`
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
- [Klasyka w kinach](${SITE_URL}/klasyka-w-kinach): filmy sprzed co najmniej 25 lat w repertuarze kin, także w podziale na miesiące
- [Kino plenerowe](${SITE_URL}/kino-plenerowe): seanse pod gołym niebem i letnie cykle w polskich miastach
- [FAQ](${SITE_URL}/faq): najczęstsze pytania o serwis i kina studyjne
- [O projekcie](${SITE_URL}/o-projekcie): czym jest Klaps i jak działa
- [Dla kin](${SITE_URL}/dla-kin): darmowa odznaka z linkiem do strony kina na klaps.space
- [O twórcy](${SITE_URL}/o-tworcy): kto prowadzi serwis i redaguje treści
- [Blog](${SITE_URL}/blog): przewodniki po rodzajach seansów i kinach studyjnych

## Dane do cytowania

Miesięczne zestawienia seansów klasyki (filmy sprzed co najmniej 25 lat) w polskich kinach: liczba seansów, kin i miast, najczęściej grane filmy i rankingi miast. Dane udostępniamy na licencji CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/): można je cytować i wykorzystywać z podaniem źródła: Klaps (klaps.space).

- [Klaps w liczbach: bieżący miesiąc](${SITE_URL}/w-liczbach)
${monthLines.join("\n")}

## Wpisy na blogu

${postLines.join("\n")}

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
