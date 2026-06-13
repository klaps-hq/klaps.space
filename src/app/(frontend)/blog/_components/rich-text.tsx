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

const converters: JSXConvertersFunction<DefaultNodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  upload: ({ node }) => <UploadFigure node={node} />,
});

interface RichTextProps {
  data: Post["content"];
}

const RichText: React.FC<RichTextProps> = ({ data }) => (
  <PayloadRichText data={data} converters={converters} />
);

export default RichText;
