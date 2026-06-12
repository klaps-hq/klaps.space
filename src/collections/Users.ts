import type { CollectionConfig } from "payload";

import { authenticated } from "../access/authenticated";

export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: "Użytkownik",
    plural: "Użytkownicy",
  },
  auth: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
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
