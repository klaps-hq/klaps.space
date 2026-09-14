/**
 * Create or update a blog post over Payload's REST API.
 *
 *   node tools/publish-post.mjs ./post.json
 *
 * The JSON describes one post:
 *   {
 *     "title":    "…",
 *     "slug":     "…",
 *     "excerpt":  "…",
 *     "htmlFile": "./body.html",     // converted to Lexical
 *     "coverFile":"./cover.jpg",     // uploaded to media when the post has none
 *     "coverAlt": "…",
 *     "status":   "draft" | "published"   // defaults to draft
 *   }
 *
 * Auth uses a Payload API key, read from PAYLOAD_API_KEY in the environment
 * or .env. Generate one on a user in the admin panel (enable "API Key" on
 * their record); prefer a dedicated service user over a person's account.
 * The key is never printed by this script.
 *
 * Defaults to draft on purpose: publishing is a decision, not a side effect
 * of running a script.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { htmlToLexical } from "./html-to-lexical.mjs";

const SITE = process.env.PAYLOAD_URL ?? "https://klaps.space";

const readEnvKey = async () => {
  if (process.env.PAYLOAD_API_KEY) return process.env.PAYLOAD_API_KEY.trim();
  try {
    const env = await readFile(".env", "utf8");
    const match = env.match(/^PAYLOAD_API_KEY=(.*)$/m);
    if (match) return match[1].trim().replace(/^["']|["']$/g, "");
  } catch {
    // no .env is fine; the variable may come from the environment
  }
  return null;
};

const api = async (apiKey, endpoint, init = {}) => {
  const res = await fetch(`${SITE}/api/${endpoint}`, {
    ...init,
    headers: {
      Authorization: `users API-Key ${apiKey}`,
      ...(init.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...init.headers,
    },
  });
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text.slice(0, 300);
  }
  if (!res.ok) {
    throw new Error(
      `${init.method ?? "GET"} /api/${endpoint} -> ${res.status}\n${JSON.stringify(body, null, 2).slice(0, 900)}`
    );
  }
  return body;
};

const uploadCover = async (apiKey, file, alt) => {
  const bytes = await readFile(file);
  const form = new FormData();
  form.set(
    "file",
    new Blob([bytes], { type: file.endsWith(".png") ? "image/png" : "image/jpeg" }),
    path.basename(file)
  );
  form.set("_payload", JSON.stringify({ alt }));
  const created = await api(apiKey, "media", { method: "POST", body: form });
  return created?.doc?.id ?? created?.id;
};

const main = async () => {
  const configPath = process.argv[2];
  if (!configPath) {
    console.error("Podaj ścieżkę do pliku JSON opisującego wpis.");
    process.exit(1);
  }

  const apiKey = await readEnvKey();
  if (!apiKey) {
    console.error(
      "Brak PAYLOAD_API_KEY. Wygeneruj klucz na użytkowniku w panelu i dodaj go do .env."
    );
    process.exit(1);
  }

  const config = JSON.parse(await readFile(configPath, "utf8"));
  const baseDir = path.dirname(path.resolve(configPath));
  const resolve = (p) => (path.isAbsolute(p) ? p : path.join(baseDir, p));

  const html = await readFile(resolve(config.htmlFile), "utf8");
  const content = htmlToLexical(html);
  const blocks = content.root.children.length;

  // Slug is the identity: a rerun updates the existing post instead of
  // creating a duplicate.
  const existing = await api(
    apiKey,
    `posts?where[slug][equals]=${encodeURIComponent(config.slug)}&limit=1&draft=true`
  );
  const current = existing?.docs?.[0] ?? null;

  let coverImage = current?.coverImage?.id ?? current?.coverImage ?? null;
  if (!coverImage && config.coverFile) {
    coverImage = await uploadCover(
      apiKey,
      resolve(config.coverFile),
      config.coverAlt ?? config.title
    );
    console.log(`Okładka wgrana, id: ${coverImage}`);
  }

  const payload = {
    title: config.title,
    slug: config.slug,
    excerpt: config.excerpt,
    content,
    _status: config.status === "published" ? "published" : "draft",
    ...(coverImage ? { coverImage } : {}),
    ...(config.status === "published" && !current?.publishedAt
      ? { publishedAt: new Date().toISOString() }
      : {}),
  };

  const result = current
    ? await api(apiKey, `posts/${current.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      })
    : await api(apiKey, "posts", {
        method: "POST",
        body: JSON.stringify(payload),
      });

  const doc = result?.doc ?? result;
  console.log(
    `${current ? "Zaktualizowano" : "Utworzono"}: ${doc.title}\n` +
      `  id:     ${doc.id}\n` +
      `  slug:   ${doc.slug}\n` +
      `  status: ${doc._status}\n` +
      `  bloków: ${blocks}\n` +
      `  adres:  ${SITE}/blog/${doc.slug}`
  );
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
