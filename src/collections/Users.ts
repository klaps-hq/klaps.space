import type { CollectionConfig } from "payload";

import { authenticated, onlySelf } from "../access/authenticated";

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
    // Own record only. Before API keys existed this mattered less, because
    // reaching it meant logging in with a password. A long-lived key sitting
    // in a deployment's env is a different exposure: without this, a leaked
    // key could change another user's email or password, or switch on an API
    // key for an account with more access, and own the CMS.
    //
    // A proper role model (admin vs editor) is the real fix and would also
    // let create and read be scoped; tracked separately. This is the part
    // that closes account takeover without changing how the panel is used.
    delete: onlySelf,
    update: onlySelf,
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
