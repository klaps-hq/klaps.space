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
