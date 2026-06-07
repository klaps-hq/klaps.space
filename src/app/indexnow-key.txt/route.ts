// IndexNow key file: search engines fetch it to verify host ownership.
// The backend submits changed URLs to api.indexnow.org after repertoire
// updates, with keyLocation pointing at this route. The same key must be
// configured as INDEXNOW_KEY in both deployments.
export async function GET() {
  const key = process.env.INDEXNOW_KEY;

  if (!key) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(key, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
