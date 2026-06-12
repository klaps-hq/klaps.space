import path from "path";
import { fileURLToPath } from "url";
import type { CollectionConfig } from "payload";

import { anyone, authenticated } from "../access/authenticated";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: "Plik",
    plural: "Media",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  upload: {
    // Files land in public/media so Next.js serves them statically. The
    // directory is gitignored; production needs a mounted volume or an
    // object-storage adapter (e.g. @payloadcms/storage-s3) before launch.
    staticDir: path.resolve(dirname, "../../public/media"),
    mimeTypes: ["image/*"],
    focalPoint: true,
    imageSizes: [
      {
        name: "thumbnail",
        width: 480,
        position: "centre",
      },
      {
        // Matches the OG image canvas so post covers can be reused in
        // file-based opengraph-image routes without recropping.
        name: "og",
        width: 1200,
        height: 630,
        position: "centre",
      },
    ],
    adminThumbnail: "thumbnail",
  },
  fields: [
    {
      name: "alt",
      label: "Tekst alternatywny",
      type: "text",
      required: true,
      admin: {
        description: "Opis obrazka dla czytników ekranu i SEO.",
      },
    },
    {
      name: "caption",
      label: "Podpis",
      type: "text",
    },
  ],
};
