import type { Post } from "@/payload-types";

/**
 * FAQ pairs pulled from a post's "Najczęstsze pytania" section, for
 * FAQPage JSON-LD. Posts write that section as an H2 whose text mentions
 * "pytania", followed by question paragraphs (bold only, ending with "?")
 * each followed by one or more answer paragraphs, until the next H2; or as
 * paragraphs that open with the bold question and go on with the answer. The
 * answers are the exact paragraph texts, as Google requires the markup to
 * match visible content. An empty list when a post has no such section.
 */

interface LexicalNode {
  type?: string;
  tag?: string;
  text?: string;
  format?: number | string;
  children?: LexicalNode[];
}

export interface PostFaqItem {
  q: string;
  a: string;
}

// Lexical text format bit for bold.
const IS_BOLD = 1;

const nodeText = (node: LexicalNode): string =>
  node.text ?? (node.children ?? []).map(nodeText).join("");

const isQuestion = (node: LexicalNode): boolean => {
  if (node.type !== "paragraph") return false;
  const texts = (node.children ?? []).filter((child) => child.type === "text");
  return (
    texts.length > 0 &&
    texts.every(
      (child) => typeof child.format === "number" && (child.format & IS_BOLD) !== 0
    ) &&
    nodeText(node).trim().endsWith("?")
  );
};

const isBold = (node: LexicalNode): boolean =>
  typeof node.format === "number" && (node.format & IS_BOLD) !== 0;

/**
 * The second FAQ style some posts use: one paragraph that opens with the
 * bold question ("**Czy trzeba rezerwować?** Zwykle nie...") and continues
 * with the plain answer.
 */
const inlineQuestion = (node: LexicalNode): PostFaqItem | null => {
  if (node.type !== "paragraph") return null;
  const children = node.children ?? [];
  const split = children.findIndex((child) => !isBold(child));
  if (split <= 0) return null;
  const q = children.slice(0, split).map(nodeText).join("").trim();
  const a = children.slice(split).map(nodeText).join("").trim();
  return q.endsWith("?") && a ? { q, a } : null;
};

export const extractPostFaq = (content: Post["content"]): PostFaqItem[] => {
  const nodes = ((content as { root?: LexicalNode } | null)?.root?.children ??
    []) as LexicalNode[];
  const start = nodes.findIndex(
    (node) =>
      node.type === "heading" &&
      node.tag === "h2" &&
      /pytania/i.test(nodeText(node))
  );
  if (start === -1) return [];

  const items: PostFaqItem[] = [];
  let current: { q: string; answer: string[] } | null = null;
  const flush = () => {
    if (current && current.answer.length > 0) {
      items.push({ q: current.q, a: current.answer.join(" ") });
    }
  };

  for (const node of nodes.slice(start + 1)) {
    if (node.type === "heading" && node.tag === "h2") break;
    const inline = inlineQuestion(node);
    if (inline) {
      // Question and answer in one paragraph: a pair of its own.
      flush();
      current = null;
      items.push(inline);
    } else if (isQuestion(node)) {
      flush();
      current = { q: nodeText(node).trim(), answer: [] };
    } else if (current && node.type === "paragraph") {
      const text = nodeText(node).trim();
      if (text) current.answer.push(text);
    }
  }
  flush();
  return items;
};
