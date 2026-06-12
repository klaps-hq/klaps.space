import type { CollectionConfig } from "payload";
import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";

import { authenticated, authenticatedOrPublished } from "../access/authenticated";
import { slugField } from "../fields/slug";
import { pingIndexNow } from "./hooks/ping-indexnow";
import { revalidateDeletedPost, revalidatePost } from "./hooks/revalidate-post";

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: {
    singular: "Wpis",
    plural: "Wpisy",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status", "publishedAt"],
  },
  hooks: {
    // Revalidate first so search engines pinged by IndexNow fetch the
    // already refreshed pages.
    afterChange: [revalidatePost, pingIndexNow],
    afterDelete: [revalidateDeletedPost],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 1500,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  fields: [
    {
      name: "title",
      label: "Tytuł",
      type: "text",
      required: true,
    },
    {
      name: "excerpt",
      label: "Zajawka",
      type: "textarea",
      required: true,
      maxLength: 300,
      admin: {
        description:
          "Krótki opis wpisu na listingu bloga, używany też jako domyślny opis meta.",
      },
    },
    {
      name: "coverImage",
      label: "Okładka",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "content",
      label: "Treść",
      type: "richText",
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }),
          HorizontalRuleFeature(),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          // Custom blocks (e.g. embedded screenings pulled from the
          // repertoire API) plug in here via BlocksFeature as they are built.
        ],
      }),
    },
    slugField(),
    {
      name: "publishedAt",
      label: "Data publikacji",
      type: "date",
      index: true,
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            // Stamp the first publish automatically; editors can override.
            if (siblingData._status === "published" && !value) {
              return new Date();
            }
            return value;
          },
        ],
      },
    },
    {
      name: "author",
      label: "Autor",
      type: "relationship",
      relationTo: "users",
      admin: {
        position: "sidebar",
      },
      hooks: {
        beforeChange: [
          ({ req, value }) => value ?? req.user?.id ?? value,
        ],
      },
    },
  ],
};
