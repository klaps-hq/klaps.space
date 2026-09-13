import { IScreeningGroup } from "@/interfaces/IScreenings";
import { getCityBySlug } from "./cities";
import { getGenrePageData } from "./genres";
import { getScreenings } from "./screenings";

/**
 * Resolves the `screenings` blocks embedded in a post's rich text.
 *
 * Lexical's JSX converters are synchronous, so a block cannot fetch its own
 * data while rendering. The post page calls this first, then hands the
 * result to RichText, which keeps the showtimes in the server HTML instead
 * of loading them after hydration.
 */

export interface ScreeningBlockFields {
  id?: string | null;
  blockType?: string;
  heading?: string | null;
  scope?: "all" | "city" | "genre" | null;
  citySlug?: string | null;
  genreSlug?: string | null;
  limit?: number | null;
}

const DEFAULT_LIMIT = 8;

// Lexical serializes to a tree of nodes, each optionally holding children;
// block nodes carry their field values under `fields`.
interface LexicalNode {
  type?: string;
  fields?: ScreeningBlockFields;
  children?: LexicalNode[];
}

const collect = (node: LexicalNode, found: ScreeningBlockFields[]): void => {
  if (node.type === "block" && node.fields?.blockType === "screenings") {
    found.push(node.fields);
  }
  for (const child of node.children ?? []) collect(child, found);
};

export const collectScreeningBlocks = (
  content: unknown
): ScreeningBlockFields[] => {
  const root = (content as { root?: LexicalNode } | null)?.root;
  if (!root) return [];
  const found: ScreeningBlockFields[] = [];
  collect(root, found);
  return found;
};

const fetchForBlock = async (
  block: ScreeningBlockFields
): Promise<IScreeningGroup[]> => {
  const limit = block.limit ?? DEFAULT_LIMIT;

  try {
    if (block.scope === "city" && block.citySlug) {
      const { screenings } = await getCityBySlug(block.citySlug.trim());
      const groups = Array.isArray(screenings)
        ? screenings
        : [...(screenings?.data ?? [])];
      return groups.slice(0, limit);
    }

    if (block.scope === "genre" && block.genreSlug) {
      const genre = await getGenrePageData(block.genreSlug.trim());
      const groups = await getScreenings({ genreId: genre.id.toString() });
      return groups.slice(0, limit);
    }

    const groups = await getScreenings({});
    return groups.slice(0, limit);
  } catch {
    // A bad slug or an API hiccup must not take the article down; the block
    // renders nothing and the prose around it still reads.
    return [];
  }
};

/**
 * Block id to its screenings. Blocks without an id are skipped: Payload
 * assigns one to every block instance, and without it the renderer has no
 * way to match data back to the node.
 */
export const resolveScreeningBlocks = async (
  content: unknown
): Promise<Record<string, IScreeningGroup[]>> => {
  const blocks = collectScreeningBlocks(content).filter((b) => b.id);
  if (blocks.length === 0) return {};

  const entries = await Promise.all(
    blocks.map(
      async (block) => [block.id as string, await fetchForBlock(block)] as const
    )
  );

  return Object.fromEntries(entries);
};
