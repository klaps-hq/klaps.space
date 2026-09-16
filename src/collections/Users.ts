import type { CollectionConfig } from "payload";

import {
  authenticated,
  fullForUsersSelfForApiKeys,
} from "../access/authenticated";

export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: "Użytkownik",
    plural: "Użytkownicy",
  },
  // API keys let trusted tooling write to the CMS over REST without handling
  // a password. A key authenticates as the user it belongs to, grants exactly
  // that user's access and nothing more, and is revocable from their record.
  // Prefer a dedicated service user over enabling it on a person's account,
  // so rotating the key never locks a human out.
  auth: {
    useAPIKey: true,
  },
  access: {
    create: authenticated,
    read: authenticated,
    // People signed into the panel keep full access; an API key is confined
    // to its own record, so a leaked key cannot change someone else's
    // credentials or switch on a key for an account with more access.
    //
    // A proper role model (admin vs editor) is the real fix and would let
    // create and read be scoped too; tracked separately.
    delete: fullForUsersSelfForApiKeys,
    update: fullForUsersSelfForApiKeys,
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email"],
  },
  fields: [
    {
      name: "name",
      label: "Imię i nazwisko",
      type: "text",
      required: true,
    },
  ],
  timestamps: true,
};
