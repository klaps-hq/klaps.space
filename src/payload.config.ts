import path from "path";
import { fileURLToPath } from "url";

import sharp from "sharp";
import { buildConfig } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { s3Storage } from "@payloadcms/storage-s3";
import { en } from "@payloadcms/translations/languages/en";
import { pl } from "@payloadcms/translations/languages/pl";

import { Media } from "./collections/Media";
import { Posts } from "./collections/Posts";
import { Users } from "./collections/Users";
import { SITE_URL } from "@/lib/site-config";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: " - Klaps CMS",
    },
  },
  collections: [Posts, Media, Users],
  editor: lexicalEditor(),
  i18n: {
    fallbackLanguage: "pl",
    supportedLanguages: { en, pl },
  },
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || "",
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  sharp,
  plugins: [
    // On the server media lives in MinIO (S3 API); without S3_BUCKET set
    // (local dev) uploads fall back to the local filesystem (public/media).
    s3Storage({
      enabled: Boolean(process.env.S3_BUCKET),
      collections: {
        media: {
          // Serve files straight from the public S3 domain instead of
          // proxying through Payload. URLs use MinIO's path-style layout:
          // <public-url>/<bucket>/<key>.
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => {
            const base =
              process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT || "";
            const key = prefix ? `${prefix}/${filename}` : filename;
            return `${base}/${process.env.S3_BUCKET}/${key}`;
          },
        },
      },
      bucket: process.env.S3_BUCKET || "",
      config: {
        endpoint: process.env.S3_ENDPOINT || "",
        region: process.env.S3_REGION || "us-east-1",
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
        },
        // MinIO requires path-style URLs (bucket in the path, not the host)
        forcePathStyle: true,
      },
    }),
    seoPlugin({
      collections: ["posts"],
      uploadsCollection: "media",
      tabbedUI: true,
      // No "- Klaps" suffix here: the frontend layout's title template
      // appends it, so storing it in meta.title would double it up.
      generateTitle: ({ doc }) => doc?.title ?? "",
      generateDescription: ({ doc }) => doc?.excerpt ?? "",
      generateURL: ({ doc }) =>
        doc?.slug ? `${SITE_URL}/blog/${doc.slug}` : `${SITE_URL}/blog`,
    }),
  ],
});
