export async function onRequestPost() {
  return new Response(JSON.stringify({ error: 'Token refresh is not supported for GitHub OAuth.' }), {
    status: 400,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

