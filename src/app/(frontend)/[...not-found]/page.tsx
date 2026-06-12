import { notFound } from "next/navigation";

// With the root layout moved into the (frontend) route group, Next.js no
// longer has a root-level not-found boundary for unmatched URLs. This
// catch-all funnels every unknown path into the (frontend) not-found page,
// keeping the custom 404 design. Explicit routes (including /admin and /api
// from the (payload) group) always take precedence over a catch-all.
const CatchAllNotFound = () => {
  notFound();
};

export default CatchAllNotFound;
