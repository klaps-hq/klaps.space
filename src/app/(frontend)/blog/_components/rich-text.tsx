import React from "react";
import Image from "next/image";
import type {
  DefaultNodeTypes,
  SerializedUploadNode,
} from "@payloadcms/richtext-lexical";
import {
  RichText as PayloadRichText,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";
import type { Media, Post } from "@/payload-types";
import type { IScreeningGroup } from "@/interfaces/IScreenings";
import type { ScreeningBlockFields } from "@/lib/post-screening-blocks";
import PostScreeningsBlock from "./screenings-block";

// The article column is capped at 70ch (~700px), so the optimizer never
// has to serve a wider variant on desktop.
const ARTICLE_IMAGE_SIZES = "(max-width: 768px) 100vw, 700px";

interface UploadFigureProps {
  node: SerializedUploadNode;
}

// Default Lexical converters render uploads as a bare <img> pointing at
// the original file in MinIO. Routing them through next/image gets
// AVIF/WebP, srcset variants and lazy loading for in-article images.
const UploadFigure: React.FC<UploadFigureProps> = ({ node }) => {
  if (node.relationTo !== "media") return null;
  const media = node.value;
  if (typeof media !== "object" || media === null) return null;
  const { url, alt, caption, width, height } = media as Media;
  if (!url) return null;

  return (
    <figure className="mt-8">
      {width && height ? (
        <Image
          src={url}
          alt={alt}
          width={width}
          height={height}
          sizes={ARTICLE_IMAGE_SIZES}
          className="w-full h-auto"
        />
      ) : (
        // Payload measured no intrinsic dimensions, so next/image cannot
        // reserve layout space; fall back to a plain lazy image.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="w-full h-auto"
        />
      )}
      {caption && (
        <figcaption className="mt-3 text-sm text-white/50">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

// Where the block's "see all" link points, per scope.
const moreLinkFor = (
  fields: ScreeningBlockFields
): { href: string; label: string } => {
  if (fields.scope === "city" && fields.citySlug) {
    return {
      href: `/miasta/${fields.citySlug.trim()}`,
      label: "Wszystkie seanse w tym mieście",
    };
  }
  if (fields.scope === "genre" && fields.genreSlug) {
    return {
      href: `/gatunki/${fields.genreSlug.trim()}`,
      label: "Wszystkie seanse w tym gatunku",
    };
  }
  return { href: "/seanse", label: "Wszystkie seanse" };
};

interface RichTextProps {
  data: Post["content"];
  // Screenings resolved by the page, keyed by block id. Lexical converters
  // are synchronous, so a block cannot fetch its own data here.
  screeningsByBlockId?: Record<string, IScreeningGroup[]>;
}

const buildConverters = (
  screeningsByBlockId: Record<string, IScreeningGroup[]>
): JSXConvertersFunction<DefaultNodeTypes> =>
  ({ defaultConverters }) => ({
    ...defaultConverters,
    upload: ({ node }) => <UploadFigure node={node} />,
    blocks: {
      // Typed locally: `payload generate:types` starts but never writes a
      // file in this repo, so payload-types.ts has no entry for this block.
      // (`generate:importmap` does work, since the revalidate hook stopped
      // importing next/cache at module load.)
      screenings: ({ node }: { node: { fields: ScreeningBlockFields } }) => {
        const fields = node.fields;
        const screenings = fields.id
          ? (screeningsByBlockId[fields.id] ?? [])
          : [];
        const { href, label } = moreLinkFor(fields);
        return (
          <PostScreeningsBlock
            heading={fields.heading}
            screenings={screenings}
            moreHref={href}
            moreLabel={label}
          />
        );
      },
    },
  });

const RichText: React.FC<RichTextProps> = ({
  data,
  screeningsByBlockId = {},
}) => (
  <PayloadRichText
    data={data}
    converters={buildConverters(screeningsByBlockId)}
  />
);

export default RichText;
