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
 * Restricts a collection to the requesting user's own record.
 *
 * Used on Users for update and delete: an API key is a long-lived credential
 * living in a deployment's environment, so it must not be able to modify
 * anyone else's account or mint a key on one with more access.
 */
export const onlySelf: Access = ({ req }) =>
  req.user ? { id: { equals: req.user.id } } : false;
