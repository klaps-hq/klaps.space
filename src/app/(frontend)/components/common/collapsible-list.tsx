import React from "react";

interface CollapsibleListProps {
  /** One <li> per item, already keyed. */
  items: React.ReactElement[];
  /** Items shown before the "show more" toggle. */
  visible?: number;
  /** Toggle label for the folded rest, e.g. "Pokaż wszystkie (24)". */
  moreLabel: (hidden: number) => React.ReactNode;
  className?: string;
}

const LIST_CLASS = "grid grid-cols-1 sm:grid-cols-2 gap-x-10";

export const ROW_CLASS =
  "flex items-baseline justify-between gap-4 border-t border-white/10 py-3";

/**
 * Two-column row list that folds long tails into <details>. The folded
 * items stay in the server HTML (crawlable, findable with Ctrl+F); only
 * their display waits for a click.
 */
const CollapsibleList = ({
  items,
  visible = 10,
  moreLabel,
  className,
}: CollapsibleListProps) => {
  // Folding one or two items saves nothing and costs a click.
  const fold = items.length > visible + 2;
  const shown = fold ? items.slice(0, visible) : items;
  const rest = fold ? items.slice(visible) : [];

  return (
    <div className={className}>
      <ul className={LIST_CLASS}>{shown}</ul>
      {rest.length > 0 && (
        <details className="group">
          <summary className="mt-4 inline-flex cursor-pointer list-none items-center gap-2 text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-white/55 hover:text-white transition-colors group-open:hidden">
            {moreLabel(rest.length)}
            <span aria-hidden="true" className="text-sm leading-none">
              +
            </span>
          </summary>
          <ul className={LIST_CLASS}>{rest}</ul>
        </details>
      )}
    </div>
  );
};

export default CollapsibleList;
