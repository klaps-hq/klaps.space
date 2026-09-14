import type { Access, PayloadRequest } from "payload";

export const authenticated: Access = ({ req }) => Boolean(req.user);

// Read access for content collections: editors see everything, the public
// only gets documents whose current version is published.
export const authenticatedOrPublished: Access = ({
  req,
}: {
  req: PayloadRequest;
}) => {
  if (req.user) {
    return true;
  }

  return {
    _status: {
      equals: "published",
    },
  };
};

export const anyone: Access = () => true;

/**
 * Full access for a signed-in person, own record only for an API key.
 *
 * The two credentials carry different risk. A panel session is short-lived
 * and behind a password, so an admin editing a colleague's account is normal
 * work. An API key is long-lived and sits in a deployment's environment, so
 * a leaked one must not be able to change someone else's credentials or
 * switch on a key for an account with more access.
 *
 * Scoping both the same way looked safer but broke the panel: an admin could
 * no longer edit user records at all. Payload tags the request with the
 * strategy that authenticated it, so the rule can tell them apart.
 *
 * Replace this once Users carry roles: then `create` and `read` can be
 * scoped too, which this cannot do.
 */
export const fullForUsersSelfForApiKeys: Access = ({ req }) => {
  if (!req.user) return false;
  // `_strategy` is attached by whichever auth strategy resolved the request.
  // It is absent from the generated User type because it is not a stored
  // field, so read it through a narrow cast rather than widening the type.
  const strategy = (req.user as { _strategy?: string })._strategy;
  if (strategy !== "api-key") return true;
  return { id: { equals: req.user.id } };
};
