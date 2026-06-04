// Pobiera og:image wszystkich podstron z lokalnego dev servera do ./og-previews/
// Użycie: bun scripts/og-preview.mjs [baseUrl]
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:3000";

const STATIC_PAGES = [
  "/",
  "/o-projekcie",
  "/faq",
  "/kontakt",
  "/regulamin",
  "/polityka-prywatnosci",
  "/seanse",
  "/kina",
  "/miasta",
  "/gatunki",
  "/mapa-kin",
];

// Z listingów wyciągamy po jednym przykładzie strony dynamicznej
const DISCOVER = [
  ["/seanse", /href="(\/filmy\/[a-z0-9-]+)"/],
  ["/seanse", /href="(\/seanse\/\d+)"/],
  ["/kina", /href="(\/kina\/[a-z0-9-]+)"/],
  ["/miasta", /href="(\/miasta\/[a-z0-9-]+)"/],
  ["/gatunki", /href="(\/gatunki\/[a-z0-9-]+)"/],
];

const discoverPages = async () => {
  const found = new Set();
  for (const [listing, pattern] of DISCOVER) {
    try {
      const html = await fetch(`${BASE}${listing}`).then((r) => r.text());
      const match = html.match(pattern);
      if (match) found.add(match[1]);
      else console.warn(`✗ brak przykładu dla ${pattern} na ${listing}`);
    } catch (err) {
      console.warn(`✗ ${listing} — ${err.message}`);
    }
  }
  return [...found];
};

const PAGES = [...STATIC_PAGES, ...(await discoverPages())];

mkdirSync("og-previews", { recursive: true });

for (const page of PAGES) {
  try {
    const html = await fetch(`${BASE}${page}`).then((r) => r.text());
    const match = html.match(/property="og:image" content="([^"]+)"/);
    if (!match) {
      console.warn(`✗ ${page} — brak og:image`);
      continue;
    }
    const ogUrl = match[1].replaceAll("&amp;", "&");
    const res = await fetch(ogUrl);
    if (!res.ok) {
      console.warn(`✗ ${page} — ${res.status} przy pobieraniu obrazu`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const name = page === "/" ? "home" : page.slice(1).replaceAll("/", "_");
    writeFileSync(`og-previews/${name}.png`, buf);
    console.log(`✓ ${page} → og-previews/${name}.png (${Math.round(buf.length / 1024)}kB)`);
  } catch (err) {
    console.warn(`✗ ${page} — ${err.message}`);
  }
}
