/**
 * Minimal HTML to Lexical converter for article bodies.
 *
 * Payload's own `convertHTMLToLexical` needs a DOM implementation (jsdom),
 * which this project does not depend on. Article bodies here use a small,
 * known set of tags, so a focused converter avoids pulling a browser engine
 * into the toolchain.
 *
 * Supported: <p>, <h2>, <h3>, <h4>, <ul>/<ol> with <li>, <blockquote>, and
 * inline <a>, <strong>/<b>, <em>/<i>. Anything else is flattened to text, so
 * an unsupported tag loses its formatting rather than corrupting the tree.
 *
 * Links must be absolute: Payload rejects relative URLs in rich text.
 */

const TEXT_FORMAT = { none: 0, bold: 1, italic: 2 };

const decodeEntities = (text) =>
  text
    .replace(/&nbsp;/g, " ")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const textNode = (text, format = TEXT_FORMAT.none) => ({
  type: "text",
  detail: 0,
  format,
  mode: "normal",
  style: "",
  text,
  version: 1,
});

const linkNode = (url, children) => ({
  type: "link",
  children,
  direction: "ltr",
  fields: {
    linkType: "custom",
    newTab: /^https?:\/\/(?!klaps\.space)/.test(url),
    url,
  },
  format: "",
  indent: 0,
  version: 3,
});

/**
 * Inline markup to Lexical children. Walks the string once, tracking the
 * bold/italic state, and emits a link node whenever an <a> closes.
 */
const parseInline = (html) => {
  const children = [];
  let format = TEXT_FORMAT.none;
  let rest = html;

  while (rest.length > 0) {
    const tag = rest.match(/<(\/?)(a|strong|b|em|i)\b([^>]*)>/i);

    if (!tag) {
      const text = decodeEntities(rest);
      if (text) children.push(textNode(text, format));
      break;
    }

    const before = decodeEntities(rest.slice(0, tag.index));
    if (before) children.push(textNode(before, format));

    const [full, closing, rawName, attrs] = tag;
    const name = rawName.toLowerCase();
    rest = rest.slice(tag.index + full.length);

    if (name === "a" && !closing) {
      const href = attrs.match(/href="([^"]*)"/i)?.[1] ?? "";
      const end = rest.search(/<\/a>/i);
      const inner = end === -1 ? rest : rest.slice(0, end);
      rest = end === -1 ? "" : rest.slice(end + 4);
      // Nested links are not a thing; inner markup still gets parsed.
      children.push(linkNode(href, parseInline(inner)));
      continue;
    }

    if (name === "strong" || name === "b") {
      format = closing
        ? format & ~TEXT_FORMAT.bold
        : format | TEXT_FORMAT.bold;
      continue;
    }

    if (name === "em" || name === "i") {
      format = closing
        ? format & ~TEXT_FORMAT.italic
        : format | TEXT_FORMAT.italic;
      continue;
    }
  }

  return children.length > 0 ? children : [textNode("")];
};

const block = (type, children, extra = {}) => ({
  type,
  children,
  direction: "ltr",
  format: "",
  indent: 0,
  version: 1,
  ...extra,
});

const listItems = (html) =>
  [...html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((match, index) =>
    block("listitem", parseInline(match[1].trim()), {
      value: index + 1,

    })
  );

/** HTML article body to the Lexical editor state Payload stores. */
export const htmlToLexical = (html) => {
  const children = [];
  const blockPattern =
    /<(p|h2|h3|h4|ul|ol|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/gi;

  for (const [, rawTag, inner] of html.matchAll(blockPattern)) {
    const tag = rawTag.toLowerCase();
    const content = inner.trim();
    if (!content) continue;

    if (tag === "p") {
      children.push(block("paragraph", parseInline(content), { textFormat: 0 }));
    } else if (tag === "h2" || tag === "h3" || tag === "h4") {
      children.push(block("heading", parseInline(content), { tag }));
    } else if (tag === "ul" || tag === "ol") {
      children.push(
        block("list", listItems(content), {
          listType: tag === "ul" ? "bullet" : "number",
          start: 1,
          tag,
        })
      );
    } else if (tag === "blockquote") {
      children.push(block("quote", parseInline(content)));
    }
  }

  if (children.length === 0) {
    throw new Error("Konwersja nie dała żadnych bloków - sprawdź wejściowy HTML");
  }

  return {
    root: {
      type: "root",
      children,
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    },
  };
};

export default htmlToLexical;
